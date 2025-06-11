using System.Net.Http;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;
using System;
using System.Text.Json.Serialization;
using BackendDataAccess.Repositories.IRepositories;
using BackendModels;
using backend.Models;
using System.Linq;
using System.Collections.Generic;
using System.Text.RegularExpressions;

namespace backend.Services
{
    public class GigaChatService
    {
        private readonly HttpClient _httpClient;
        private readonly string _authKey;
        private readonly string _tokenUrl;
        private readonly string _apiUrl;
        private string _accessToken;
        private DateTime _tokenExpiration;
        private readonly IDeviceRepository _deviceRepository;
        private readonly string _sessionId;

        public GigaChatService(IConfiguration configuration, IDeviceRepository deviceRepository)
        {
            _httpClient = new HttpClient();
            _authKey = configuration["GigaChat:AuthKey"];
            _tokenUrl = "https://ngw.devices.sberbank.ru:9443/api/v2/oauth";
            _apiUrl = configuration["GigaChat:ApiUrl"];
            _deviceRepository = deviceRepository;
            _sessionId = Guid.NewGuid().ToString();
        }

        private async Task<string> GetAccessTokenAsync()
        {
            if (!string.IsNullOrEmpty(_accessToken) && DateTime.UtcNow < _tokenExpiration)
            {
                return _accessToken;
            }

            var requestBody = new FormUrlEncodedContent(new[]
            {
                new KeyValuePair<string, string>("scope", "GIGACHAT_API_PERS")
            });

            var request = new HttpRequestMessage(HttpMethod.Post, _tokenUrl);
            request.Headers.Add("Authorization", $"Basic {_authKey}");
            request.Headers.Add("RqUID", "0b862e8b-90bd-4c63-a97b-49bc3f8ae5f9");
            request.Headers.Add("Accept", "application/json");
            request.Content = requestBody;

            var response = await _httpClient.SendAsync(request);
            var responseContent = await response.Content.ReadAsStringAsync();
            response.EnsureSuccessStatusCode();

            var tokenResponse = JsonSerializer.Deserialize<TokenResponse>(responseContent);
            _accessToken = tokenResponse.AccessToken;
            _tokenExpiration = DateTime.UtcNow.AddSeconds(tokenResponse.ExpiresIn - 60);

            return _accessToken;
        }

        public async Task<(string recommendation, Device recommendedDevice)> GetDeviceRecommendation(string userQuery, List<Models.ChatMessage> chatHistory = null)
        {
            try
            {
                // Получаем все устройства из базы данных
                var devices = await _deviceRepository.GetAllAsync();
                var devicesList = devices.ToList();

                if (!devicesList.Any())
                {
                    return ("Извините, в базе данных нет доступных устройств.", null);
                }

                // Формируем информацию об устройствах для ИИ
                var devicesInfo = string.Join("\n", devicesList.Select(d =>
                {
                    var characteristicsInfo = d.Characteristics != null && d.Characteristics.Any()
                        ? ", Характеристики: " + string.Join(", ", d.Characteristics.Select(c => $"{c.PossibleCharacteristic.Name}: {c.Value} {c.PossibleCharacteristic.Unit}"))
                        : "";

                    return $"ID: {d.Id}, " +
                           $"Тип устройства: {d.DeviceType?.Name}, " +
                           $"Описание: {d.Description}, " +
                           $"Макс. расход воздуха: {d.MaxAirflow} м³/ч, " +
                           $"Потребляемая мощность: {d.PowerConsumption} Вт, " +
                           $"Уровень шума: {d.NoiseLevel} дБ, " +
                           $"Цена: {d.Price} руб." +
                           characteristicsInfo;
                }));

                Console.WriteLine($"Available Devices for AI:\n{devicesInfo}");

                var accessToken = await GetAccessTokenAsync();

                // Создаем список сообщений для отправки в GigaChat
                var messages = new List<object>();

                // Добавляем системное сообщение (инструкции для ИИ)
                messages.Add(new
                {
                    role = "system",
                    content = "Ты - консультант по подбору устройств вентиляции компании Tion. Твоя задача - помочь пользователю выбрать подходящее устройство на основе его запроса. Используй предоставленный список доступных устройств для рекомендации. Если пользователь ссылается на предыдущие рекомендации, учитывай контекст разговора. КРАЙНЕ ВАЖНО: Если ты рекомендуешь конкретное устройство, ОБЯЗАТЕЛЬНО укажи его ID в своем ответе в формате (ID: X), где X - числовой ID устройства из списка доступных устройств. Твой ответ должен быть максимально кратким и лаконичным, вмещаясь в 1-2 предложения. НИ В КОЕМ СЛУЧАЕ НЕ УПОМИНАЙ КАКИЕ-ЛИБО НАЗВАНИЯ УСТРОЙСТВ В ТЕКСТЕ РЕКОМЕНДАЦИИ! Просто предоставь краткую рекомендацию и ID. Если ты не рекомендуешь конкретное устройство, НЕ УКАЗЫВАЙ этот ID тег. Не нужно дублировать всю информацию об устройстве в тексте ответа. Фронтенд самостоятельно отобразит информацию об устройстве на основе предоставленного ID. Вот список доступных устройств:\n" + devicesInfo + "\n\n"
                });

                // Добавляем историю чата (если есть)
                if (chatHistory != null && chatHistory.Any())
                {
                    foreach (var message in chatHistory)
                    {
                        messages.Add(new
                        {
                            role = message.Role,
                            content = message.Content
                        });
                    }
                }

                // Формируем запрос к GigaChat API
                var requestBody = new
                {
                    model = "GigaChat",
                    messages = messages
                };

                var jsonContent = JsonSerializer.Serialize(requestBody);
                var content = new StringContent(jsonContent, Encoding.UTF8, "application/json");

                var request = new HttpRequestMessage(HttpMethod.Post, _apiUrl);
                request.Headers.Add("Authorization", $"Bearer {accessToken}");
                request.Headers.Add("X-Session-ID", _sessionId);
                request.Content = content;

                // Отправляем запрос и получаем ответ
                var response = await _httpClient.SendAsync(request);
                var responseContent = await response.Content.ReadAsStringAsync();

                Console.WriteLine($"Raw GigaChat API Response: {responseContent}");

                if (!response.IsSuccessStatusCode)
                {
                    throw new HttpRequestException($"GigaChat API error: {response.StatusCode} - {responseContent}");
                }

                var responseObject = JsonSerializer.Deserialize<GigaChatResponse>(responseContent);

                if (responseObject?.Choices == null || responseObject.Choices.Length == 0)
                {
                    return ("Извините, не удалось получить рекомендацию.", null);
                }

                var recommendation = responseObject.Choices[0].Message?.Content;
                if (string.IsNullOrEmpty(recommendation))
                {
                    return ("Извините, не удалось получить рекомендацию.", null);
                }

                // Ищем упоминание устройства в ответе
                Device recommendedDevice = null;
                var deviceIdMatch = System.Text.RegularExpressions.Regex.Match(recommendation, @"ID: (\d+)");

                if (deviceIdMatch.Success)
                {
                    if (int.TryParse(deviceIdMatch.Groups[1].Value, out int deviceId))
                    {
                        recommendedDevice = devicesList.FirstOrDefault(d => d.Id == deviceId);
                    }
                    // Удаляем блок "Рекомендуемое устройство" из рекомендации
                    recommendation = System.Text.RegularExpressions.Regex.Replace(recommendation, @"\s*Рекомендуемое устройство:\s*ID: \d+\s*Устройство: .*?Характеристики: .*?(?=\n\n|\Z)", "", System.Text.RegularExpressions.RegexOptions.Singleline);
                    // Если блок не найден, но ID был, удаляем только ID (если он остался в тексте отдельно)
                    recommendation = System.Text.RegularExpressions.Regex.Replace(recommendation, @"\(ID: \d+\)\s*", "");
                    recommendation = System.Text.RegularExpressions.Regex.Replace(recommendation, @"ID: \d+\s*", "");
                }

                return (recommendation, recommendedDevice);
            }
            catch (Exception ex)
            {
                throw;
            }
        }
    }

    // Классы для API остаются здесь
    public class TokenResponse
    {
        [JsonPropertyName("access_token")]
        public string AccessToken { get; set; }

        [JsonPropertyName("expires_at")]
        public long ExpiresAt { get; set; }

        [JsonPropertyName("expires_in")]
        public int ExpiresIn { get; set; }

        [JsonPropertyName("scope")]
        public string Scope { get; set; }

        [JsonPropertyName("token_type")]
        public string TokenType { get; set; }
    }

    public class GigaChatResponse
    {
        [JsonPropertyName("choices")]
        public Choice[] Choices { get; set; }
    }

    public class Choice
    {
        [JsonPropertyName("message")]
        public Message Message { get; set; }
    }

    public class Message
    {
        [JsonPropertyName("content")]
        public string Content { get; set; }
    }
}
using System.Net.Http;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;
using System;
using System.Text.Json.Serialization;
using BackendDataAccess.Repositories.IRepositories;
using BackendModels;
using System.Linq;

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

        public GigaChatService(IConfiguration configuration, IDeviceRepository deviceRepository)
        {
            _httpClient = new HttpClient();
            _authKey = configuration["GigaChat:AuthKey"];
            _tokenUrl = "https://ngw.devices.sberbank.ru:9443/api/v2/oauth";
            _apiUrl = configuration["GigaChat:ApiUrl"];
            _deviceRepository = deviceRepository;
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

        public async Task<string> GetDeviceRecommendation(string userQuery)
        {
            try
            {
                var devices = await _deviceRepository.GetAllAsync();
                var devicesList = devices.ToList();

                if (!devicesList.Any())
                {
                    return "Извините, в базе данных нет доступных устройств.";
                }

                var devicesInfo = string.Join("\n", devicesList.Select(d => 
                    $"Устройство: {d.Name}, " +
                    $"Описание: {d.Description}, " +
                    $"Макс. расход воздуха: {d.MaxAirflow} м³/ч, " +
                    $"Потребляемая мощность: {d.PowerConsumption} Вт, " +
                    $"Уровень шума: {d.NoiseLevel} дБ, " +
                    $"Цена: {d.Price} руб."));

                var accessToken = await GetAccessTokenAsync();

                var requestBody = new
                {
                    model = "GigaChat",
                    messages = new[]
                    {
                        new
                        {
                            role = "system",
                            content = "Ты - консультант по подбору устройств вентиляции компании Tion. " +
                                    "Вот список доступных устройств:\n" + devicesInfo + "\n\n" +
                                    "Твоя задача - помочь пользователю выбрать подходящее устройство на основе его запроса. " +
                                    "Используй информацию из списка устройств для рекомендации. " +
                                    "Отвечай, указывая конкретные модели из списка."
                        },
                        new
                        {
                            role = "user",
                            content = userQuery
                        }
                    }
                };

                var jsonContent = JsonSerializer.Serialize(requestBody);
                var content = new StringContent(jsonContent, Encoding.UTF8, "application/json");

                var request = new HttpRequestMessage(HttpMethod.Post, _apiUrl);
                request.Headers.Add("Authorization", $"Bearer {accessToken}");
                request.Content = content;

                var response = await _httpClient.SendAsync(request);
                var responseContent = await response.Content.ReadAsStringAsync();

                if (!response.IsSuccessStatusCode)
                {
                    throw new HttpRequestException($"GigaChat API error: {response.StatusCode} - {responseContent}");
                }

                var responseObject = JsonSerializer.Deserialize<GigaChatResponse>(responseContent);
                
                if (responseObject?.Choices == null || responseObject.Choices.Length == 0)
                {
                    return "Извините, не удалось получить рекомендацию.";
                }

                var recommendation = responseObject.Choices[0].Message?.Content;
                if (string.IsNullOrEmpty(recommendation))
                {
                    return "Извините, не удалось получить рекомендацию.";
                }

                return recommendation;
            }
            catch (Exception ex)
            {
                throw;
            }
        }
    }

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
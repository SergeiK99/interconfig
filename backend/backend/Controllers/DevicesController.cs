using backend.DTOs;
using backend.Services;
using BackendDataAccess.Repositories.IRepositories;
using BackendModels;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Hosting;
using backend.Extensions;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
using System.Text.Json;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DevicesController : ControllerBase
    {
        private readonly IDeviceRepository _deviceRepo;
        private readonly AddDeviceService _addDeviceService;
        private readonly UpdateDeviceService _updateDeviceService;
        private readonly ImageService _imageService;
        private readonly DeviceMappingService _mappingService;
        private readonly DeviceConfiguratorService _configuratorService;

        public DevicesController(
            IDeviceRepository deviceRepo, 
            AddDeviceService addDeviceService,
            UpdateDeviceService updateDeviceService,
            ImageService imageService,
            DeviceMappingService mappingService,
            DeviceConfiguratorService configuratorService)
        {
            _deviceRepo = deviceRepo;
            _addDeviceService = addDeviceService;
            _updateDeviceService = updateDeviceService;
            _imageService = imageService;
            _mappingService = mappingService;
            _configuratorService = configuratorService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var devices = await _deviceRepo.GetAllAsync();
            var result = devices.Select(device => _mappingService.MapToDetailsDto(device)).ToList();
            return Ok(result);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var device = await _deviceRepo.GetByIdAsync(id);
            if (device == null)
                return NotFound();
            var result = _mappingService.MapToDetailsDto(device);
            return Ok(result);
        }

        [HttpPost]
        [DisableRequestSizeLimit]
        [RequestFormLimits(MultipartBodyLengthLimit = int.MaxValue)]
        public async Task<IActionResult> Create([FromForm] DeviceDto deviceDto, IFormFile image)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            // --- Универсальный парсинг характеристик ---
            if (Request.Form.TryGetValue("characteristics", out var characteristicsJson))
            {
                try
                {
                    deviceDto.Characteristics = JsonSerializer.Deserialize<List<CharacteristicCreateDto>>(
                        characteristicsJson,
                        new JsonSerializerOptions { PropertyNameCaseInsensitive = true }
                    );
                }
                catch (JsonException ex)
                {
                    return BadRequest($"Некорректный формат JSON для характеристик: {ex.Message}");
                }
            }
            else
            {
                // Fallback: если пришли пары possibleCharacteristicId и value
                var possibleCharacteristicIds = Request.Form["possibleCharacteristicId"];
                var values = Request.Form["value"];
                if (possibleCharacteristicIds.Count > 0 && values.Count > 0 && possibleCharacteristicIds.Count == values.Count)
                {
                    deviceDto.Characteristics = new List<CharacteristicCreateDto>();
                    for (int i = 0; i < possibleCharacteristicIds.Count; i++)
                    {
                        if (int.TryParse(possibleCharacteristicIds[i], out int pcId))
                        {
                            deviceDto.Characteristics.Add(new CharacteristicCreateDto
                            {
                                PossibleCharacteristicId = pcId,
                                Value = values[i]
                            });
                        }
                    }
                }
            }
            // --- конец универсального парсинга ---

            if (deviceDto.Characteristics == null)
                deviceDto.Characteristics = new List<CharacteristicCreateDto>();
            try
            {
                var device = await _addDeviceService.AddDeviceAsync(deviceDto, image);
                var result = _mappingService.MapToDetailsDto(device);
                return CreatedAtAction(nameof(GetById), new { id = device.Id }, result);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(ex.Message);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Внутренняя ошибка сервера: {ex.Message}");
            }
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Delete(int id)
        {
            try
            {
                var device = await _deviceRepo.GetByIdAsync(id);
                if (device == null)
                    return NotFound();
                if (!string.IsNullOrEmpty(device.ImagePath))
                    _imageService.DeleteImage(device.ImagePath);
                await _deviceRepo.DeleteAsync(id);
                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Внутренняя ошибка сервера: {ex.Message}");
            }
        }

        [HttpPut("{id}")]
        [DisableRequestSizeLimit]
        [RequestFormLimits(MultipartBodyLengthLimit = int.MaxValue)]
        public async Task<IActionResult> Update(int id, [FromForm] DeviceDto deviceDto, IFormFile? image)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            // --- Универсальный парсинг характеристик ---
            if (Request.Form.TryGetValue("characteristics", out var characteristicsJson))
            {
                try
                {
                    deviceDto.Characteristics = JsonSerializer.Deserialize<List<CharacteristicCreateDto>>(
                        characteristicsJson,
                        new JsonSerializerOptions { PropertyNameCaseInsensitive = true }
                    );
                }
                catch (JsonException ex)
                {
                    return BadRequest($"Некорректный формат JSON для характеристик: {ex.Message}");
                }
            }
            else
            {
                // Fallback: если пришли пары possibleCharacteristicId и value
                var possibleCharacteristicIds = Request.Form["possibleCharacteristicId"];
                var values = Request.Form["value"];
                if (possibleCharacteristicIds.Count > 0 && values.Count > 0 && possibleCharacteristicIds.Count == values.Count)
                {
                    deviceDto.Characteristics = new List<CharacteristicCreateDto>();
                    for (int i = 0; i < possibleCharacteristicIds.Count; i++)
                    {
                        if (int.TryParse(possibleCharacteristicIds[i], out int pcId))
                        {
                            deviceDto.Characteristics.Add(new CharacteristicCreateDto
                            {
                                PossibleCharacteristicId = pcId,
                                Value = values[i]
                            });
                        }
                    }
                }
            }
            // --- конец универсального парсинга ---

            if (deviceDto.Characteristics == null)
                deviceDto.Characteristics = new List<CharacteristicCreateDto>();
            foreach (var c in deviceDto.Characteristics)
            {
                if (string.IsNullOrEmpty(c.Value))
                    return BadRequest("Все характеристики должны иметь значения");
            }

            try
            {
                var updatedDevice = await _updateDeviceService.UpdateDeviceAsync(id, deviceDto, image);
                var result = _mappingService.MapToDetailsDto(updatedDevice);
                return Ok(result);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(ex.Message);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Внутренняя ошибка сервера: {ex.Message}");
            }
        }

        [HttpPost("suitable")]
        public async Task<IActionResult> GetSuitableDevicePost([FromBody] DeviceConfigRequest request)
        {
            try
            {
                var result = await _configuratorService.FindBestDeviceWithReasonAsync(
                    request.DeviceTypeId,
                    request.RoomTypeId,
                    request.RoomSize,
                    request.PeopleCount,
                    request.Characteristics?.Select(c => (c.PossibleCharacteristicId, c.Value)).ToList() ?? new List<(int, string)>()
                );
                if (result.Device != null)
                {
                    var deviceDto = _mappingService.MapToDetailsDto(result.Device);
                    return Ok(new { device = deviceDto });
                }
                return NotFound(new { reason = result.Reason });
            }
            catch (ArgumentException ex)
            {
                return BadRequest(ex.Message);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Внутренняя ошибка сервера: {ex.Message}");
            }
        }
    }
}
using backend.DTOs;
using backend.Services;
using BackendDataAccess.Repositories.IRepositories;
using BackendModels;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System.Linq;

namespace backend.Controllers;

[Route("api/[controller]")]
[ApiController]
public class PossibleCharacteristicsController : ControllerBase
{
    private readonly IPossibleCharacteristicRepository _characteristicRepository;
    private readonly PossibleCharacteristicService _characteristicService;
    private readonly ILogger<PossibleCharacteristicsController> _logger;

    public PossibleCharacteristicsController(
        IPossibleCharacteristicRepository characteristicRepository,
        PossibleCharacteristicService characteristicService,
        ILogger<PossibleCharacteristicsController> logger)
    {
        _characteristicRepository = characteristicRepository;
        _characteristicService = characteristicService;
        _logger = logger;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<PossibleCharacteristicListDto>>> GetCharacteristics([FromQuery] int? deviceTypeId)
    {
        try
        {
            var characteristics = await _characteristicRepository.GetAllWithDetailsAsync(deviceTypeId);
            var characteristicDtos = characteristics.Select(pc => new PossibleCharacteristicListDto
            {
                Id = pc.Id,
                Name = pc.Name,
                Unit = pc.Unit,
                DeviceTypeId = pc.DeviceTypeId,
                DeviceTypeName = pc.DeviceType.Name,
                Type = pc.Type,
                IsRequired = pc.IsRequired
            });
            return Ok(characteristicDtos);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error occurred while getting characteristics for device type {DeviceTypeId}", deviceTypeId);
            return StatusCode(500, new { error = "Внутренняя ошибка сервера при получении характеристик", details = ex.Message });
        }
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<PossibleCharacteristicDetailsDto>> GetCharacteristic(int id)
    {
        try
        {
            var characteristic = await _characteristicRepository.GetByIdWithDetailsAsync(id);
            if (characteristic == null)
            {
                _logger.LogWarning("Characteristic with id {Id} not found", id);
                return NotFound(new { error = $"Характеристика с ID {id} не найдена" });
            }

            var characteristicDto = new PossibleCharacteristicDetailsDto
            {
                Id = characteristic.Id,
                Name = characteristic.Name,
                Unit = characteristic.Unit,
                DeviceTypeId = characteristic.DeviceTypeId,
                DeviceTypeName = characteristic.DeviceType.Name,
                Characteristics = characteristic.Characteristics?.Select(c => new CharacteristicListDto
                {
                    Id = c.Id,
                    Value = c.Value,
                    DeviceId = c.DeviceId
                }).ToList(),
                Type = characteristic.Type,
                IsRequired = characteristic.IsRequired
            };

            return Ok(characteristicDto);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error occurred while getting characteristic with id {Id}", id);
            return StatusCode(500, new { error = "Внутренняя ошибка сервера при получении характеристики", details = ex.Message });
        }
    }

    [HttpPost]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<PossibleCharacteristicListDto>> CreateCharacteristic([FromBody] PossibleCharacteristicCreateDto characteristicDto)
    {
        if (!ModelState.IsValid)
        {
            var errors = ModelState.Values
                .SelectMany(v => v.Errors)
                .Select(e => e.ErrorMessage);
            return BadRequest(new { errors });
        }

        try
        {
            var characteristic = new PossibleCharacteristic
            {
                Name = characteristicDto.Name,
                Unit = characteristicDto.Unit,
                DeviceTypeId = characteristicDto.DeviceTypeId,
                Type = characteristicDto.Type,
                IsRequired = characteristicDto.IsRequired
            };

            var createdCharacteristic = await _characteristicService.CreateCharacteristicAsync(characteristic);
            _logger.LogInformation("Created new characteristic {Name} for device type {DeviceTypeId}", characteristic.Name, characteristic.DeviceTypeId);

            var createdDto = new PossibleCharacteristicListDto
            {
                Id = createdCharacteristic.Id,
                Name = createdCharacteristic.Name,
                Unit = createdCharacteristic.Unit,
                DeviceTypeId = createdCharacteristic.DeviceTypeId,
                DeviceTypeName = createdCharacteristic.DeviceType.Name,
                Type = createdCharacteristic.Type,
                IsRequired = createdCharacteristic.IsRequired
            };

            return CreatedAtAction(nameof(GetCharacteristic), new { id = createdCharacteristic.Id }, createdDto);
        }
        catch (ArgumentException ex)
        {
            _logger.LogWarning(ex, "Validation error while creating characteristic");
            return BadRequest(new { error = ex.Message });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error occurred while creating characteristic");
            return StatusCode(500, new { error = "Внутренняя ошибка сервера при создании характеристики", details = ex.Message });
        }
    }

    [HttpPut("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<PossibleCharacteristicListDto>> UpdateCharacteristic(int id, [FromBody] PossibleCharacteristicCreateDto characteristicDto)
    {
        if (!ModelState.IsValid)
        {
            var errors = ModelState.Values
                .SelectMany(v => v.Errors)
                .Select(e => e.ErrorMessage);
            return BadRequest(new { errors });
        }

        try
        {
            var characteristic = new PossibleCharacteristic
            {
                Id = id,
                Name = characteristicDto.Name,
                Unit = characteristicDto.Unit,
                DeviceTypeId = characteristicDto.DeviceTypeId,
                Type = characteristicDto.Type,
                IsRequired = characteristicDto.IsRequired
            };

            var updatedCharacteristic = await _characteristicService.UpdateCharacteristicAsync(id, characteristic);
            _logger.LogInformation("Updated characteristic {Name} for device type {DeviceTypeId}", characteristic.Name, characteristic.DeviceTypeId);

            var updatedDto = new PossibleCharacteristicListDto
            {
                Id = updatedCharacteristic.Id,
                Name = updatedCharacteristic.Name,
                Unit = updatedCharacteristic.Unit,
                DeviceTypeId = updatedCharacteristic.DeviceTypeId,
                DeviceTypeName = updatedCharacteristic.DeviceType.Name,
                Type = updatedCharacteristic.Type,
                IsRequired = updatedCharacteristic.IsRequired
            };

            return Ok(updatedDto);
        }
        catch (ArgumentException ex)
        {
            _logger.LogWarning(ex, "Validation error while updating characteristic {Id}", id);
            return BadRequest(new { error = ex.Message });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error occurred while updating characteristic {Id}", id);
            return StatusCode(500, new { error = "Внутренняя ошибка сервера при обновлении характеристики", details = ex.Message });
        }
    }

    [HttpDelete("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> DeleteCharacteristic(int id)
    {
        try
        {
            await _characteristicService.DeleteCharacteristicAsync(id);
            return NoContent();
        }
        catch (ArgumentException ex)
        {
            _logger.LogWarning(ex, "Validation error while deleting characteristic {Id}", id);
            return BadRequest(new { error = ex.Message });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error occurred while deleting characteristic {Id}", id);
            return StatusCode(500, new { error = "Внутренняя ошибка сервера при удалении характеристики", details = ex.Message });
        }
    }
} 
using BackendDataAccess.Repositories.IRepositories;
using BackendModels;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using backend.DTOs;
using System.Linq;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DeviceTypesController : ControllerBase
    {
        private readonly IDeviceTypeRepository _deviceTypeRepository;
        private readonly ILogger<DeviceTypesController> _logger;

        public DeviceTypesController(IDeviceTypeRepository deviceTypeRepository, ILogger<DeviceTypesController> logger)
        {
            _deviceTypeRepository = deviceTypeRepository;
            _logger = logger;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            try
            {
                var deviceTypes = await _deviceTypeRepository.GetAllAsync();
                var deviceTypeDtos = deviceTypes.Select(dt => new DeviceTypeListDto
                {
                    Id = dt.Id,
                    Name = dt.Name,
                    Description = dt.Description
                });
                return Ok(deviceTypeDtos);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while getting all device types");
                return StatusCode(500, new { error = "Внутренняя ошибка сервера при получении типов устройств", details = ex.Message });
            }
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            try
            {
                var deviceType = await _deviceTypeRepository.GetByIdAsync(id);
                if (deviceType == null)
                {
                    _logger.LogWarning("Device type with id {Id} not found", id);
                    return NotFound(new { error = $"Тип устройства с ID {id} не найден" });
                }

                var deviceTypeDto = new DeviceTypeDetailsDto
                {
                    Id = deviceType.Id,
                    Name = deviceType.Name,
                    Description = deviceType.Description,
                    PossibleCharacteristics = deviceType.PossibleCharacteristics?.Select(pc => new DeviceTypeCharacteristicListDto
                    {
                        Id = pc.Id,
                        Name = pc.Name,
                        Unit = pc.Unit,
                        DeviceTypeId = pc.DeviceTypeId
                    }).ToList()
                };

                return Ok(deviceTypeDto);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while getting device type with id {Id}", id);
                return StatusCode(500, new { error = "Внутренняя ошибка сервера при получении типа устройства", details = ex.Message });
            }
        }

        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Create([FromBody] DeviceTypeCreateDto deviceTypeDto)
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
                var deviceType = new DeviceType
                {
                    Name = deviceTypeDto.Name,
                    Description = deviceTypeDto.Description,
                    PossibleCharacteristics = new List<PossibleCharacteristic>()
                };

                await _deviceTypeRepository.AddAsync(deviceType);
                _logger.LogInformation("Created new device type {Name}", deviceType.Name);

                var createdDto = new DeviceTypeListDto
                {
                    Id = deviceType.Id,
                    Name = deviceType.Name,
                    Description = deviceType.Description
                };

                return CreatedAtAction(nameof(GetById), new { id = deviceType.Id }, createdDto);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while creating device type {Name}", deviceTypeDto.Name);
                return StatusCode(500, new { error = "Внутренняя ошибка сервера при создании типа устройства", details = ex.Message });
            }
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Update(int id, [FromBody] DeviceTypeCreateDto deviceTypeDto)
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
                var existingDeviceType = await _deviceTypeRepository.GetByIdAsync(id);
                if (existingDeviceType == null)
                {
                    _logger.LogWarning("Attempted to update non-existent device type with id {Id}", id);
                    return NotFound(new { error = $"Тип устройства с ID {id} не найден" });
                }

                existingDeviceType.Name = deviceTypeDto.Name;
                existingDeviceType.Description = deviceTypeDto.Description;

                await _deviceTypeRepository.UpdateAsync(existingDeviceType);
                _logger.LogInformation("Updated device type {Name}", existingDeviceType.Name);

                var updatedDto = new DeviceTypeListDto
                {
                    Id = existingDeviceType.Id,
                    Name = existingDeviceType.Name,
                    Description = existingDeviceType.Description
                };

                return Ok(updatedDto);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while updating device type {Id}", id);
                return StatusCode(500, new { error = "Внутренняя ошибка сервера при обновлении типа устройства", details = ex.Message });
            }
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Delete(int id)
        {
            try
            {
                var deviceType = await _deviceTypeRepository.GetByIdAsync(id);
                if (deviceType == null)
                {
                    _logger.LogWarning("Attempted to delete non-existent device type with id {Id}", id);
                    return NotFound(new { error = $"Тип устройства с ID {id} не найден" });
                }

                await _deviceTypeRepository.DeleteAsync(id);
                _logger.LogInformation("Deleted device type {Name}", deviceType.Name);
                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while deleting device type {Id}", id);
                return StatusCode(500, new { error = "Внутренняя ошибка сервера при удалении типа устройства", details = ex.Message });
            }
        }
    }
}

using backend.DTOs;
using backend.Services;
using BackendDataAccess.Repositories.IRepositories;
using BackendModels;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Hosting;
using backend.Extensions;

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

        public DevicesController(
            IDeviceRepository deviceRepo, 
            AddDeviceService addDeviceService,
            UpdateDeviceService updateDeviceService,
            ImageService imageService)
        {
            _deviceRepo = deviceRepo;
            _addDeviceService = addDeviceService;
            _updateDeviceService = updateDeviceService;
            _imageService = imageService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var devices = await _deviceRepo.GetAllAsync();
            return Ok(devices);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var device = await _deviceRepo.GetByIdAsync(id);
            return device != null ? Ok(device) : NotFound();
        }

        [HttpPost]
        [DisableRequestSizeLimit]
        [RequestFormLimits(MultipartBodyLengthLimit = int.MaxValue)]
        public async Task<IActionResult> Create([FromForm] DeviceDto deviceDto, IFormFile image)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                var device = await _addDeviceService.AddDeviceAsync(deviceDto, image);
                return CreatedAtAction(nameof(GetById), new { id = device.Id }, device);
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
        public async Task<IActionResult> Delete(int id)
        {
            try
            {
                var device = await _deviceRepo.GetByIdAsync(id);
                if (device == null)
                {
                    return NotFound();
                }

                // Удаляем изображение, если оно существует
                if (!string.IsNullOrEmpty(device.ImagePath))
                {
                    _imageService.DeleteImage(device.ImagePath);
                }

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
            {
                return BadRequest(ModelState);
            }

            try
            {
                var updatedDevice = await _updateDeviceService.UpdateDeviceAsync(id, deviceDto, image);
                return Ok(updatedDevice);
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

using backend.DTOs;
using backend.Services;
using BackendDataAccess.Repositories.IRepositories;
using BackendModels;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Hosting;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DevicesController : ControllerBase
    {
        private readonly IDeviceRepository _deviceRepo;
        private readonly AddDeviceService _addDeviceService;
        private readonly IWebHostEnvironment _environment;

        public DevicesController(
            IDeviceRepository deviceRepo, 
            AddDeviceService addDeviceService,
            IWebHostEnvironment environment)
        {
            _deviceRepo = deviceRepo;
            _addDeviceService = addDeviceService;
            _environment = environment;
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
                if (image == null || image.Length == 0)
                {
                    return BadRequest("Изображение обязательно для загрузки");
                }

                // Проверяем расширение файла
                var allowedExtensions = new[] { ".jpg", ".jpeg", ".png", ".gif" };
                var fileExtension = Path.GetExtension(image.FileName).ToLowerInvariant();
                if (!allowedExtensions.Contains(fileExtension))
                {
                    return BadRequest("Недопустимый формат файла. Разрешены только: " + string.Join(", ", allowedExtensions));
                }

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
            await _deviceRepo.DeleteAsync(id);
            return NoContent();
        }
    }
}

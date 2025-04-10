using BackendDataAccess.Repositories;
using BackendDataAccess.Repositories.IRepositories;
using BackendModels;
using BackendModels.DTOs;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DevicesController(IDeviceRepository deviceRepo) : ControllerBase
    {
        private readonly IDeviceRepository _deviceRepo = deviceRepo;

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
        public async Task<IActionResult> Create([FromBody] DeviceDto deviceDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var ventilationType = await _deviceRepo.GetVentilationTypeByIdAsync(deviceDto.VentilationTypeId);
            if (ventilationType == null)
            {
                return BadRequest("Указанный тип вентиляции не найден.");
            }

            var device = new Device
            {
                Name = deviceDto.Name,
                Description = deviceDto.Description,
                Image = deviceDto.Image,
                PowerConsumption = deviceDto.PowerConsumption,
                NoiseLevel = deviceDto.NoiseLevel,
                MaxAirflow = deviceDto.MaxAirflow,
                Price = deviceDto.Price,
                VentilationTypeId = deviceDto.VentilationTypeId,
                VentilationType = ventilationType

            };

            await _deviceRepo.AddAsync(device);
            return CreatedAtAction(nameof(GetById), new { id = device.Id }, device);
        }
    }
}

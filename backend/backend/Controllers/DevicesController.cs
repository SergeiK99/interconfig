using backend.DTOs;
using backend.Services;
using BackendDataAccess.Repositories;
using BackendDataAccess.Repositories.IRepositories;
using BackendModels;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using static System.Net.Mime.MediaTypeNames;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DevicesController(IDeviceRepository deviceRepo, AddDeviceService addDeviceService) : ControllerBase
    {
        private readonly IDeviceRepository _deviceRepo = deviceRepo;
        private readonly AddDeviceService _addDeviceService = addDeviceService;

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

            try
            {
                var device = await _addDeviceService.AddDeviceAsync(deviceDto);
                return CreatedAtAction(nameof(GetById), new { id = device.Id }, device);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}

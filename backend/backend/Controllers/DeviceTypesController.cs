using BackendDataAccess.Repositories.IRepositories;
using BackendModels;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DeviceTypesController : ControllerBase
    {
        private readonly IDeviceTypeRepository _deviceTypeRepository;

        public DeviceTypesController(IDeviceTypeRepository deviceTypeRepository)
        {
            _deviceTypeRepository = deviceTypeRepository;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var deviceTypes = await _deviceTypeRepository.GetAllAsync();
            return Ok(deviceTypes);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var deviceType = await _deviceTypeRepository.GetByIdAsync(id);
            return deviceType != null ? Ok(deviceType) : NotFound();
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] DeviceType deviceType)
        {
            await _deviceTypeRepository.AddAsync(deviceType);
            return CreatedAtAction(nameof(GetById), new { id = deviceType.Id }, deviceType);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] DeviceType deviceType)
        {
            if (id != deviceType.Id)
            {
                return BadRequest();
            }

            await _deviceTypeRepository.UpdateAsync(deviceType);
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            await _deviceTypeRepository.DeleteAsync(id);
            return NoContent();
        }
    }
}

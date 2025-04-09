using BackendDataAccess.Repositories.IRepositories;
using BackendModels;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class VentilationTypesController : ControllerBase
    {
        private readonly IVentilationTypeRepository _ventilationTypeRepository;

        public VentilationTypesController(IVentilationTypeRepository ventilationTypeRepository)
        {
            _ventilationTypeRepository = ventilationTypeRepository;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var ventilationTypes = await _ventilationTypeRepository.GetAllAsync();
            return Ok(ventilationTypes);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var ventilationType = await _ventilationTypeRepository.GetByIdAsync(id);
            return ventilationType != null ? Ok(ventilationType) : NotFound();
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] VentilationType ventilationType)
        {
            await _ventilationTypeRepository.AddAsync(ventilationType);
            return CreatedAtAction(nameof(GetById), new { id = ventilationType.Id }, ventilationType);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] VentilationType ventilationType)
        {
            if (id != ventilationType.Id)
            {
                return BadRequest();
            }

            await _ventilationTypeRepository.UpdateAsync(ventilationType);
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            await _ventilationTypeRepository.DeleteAsync(id);
            return NoContent();
        }
    }
}

using BackendDataAccess;
using BackendModels;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CharacteristicsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        public CharacteristicsController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Characteristic>>> GetAll()
        {
            return await _context.Characteristics.Include(c => c.PossibleCharacteristic).ToListAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Characteristic>> Get(int id)
        {
            var characteristic = await _context.Characteristics.Include(c => c.PossibleCharacteristic).FirstOrDefaultAsync(c => c.Id == id);
            if (characteristic == null) return NotFound();
            return characteristic;
        }

        [HttpPost]
        public async Task<ActionResult<Characteristic>> Create(Characteristic characteristic)
        {
            _context.Characteristics.Add(characteristic);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(Get), new { id = characteristic.Id }, characteristic);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, Characteristic characteristic)
        {
            if (id != characteristic.Id) return BadRequest();
            _context.Entry(characteristic).State = EntityState.Modified;
            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var characteristic = await _context.Characteristics.FindAsync(id);
            if (characteristic == null) return NotFound();
            _context.Characteristics.Remove(characteristic);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
} 
using Microsoft.AspNetCore.Mvc;
using backend.Services;
using System.Threading.Tasks;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AIConsultantController : ControllerBase
    {
        private readonly GigaChatService _gigaChatService;

        public AIConsultantController(GigaChatService gigaChatService)
        {
            _gigaChatService = gigaChatService;
        }

        [HttpPost("recommend")]
        public async Task<IActionResult> GetRecommendation([FromBody] string userQuery)
        {
            if (string.IsNullOrEmpty(userQuery))
            {
                return BadRequest("Запрос не может быть пустым");
            }

            var recommendation = await _gigaChatService.GetDeviceRecommendation(userQuery);
            return Ok(new { recommendation });
        }
    }
} 
using Microsoft.AspNetCore.Mvc;
using backend.Services;
using backend.Models;
using System.Threading.Tasks;
using System;
using System.Collections.Generic;

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
        public async Task<IActionResult> GetRecommendation([FromBody] ChatRequest request)
        {
            if (string.IsNullOrEmpty(request.Query))
            {
                return BadRequest("Запрос не может быть пустым");
            }

            try
            {
                // Исправляем проблему с оператором ??
                var recommendation = await _gigaChatService.GetDeviceRecommendation(
                    request.Query,
                    request.History ?? new List<ChatMessage>()
                );

                return Ok(new { recommendation });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = "Произошла ошибка при получении рекомендации" });
            }
        }
    }
}
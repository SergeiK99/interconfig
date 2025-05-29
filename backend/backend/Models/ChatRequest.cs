using backend.Services;

namespace backend.Models
{
    public class ChatRequest
    {
        public string Query { get; set; }
        public List<ChatMessage> History { get; set; }
    }
}
namespace backend.DTOs
{

    public class AuthResponseDTO
    {
        public string Token { get; set; }
        public string Role { get; set; }
        public string Email { get; set; }
    }
} 
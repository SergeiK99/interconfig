using System.ComponentModel.DataAnnotations;

namespace BackendModels
{
    public class User
    {
        public int Id { get; set; }

        [Required]
        [EmailAddress]
        public string Email { get; set; }

        [Required]
        public string PasswordHash { get; set; }

        [Required]
        public string Role { get; set; } // "User" и "Admin"

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
} 
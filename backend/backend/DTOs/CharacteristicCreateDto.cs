using System.ComponentModel.DataAnnotations;

namespace backend.DTOs
{
    public class CharacteristicCreateDto
    {
        [Required]
        public int PossibleCharacteristicId { get; set; }

        [Required]
        public string Value { get; set; } = string.Empty;
    }
} 
using System.ComponentModel.DataAnnotations;

namespace backend.DTOs;

public class RoomTypeDto
{
    public int Id { get; set; }
    
    [Required(ErrorMessage = "Название обязательно")]
    [StringLength(100, ErrorMessage = "Название не может быть длиннее 100 символов")]
    public string Name { get; set; } = string.Empty;
    
    [StringLength(500, ErrorMessage = "Описание не может быть длиннее 500 символов")]
    public string? Description { get; set; }
    
    [Required]
    public double AreaCoefficient { get; set; }
    
    [Required]
    public double PeopleCoefficient { get; set; }
} 
using System.ComponentModel.DataAnnotations;

namespace BackendModels;

/// <summary>
/// Тип устройства
/// </summary>
public class DeviceType
{
    public int Id { get; set; }
    
    [Required]
    [StringLength(100)]
    public string Name { get; set; }
    
    [StringLength(500)]
    public string? Description { get; set; }
}

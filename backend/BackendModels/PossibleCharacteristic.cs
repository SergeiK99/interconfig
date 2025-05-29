using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BackendModels;

public class PossibleCharacteristic
{
    public int Id { get; set; }
    [Required]
    [StringLength(100)]
    public string Name { get; set; }
    [StringLength(200)]
    public string? Unit { get; set; } // Единица измерения (например, Вт, дБ)
    [Required]
    public int DeviceTypeId { get; set; }
    [ForeignKey("DeviceTypeId")]
    public DeviceType DeviceType { get; set; }
    [Required]
    [StringLength(20)]
    public string Type { get; set; } // 'bool', 'number', 'string'
    public bool IsRequired { get; set; }
    public ICollection<Characteristic> Characteristics { get; set; }
} 
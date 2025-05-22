using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BackendModels;

public class Characteristic
{
    public int Id { get; set; }
    [Required]
    public string Value { get; set; }
    [Required]
    public int DeviceId { get; set; }
    [ForeignKey("DeviceId")]
    public Device Device { get; set; }
    [Required]
    public int PossibleCharacteristicId { get; set; }
    [ForeignKey("PossibleCharacteristicId")]
    public PossibleCharacteristic PossibleCharacteristic { get; set; }
} 
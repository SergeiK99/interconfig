using System.ComponentModel.DataAnnotations;

namespace backend.DTOs;

// DTO для создания/обновления типа устройства
public class DeviceTypeCreateDto
{
    [Required(ErrorMessage = "Название типа устройства обязательно")]
    [StringLength(100, ErrorMessage = "Название не должно превышать 100 символов")]
    public string Name { get; set; }
    
    [StringLength(500, ErrorMessage = "Описание не должно превышать 500 символов")]
    public string? Description { get; set; }
}

// DTO для списка типов устройств
public class DeviceTypeListDto
{
    public int Id { get; set; }
    public string Name { get; set; }
    public string? Description { get; set; }
}

// DTO для детального просмотра типа устройства
public class DeviceTypeDetailsDto
{
    public int Id { get; set; }
    public string Name { get; set; }
    public string? Description { get; set; }
    public ICollection<DeviceTypeCharacteristicListDto> PossibleCharacteristics { get; set; }
}

// DTO для списка возможных характеристик в контексте типа устройства
public class DeviceTypeCharacteristicListDto
{
    public int Id { get; set; }
    public string Name { get; set; }
    public string Unit { get; set; }
    public int DeviceTypeId { get; set; }
} 
using System.ComponentModel.DataAnnotations;

namespace backend.DTOs;

// DTO для создания/обновления возможной характеристики
public class PossibleCharacteristicCreateDto
{
    [Required(ErrorMessage = "Название обязательно")]
    [StringLength(100, ErrorMessage = "Название не может быть длиннее 100 символов")]
    public string Name { get; set; } = string.Empty;
    
    [StringLength(50, ErrorMessage = "Единица измерения не может быть длиннее 50 символов")]
    public string? Unit { get; set; }
    
    [Required(ErrorMessage = "Тип устройства обязателен")]
    public int DeviceTypeId { get; set; }

    [Required(ErrorMessage = "Тип значения обязателен")]
    [StringLength(20, ErrorMessage = "Тип не может быть длиннее 20 символов")]
    public string Type { get; set; } // 'bool', 'number', 'string'
    public bool IsRequired { get; set; }
}

// DTO для списка возможных характеристик
public class PossibleCharacteristicListDto
{
    public int Id { get; set; }
    public string Name { get; set; }
    public string? Unit { get; set; }
    public int DeviceTypeId { get; set; }
    public string DeviceTypeName { get; set; }
    public string Type { get; set; } // 'bool', 'number', 'string'
    public bool IsRequired { get; set; }
}

// DTO для детального просмотра возможной характеристики
public class PossibleCharacteristicDetailsDto
{
    public int Id { get; set; }
    public string Name { get; set; }
    public string? Unit { get; set; }
    public int DeviceTypeId { get; set; }
    public string DeviceTypeName { get; set; }
    public ICollection<CharacteristicListDto> Characteristics { get; set; }
    public string Type { get; set; } // 'bool', 'number', 'string'
    public bool IsRequired { get; set; }
}

// DTO для списка характеристик
public class CharacteristicListDto
{
    public int Id { get; set; }
    public string Value { get; set; }
    public int DeviceId { get; set; }
} 
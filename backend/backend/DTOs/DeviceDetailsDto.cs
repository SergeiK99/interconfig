using System.Collections.Generic;

namespace backend.DTOs
{
    public class DeviceDetailsDto
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public string ImagePath { get; set; }
        public int PowerConsumption { get; set; }
        public int NoiseLevel { get; set; }
        public int MaxAirflow { get; set; }
        public int Price { get; set; }
        public int DeviceTypeId { get; set; }
        public DeviceTypeShortDto DeviceType { get; set; }
        public List<CharacteristicShortDto> Characteristics { get; set; }
    }

    public class DeviceTypeShortDto
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string? Description { get; set; }
    }

    public class CharacteristicShortDto
    {
        public int Id { get; set; }
        public int PossibleCharacteristicId { get; set; }
        public string Value { get; set; }
    }
} 
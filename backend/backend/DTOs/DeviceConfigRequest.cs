namespace backend.DTOs
{
    public class DeviceConfigRequest
    {
        public int DeviceTypeId { get; set; }
        public int RoomTypeId { get; set; }
        public double RoomSize { get; set; }
        public int PeopleCount { get; set; }
        public List<SelectedCharacteristicDto> Characteristics { get; set; } = new();
    }

    public class SelectedCharacteristicDto
    {
        public int PossibleCharacteristicId { get; set; }
        public string Value { get; set; }
    }
} 
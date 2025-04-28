using backend.DTOs;
using BackendModels;

namespace backend.Extensions
{
    public static class DeviceMappingExtensions
    {
        public static Device MapToModel(this DeviceDto deviceDto, DeviceType deviceType)
        {
            return new Device
            {
                Name = deviceDto.Name,
                Description = deviceDto.Description,
                ImagePath = deviceDto.ImagePath,
                PowerConsumption = deviceDto.PowerConsumption,
                NoiseLevel = deviceDto.NoiseLevel,
                MaxAirflow = deviceDto.MaxAirflow,
                Price = deviceDto.Price,
                DeviceTypeId = deviceDto.DeviceTypeId,
                DeviceType = deviceType
            };
        }
    }
}

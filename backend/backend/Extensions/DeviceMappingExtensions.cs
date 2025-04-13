using backend.DTOs;
using BackendModels;

namespace backend.Extensions
{
    public static class DeviceMappingExtensions
    {
        public static Device MapToModel(this DeviceDto deviceDto, VentilationType ventilationType)
        {
            return new Device
            {
                Name = deviceDto.Name,
                Description = deviceDto.Description,
                Image = deviceDto.Image,
                PowerConsumption = deviceDto.PowerConsumption,
                NoiseLevel = deviceDto.NoiseLevel,
                MaxAirflow = deviceDto.MaxAirflow,
                Price = deviceDto.Price,
                VentilationTypeId = deviceDto.VentilationTypeId,
                VentilationType = ventilationType
            };
        }
    }
}

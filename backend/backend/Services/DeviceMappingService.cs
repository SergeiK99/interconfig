using backend.DTOs;
using BackendModels;
using System.Collections.Generic;
using System.Linq;

namespace backend.Services
{
    public class DeviceMappingService
    {
        public Device MapToModel(DeviceDto deviceDto, DeviceType deviceType)
        {
            return new Device
            {
                Name = deviceDto.Name,
                Description = deviceDto.Description,
                ImagePath = deviceDto.ImagePath ?? string.Empty,
                PowerConsumption = deviceDto.PowerConsumption,
                NoiseLevel = deviceDto.NoiseLevel,
                MaxAirflow = deviceDto.MaxAirflow,
                Price = deviceDto.Price,
                DeviceTypeId = deviceDto.DeviceTypeId,
                DeviceType = deviceType,
                Characteristics = deviceDto.Characteristics?.Select(c => new Characteristic
                {
                    PossibleCharacteristicId = c.PossibleCharacteristicId,
                    Value = c.Value ?? string.Empty
                }).ToList() ?? new List<Characteristic>()
            };
        }

        public DeviceDetailsDto MapToDetailsDto(Device device)
        {
            return new DeviceDetailsDto
            {
                Id = device.Id,
                Name = device.Name,
                Description = device.Description,
                ImagePath = device.ImagePath,
                PowerConsumption = device.PowerConsumption,
                NoiseLevel = device.NoiseLevel,
                MaxAirflow = device.MaxAirflow,
                Price = device.Price,
                DeviceTypeId = device.DeviceTypeId,
                DeviceType = device.DeviceType == null ? null : new DeviceTypeShortDto
                {
                    Id = device.DeviceType.Id,
                    Name = device.DeviceType.Name,
                    Description = device.DeviceType.Description
                },
                Characteristics = device.Characteristics?.Select(c => new CharacteristicShortDto
                {
                    Id = c.Id,
                    PossibleCharacteristicId = c.PossibleCharacteristicId,
                    Value = c.Value
                }).ToList() ?? new List<CharacteristicShortDto>()
            };
        }
    }
} 
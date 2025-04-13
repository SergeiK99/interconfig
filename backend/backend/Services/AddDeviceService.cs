using backend.DTOs;
using BackendDataAccess.Repositories.IRepositories;
using BackendModels;
using backend.Extensions;

namespace backend.Services
{
    public class AddDeviceService
    {
        private readonly IDeviceRepository _deviceRepository;

        public AddDeviceService(IDeviceRepository deviceRepository)
        {
            _deviceRepository = deviceRepository;
        }

        public async Task<Device> AddDeviceAsync(DeviceDto deviceDto)
        {
            var ventilationType = await _deviceRepository.GetVentilationTypeByIdAsync(deviceDto.VentilationTypeId);
            if (ventilationType == null)
            {
                throw new ArgumentException("Указанный тип вентиляции не найден.");
            }

            var device = deviceDto.MapToModel(ventilationType);
            await _deviceRepository.AddAsync(device);
            return device;
        }
    }
}

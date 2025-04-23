using backend.DTOs;
using BackendDataAccess.Repositories.IRepositories;
using BackendModels;
using backend.Extensions;
using Microsoft.AspNetCore.Http;

namespace backend.Services
{
    public class AddDeviceService
    {
        private readonly IDeviceRepository _deviceRepository;
        private readonly ImageService _imageService;

        public AddDeviceService(IDeviceRepository deviceRepository, ImageService imageService)
        {
            _deviceRepository = deviceRepository;
            _imageService = imageService;
        }

        public async Task<Device> AddDeviceAsync(DeviceDto deviceDto, IFormFile imageFile)
        {
            var ventilationType = await _deviceRepository.GetVentilationTypeByIdAsync(deviceDto.VentilationTypeId);
            if (ventilationType == null)
            {
                throw new ArgumentException("Указанный тип вентиляции не найден.");
            }

            if (imageFile != null && imageFile.Length > 0)
            {
                deviceDto.ImagePath = await _imageService.SaveImageAsync(imageFile, "devices");
            }

            var device = deviceDto.MapToModel(ventilationType);
            await _deviceRepository.AddAsync(device);
            return device;
        }
    }
}

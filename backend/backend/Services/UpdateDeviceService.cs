using backend.DTOs;
using BackendDataAccess.Repositories.IRepositories;
using BackendModels;
using Microsoft.AspNetCore.Http;

namespace backend.Services
{
    public class UpdateDeviceService
    {
        private readonly IDeviceRepository _deviceRepository;
        private readonly ImageService _imageService;

        public UpdateDeviceService(IDeviceRepository deviceRepository, ImageService imageService)
        {
            _deviceRepository = deviceRepository;
            _imageService = imageService;
        }

        public async Task<Device> UpdateDeviceAsync(int id, DeviceDto deviceDto, IFormFile? image)
        {
            var existingDevice = await _deviceRepository.GetByIdAsync(id);
            if (existingDevice == null)
            {
                throw new ArgumentException($"Устройство с ID {id} не найдено");
            }

            var ventilationType = await _deviceRepository.GetVentilationTypeByIdAsync(deviceDto.VentilationTypeId);
            if (ventilationType == null)
            {
                throw new ArgumentException("Указанный тип вентиляции не найден");
            }

            // Если предоставлено новое изображение, удаляем старое и сохраняем новое
            if (image != null && image.Length > 0)
            {
                if (!string.IsNullOrEmpty(existingDevice.ImagePath))
                {
                    _imageService.DeleteImage(existingDevice.ImagePath);
                }
                deviceDto.ImagePath = await _imageService.SaveImageAsync(image, "devices");
            }
            else
            {
                // Если новое изображение не предоставлено, сохраняем существующий путь
                deviceDto.ImagePath = existingDevice.ImagePath;
            }

            // Обновляем данные существующего устройства
            existingDevice.Name = deviceDto.Name;
            existingDevice.Description = deviceDto.Description;
            existingDevice.ImagePath = deviceDto.ImagePath;
            existingDevice.PowerConsumption = deviceDto.PowerConsumption;
            existingDevice.NoiseLevel = deviceDto.NoiseLevel;
            existingDevice.MaxAirflow = deviceDto.MaxAirflow;
            existingDevice.Price = deviceDto.Price;
            existingDevice.VentilationTypeId = deviceDto.VentilationTypeId;
            existingDevice.VentilationType = ventilationType;

            await _deviceRepository.UpdateAsync(existingDevice);
            return existingDevice;
        }
    }
} 
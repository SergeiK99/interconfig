using backend.DTOs;
using BackendDataAccess.Repositories.IRepositories;
using BackendModels;
using backend.Extensions;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace backend.Services
{
    public class AddDeviceService
    {
        private readonly IDeviceRepository _deviceRepository;
        private readonly ImageService _imageService;
        private readonly DeviceMappingService _mappingService;

        public AddDeviceService(IDeviceRepository deviceRepository, ImageService imageService, DeviceMappingService mappingService)
        {
            _deviceRepository = deviceRepository;
            _imageService = imageService;
            _mappingService = mappingService;
        }

        public async Task<Device> AddDeviceAsync(DeviceDto deviceDto, IFormFile imageFile)
        {
            var ventilationType = await _deviceRepository.GetDeviceTypeByIdAsync(deviceDto.DeviceTypeId);
            if (ventilationType == null)
            {
                throw new ArgumentException("Указанный тип вентиляции не найден.");
            }

            // Обработка изображения
            if (imageFile != null && imageFile.Length > 0)
            {
                deviceDto.ImagePath = await _imageService.SaveImageAsync(imageFile, "devices");
            }
            else
            {
                deviceDto.ImagePath = string.Empty;
            }

            // Проверяем характеристики
            if (deviceDto.Characteristics == null)
                deviceDto.Characteristics = new List<CharacteristicCreateDto>();
            foreach (var c in deviceDto.Characteristics)
            {
                if (string.IsNullOrEmpty(c.Value))
                    throw new ArgumentException("Все характеристики должны иметь значения");
            }

            var device = _mappingService.MapToModel(deviceDto, ventilationType);

            try
            {
                await _deviceRepository.AddAsync(device);
                return device;
            }
            catch (Exception ex)
            {
                if (!string.IsNullOrEmpty(device.ImagePath))
                {
                    _imageService.DeleteImage(device.ImagePath);
                }
                throw new Exception($"Ошибка при сохранении устройства: {ex.Message}", ex);
            }
        }
    }
}

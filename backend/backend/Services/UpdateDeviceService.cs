using backend.DTOs;
using BackendDataAccess.Repositories.IRepositories;
using BackendModels;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace backend.Services
{
    public class UpdateDeviceService
    {
        private readonly IDeviceRepository _deviceRepository;
        private readonly ImageService _imageService;
        private readonly DeviceMappingService _mappingService;

        public UpdateDeviceService(IDeviceRepository deviceRepository, ImageService imageService, DeviceMappingService mappingService)
        {
            _deviceRepository = deviceRepository;
            _imageService = imageService;
            _mappingService = mappingService;
        }

        public async Task<Device> UpdateDeviceAsync(int id, DeviceDto deviceDto, IFormFile? image)
        {
            var existingDevice = await _deviceRepository.GetByIdAsync(id);
            if (existingDevice == null)
            {
                throw new ArgumentException($"Устройство с ID {id} не найдено");
            }

            var ventilationType = await _deviceRepository.GetDeviceTypeByIdAsync(deviceDto.DeviceTypeId);
            if (ventilationType == null)
            {
                throw new ArgumentException("Указанный тип вентиляции не найден");
            }

            // Обработка изображения
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
                deviceDto.ImagePath = existingDevice.ImagePath;
            }

            // Обновляем основные данные устройства
            existingDevice.Name = deviceDto.Name;
            existingDevice.Description = deviceDto.Description;
            existingDevice.ImagePath = deviceDto.ImagePath;
            existingDevice.PowerConsumption = deviceDto.PowerConsumption;
            existingDevice.NoiseLevel = deviceDto.NoiseLevel;
            existingDevice.MaxAirflow = deviceDto.MaxAirflow;
            existingDevice.Price = deviceDto.Price;
            existingDevice.DeviceTypeId = deviceDto.DeviceTypeId;
            existingDevice.DeviceType = ventilationType;

            // Обновляем характеристики
            if (deviceDto.Characteristics == null)
                deviceDto.Characteristics = new List<CharacteristicCreateDto>();
            foreach (var c in deviceDto.Characteristics)
            {
                if (string.IsNullOrEmpty(c.Value))
                    throw new ArgumentException("Все характеристики должны иметь значения");
            }

            // Удаляем отсутствующие
            var toDelete = existingDevice.Characteristics
                .Where(c => !deviceDto.Characteristics.Any(dto => dto.PossibleCharacteristicId == c.PossibleCharacteristicId))
                .ToList();
            foreach (var c in toDelete)
                existingDevice.Characteristics.Remove(c);

            // Обновляем/добавляем
            foreach (var charDto in deviceDto.Characteristics)
            {
                var existingChar = existingDevice.Characteristics
                    .FirstOrDefault(c => c.PossibleCharacteristicId == charDto.PossibleCharacteristicId);

                if (existingChar != null)
                    existingChar.Value = charDto.Value;
                else
                    existingDevice.Characteristics.Add(new Characteristic
                    {
                        PossibleCharacteristicId = charDto.PossibleCharacteristicId,
                        Value = charDto.Value
                    });
            }

            try
            {
                await _deviceRepository.UpdateAsync(existingDevice);
                return existingDevice;
            }
            catch (Exception ex)
            {
                // Если произошла ошибка и мы сохранили новое изображение, удаляем его
                if (image != null && !string.IsNullOrEmpty(deviceDto.ImagePath))
                {
                    _imageService.DeleteImage(deviceDto.ImagePath);
                }
                throw new Exception($"Ошибка при обновлении устройства: {ex.Message}", ex);
            }
        }
    }
} 
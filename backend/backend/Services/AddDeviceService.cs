using backend.DTOs;
using BackendDataAccess.Repositories.IRepositories;
using BackendModels;
using backend.Extensions;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using BackendDataAccess;
using Microsoft.EntityFrameworkCore;

namespace backend.Services
{
    public class AddDeviceService
    {
        private readonly IDeviceRepository _deviceRepository;
        private readonly ImageService _imageService;
        private readonly DeviceMappingService _mappingService;
        private readonly ApplicationDbContext _context;

        public AddDeviceService(IDeviceRepository deviceRepository, ImageService imageService, DeviceMappingService mappingService, ApplicationDbContext context)
        {
            _deviceRepository = deviceRepository;
            _imageService = imageService;
            _mappingService = mappingService;
            _context = context;
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
            // Логируем и фильтруем характеристики
            if (deviceDto.Characteristics != null)
            {
                Console.WriteLine("=== DTO Characteristics ===");
                foreach (var c in deviceDto.Characteristics)
                {
                    Console.WriteLine($"PossibleCharacteristicId: {c.PossibleCharacteristicId}, Value: {c.Value}");
                }
                deviceDto.Characteristics = deviceDto.Characteristics
                    .Where(c => c != null && c.PossibleCharacteristicId > 0 && !string.IsNullOrEmpty(c.Value))
                    .ToList();
            }

            var device = _mappingService.MapToModel(deviceDto, ventilationType);

            // Явно подгружаем существующую PossibleCharacteristic для каждой характеристики
            if (device.Characteristics != null)
            {
                Console.WriteLine("=== Характеристики для сохранения ===");
                foreach (var c in device.Characteristics)
                {
                    Console.WriteLine($"PossibleCharacteristicId: {c.PossibleCharacteristicId}, Value: {c.Value}");
                    c.PossibleCharacteristic = await _context.PossibleCharacteristics.FindAsync(c.PossibleCharacteristicId);
                    if (c.PossibleCharacteristic == null)
                        throw new Exception($"PossibleCharacteristic с id={c.PossibleCharacteristicId} не найдена в базе!");
                }
            }

            try
            {
                await _deviceRepository.AddAsync(device);

                // Логируем характеристики после сохранения
                var savedDevice = await _context.Devices
                    .Include(d => d.Characteristics)
                    .FirstOrDefaultAsync(d => d.Id == device.Id);
                Console.WriteLine("=== Сохранённые характеристики устройства ===");
                if (savedDevice?.Characteristics != null)
                {
                    foreach (var c in savedDevice.Characteristics)
                    {
                        Console.WriteLine($"PossibleCharacteristicId: {c.PossibleCharacteristicId}, Value: {c.Value}");
                    }
                }
                else
                {
                    Console.WriteLine("Характеристики отсутствуют!");
                }

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

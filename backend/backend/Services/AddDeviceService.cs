using backend.DTOs;
using BackendDataAccess.Repositories.IRepositories;
using BackendModels;
using backend.Extensions;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Hosting;

namespace backend.Services
{
    public class AddDeviceService
    {
        private readonly IDeviceRepository _deviceRepository;
        private readonly IWebHostEnvironment _environment;

        public AddDeviceService(IDeviceRepository deviceRepository, IWebHostEnvironment environment)
        {
            _deviceRepository = deviceRepository;
            _environment = environment;
        }

        public async Task<Device> AddDeviceAsync(DeviceDto deviceDto, IFormFile imageFile)
        {
            var ventilationType = await _deviceRepository.GetVentilationTypeByIdAsync(deviceDto.VentilationTypeId);
            if (ventilationType == null)
            {
                throw new ArgumentException("Указанный тип вентиляции не найден.");
            }

            string imagePath = null;
            if (imageFile != null && imageFile.Length > 0)
            {
                var uploadsFolder = Path.Combine(_environment.WebRootPath ?? "wwwroot", "uploads", "devices");
                if (!Directory.Exists(uploadsFolder))
                {
                    Directory.CreateDirectory(uploadsFolder);
                }

                var uniqueFileName = $"{Guid.NewGuid()}_{imageFile.FileName}";
                var filePath = Path.Combine(uploadsFolder, uniqueFileName);

                using (var fileStream = new FileStream(filePath, FileMode.Create))
                {
                    await imageFile.CopyToAsync(fileStream);
                }

                imagePath = $"/uploads/devices/{uniqueFileName}";
            }

            deviceDto.ImagePath = imagePath;
            var device = deviceDto.MapToModel(ventilationType);
            await _deviceRepository.AddAsync(device);
            return device;
        }
    }
}

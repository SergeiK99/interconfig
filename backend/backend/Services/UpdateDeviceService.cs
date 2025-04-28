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
                throw new ArgumentException($"РЈСЃС‚СЂРѕР№СЃС‚РІРѕ СЃ ID {id} РЅРµ РЅР°Р№РґРµРЅРѕ");
            }

            var ventilationType = await _deviceRepository.GetDeviceTypeByIdAsync(deviceDto.DeviceTypeId);
            if (ventilationType == null)
            {
                throw new ArgumentException("РЈРєР°Р·Р°РЅРЅС‹Р№ С‚РёРї РІРµРЅС‚РёР»СЏС†РёРё РЅРµ РЅР°Р№РґРµРЅ");
            }

            // Р•СЃР»Рё РїСЂРµРґРѕСЃС‚Р°РІР»РµРЅРѕ РЅРѕРІРѕРµ РёР·РѕР±СЂР°Р¶РµРЅРёРµ, СѓРґР°Р»СЏРµРј СЃС‚Р°СЂРѕРµ Рё СЃРѕС…СЂР°РЅСЏРµРј РЅРѕРІРѕРµ
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
                // Р•СЃР»Рё РЅРѕРІРѕРµ РёР·РѕР±СЂР°Р¶РµРЅРёРµ РЅРµ РїСЂРµРґРѕСЃС‚Р°РІР»РµРЅРѕ, СЃРѕС…СЂР°РЅСЏРµРј СЃСѓС‰РµСЃС‚РІСѓСЋС‰РёР№ РїСѓС‚СЊ
                deviceDto.ImagePath = existingDevice.ImagePath;
            }

            // РћР±РЅРѕРІР»СЏРµРј РґР°РЅРЅС‹Рµ СЃСѓС‰РµСЃС‚РІСѓСЋС‰РµРіРѕ СѓСЃС‚СЂРѕР№СЃС‚РІР°
            existingDevice.Name = deviceDto.Name;
            existingDevice.Description = deviceDto.Description;
            existingDevice.ImagePath = deviceDto.ImagePath;
            existingDevice.PowerConsumption = deviceDto.PowerConsumption;
            existingDevice.NoiseLevel = deviceDto.NoiseLevel;
            existingDevice.MaxAirflow = deviceDto.MaxAirflow;
            existingDevice.Price = deviceDto.Price;
            existingDevice.DeviceTypeId = deviceDto.DeviceTypeId;
            existingDevice.DeviceType = ventilationType;

            await _deviceRepository.UpdateAsync(existingDevice);
            return existingDevice;
        }
    }
} 
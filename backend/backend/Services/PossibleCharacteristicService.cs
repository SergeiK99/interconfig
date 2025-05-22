using BackendDataAccess.Repositories.IRepositories;
using BackendModels;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace backend.Services;

public class PossibleCharacteristicService
{
    private readonly IPossibleCharacteristicRepository _characteristicRepository;
    private readonly IDeviceTypeRepository _deviceTypeRepository;
    private readonly ILogger<PossibleCharacteristicService> _logger;

    public PossibleCharacteristicService(
        IPossibleCharacteristicRepository characteristicRepository,
        IDeviceTypeRepository deviceTypeRepository,
        ILogger<PossibleCharacteristicService> logger)
    {
        _characteristicRepository = characteristicRepository;
        _deviceTypeRepository = deviceTypeRepository;
        _logger = logger;
    }

    public async Task<PossibleCharacteristic> CreateCharacteristicAsync(PossibleCharacteristic characteristic)
    {
        try
        {
            var deviceType = await _deviceTypeRepository.GetByIdAsync(characteristic.DeviceTypeId);
            if (deviceType == null)
            {
                _logger.LogWarning("Attempted to create characteristic for non-existent device type {DeviceTypeId}", characteristic.DeviceTypeId);
                throw new ArgumentException("Указанный тип устройства не найден");
            }

            // Проверяем, не существует ли уже характеристика с таким именем для данного типа устройства
            var existingCharacteristics = await _characteristicRepository.GetAllWithDetailsAsync(characteristic.DeviceTypeId);
            if (existingCharacteristics.Any(c => c.Name.Equals(characteristic.Name, StringComparison.OrdinalIgnoreCase)))
            {
                _logger.LogWarning("Attempted to create duplicate characteristic {Name} for device type {DeviceTypeId}", characteristic.Name, characteristic.DeviceTypeId);
                throw new ArgumentException($"Характеристика с названием '{characteristic.Name}' уже существует для данного типа устройства");
            }

            await _characteristicRepository.AddAsync(characteristic);
            _logger.LogInformation("Created new characteristic {Name} for device type {DeviceTypeId}", characteristic.Name, characteristic.DeviceTypeId);
            return characteristic;
        }
        catch (Exception ex) when (ex is not ArgumentException)
        {
            _logger.LogError(ex, "Error occurred while creating characteristic {Name} for device type {DeviceTypeId}", characteristic.Name, characteristic.DeviceTypeId);
            throw new Exception("Не удалось создать характеристику", ex);
        }
    }

    public async Task<PossibleCharacteristic> UpdateCharacteristicAsync(int id, PossibleCharacteristic characteristic)
    {
        try
        {
            var existingCharacteristic = await _characteristicRepository.GetByIdWithDetailsAsync(id);
            if (existingCharacteristic == null)
            {
                _logger.LogWarning("Attempted to update non-existent characteristic with id {Id}", id);
                throw new ArgumentException($"Характеристика с ID {id} не найдена");
            }

            var deviceType = await _deviceTypeRepository.GetByIdAsync(characteristic.DeviceTypeId);
            if (deviceType == null)
            {
                _logger.LogWarning("Attempted to update characteristic to non-existent device type {DeviceTypeId}", characteristic.DeviceTypeId);
                throw new ArgumentException("Указанный тип устройства не найден");
            }

            // Проверяем, не существует ли уже характеристика с таким именем для данного типа устройства
            var existingCharacteristics = await _characteristicRepository.GetAllWithDetailsAsync(characteristic.DeviceTypeId);
            if (existingCharacteristics.Any(c => c.Id != id && c.Name.Equals(characteristic.Name, StringComparison.OrdinalIgnoreCase)))
            {
                _logger.LogWarning("Attempted to update characteristic to duplicate name {Name} for device type {DeviceTypeId}", characteristic.Name, characteristic.DeviceTypeId);
                throw new ArgumentException($"Характеристика с названием '{characteristic.Name}' уже существует для данного типа устройства");
            }

            existingCharacteristic.Name = characteristic.Name;
            existingCharacteristic.Unit = characteristic.Unit;
            existingCharacteristic.DeviceTypeId = characteristic.DeviceTypeId;

            await _characteristicRepository.UpdateAsync(existingCharacteristic);
            _logger.LogInformation("Updated characteristic {Name} for device type {DeviceTypeId}", characteristic.Name, characteristic.DeviceTypeId);
            return existingCharacteristic;
        }
        catch (Exception ex) when (ex is not ArgumentException)
        {
            _logger.LogError(ex, "Error occurred while updating characteristic {Id}", id);
            throw new Exception("Не удалось обновить характеристику", ex);
        }
    }

    public async Task DeleteCharacteristicAsync(int id)
    {
        try
        {
            var characteristic = await _characteristicRepository.GetByIdWithDetailsAsync(id);
            if (characteristic == null)
            {
                _logger.LogWarning("Attempted to delete non-existent characteristic with id {Id}", id);
                throw new ArgumentException($"Характеристика с ID {id} не найдена");
            }

            if (characteristic.Characteristics != null && characteristic.Characteristics.Any())
            {
                _logger.LogWarning("Attempted to delete characteristic {Id} that has associated characteristics", id);
                throw new ArgumentException("Невозможно удалить характеристику, так как она используется в устройствах");
            }

            await _characteristicRepository.DeleteAsync(id);
            _logger.LogInformation("Deleted characteristic {Name}", characteristic.Name);
        }
        catch (Exception ex) when (ex is not ArgumentException)
        {
            _logger.LogError(ex, "Error occurred while deleting characteristic {Id}", id);
            throw new Exception("Не удалось удалить характеристику", ex);
        }
    }
} 
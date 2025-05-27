using BackendDataAccess.Repositories.IRepositories;
using BackendModels;
using Microsoft.EntityFrameworkCore;

namespace backend.Services;

public class DeviceConfigResult
{
    public Device? Device { get; set; }
    public string? Reason { get; set; }
}

public class DeviceConfiguratorService
{
    private readonly IDeviceRepository _deviceRepository;
    private readonly IRoomTypeRepository _roomTypeRepository;

    public DeviceConfiguratorService(IDeviceRepository deviceRepository, IRoomTypeRepository roomTypeRepository)
    {
        _deviceRepository = deviceRepository;
        _roomTypeRepository = roomTypeRepository;
    }

    public async Task<DeviceConfigResult> FindBestDeviceWithReasonAsync(int deviceTypeId, int roomTypeId, double roomSize, int peopleCount, List<(int possibleCharacteristicId, string value)> selectedCharacteristics)
    {
        var roomType = await _roomTypeRepository.GetByIdAsync(roomTypeId);
        if (roomType == null)
            return new DeviceConfigResult { Reason = "Тип помещения не найден" };

        double requiredAirflow = (roomSize * roomType.AreaCoefficient) + (peopleCount * roomType.PeopleCoefficient);

        var devices = await _deviceRepository.GetAllAsync();
        var candidates = devices
            .Where(d => d.DeviceTypeId == deviceTypeId)
            .Where(d => d.MaxAirflow >= requiredAirflow)
            .ToList();

        // 1. Точное совпадение по всем характеристикам
        var exact = candidates.FirstOrDefault(d =>
            selectedCharacteristics == null || selectedCharacteristics.Count == 0 ||
            selectedCharacteristics.All(selChar =>
                d.Characteristics != null &&
                d.Characteristics.Any(dc => dc.PossibleCharacteristicId == selChar.possibleCharacteristicId && dc.Value == selChar.value)
            )
        );
        if (exact != null)
            return new DeviceConfigResult { Device = exact };

        // Нет подходящих вообще
        return new DeviceConfigResult { Reason = "Нет подходящих устройств по воздуху или типу устройства" };
    }
} 
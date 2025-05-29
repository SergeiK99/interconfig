using BackendDataAccess.Repositories.IRepositories;
using BackendModels;
using Microsoft.EntityFrameworkCore;

namespace backend.Services;

public class DeviceConfigResult
{
    public Device? Device { get; set; }
    public string? Reason { get; set; }
    public List<(int possibleCharacteristicId, string expected, string actual)>? Mismatches { get; set; }
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

        // Если пользователь не указал ни одной доп. характеристики, ищем устройства без характеристик
        if (selectedCharacteristics == null || selectedCharacteristics.Count == 0)
        {
            var noCharCandidates = candidates.Where(d => d.Characteristics == null || d.Characteristics.Count == 0).ToList();
            if (noCharCandidates.Count > 0)
            {
                // среди них выбираем с максимальным потоком
                var best = noCharCandidates.OrderByDescending(d => d.MaxAirflow).First();
                return new DeviceConfigResult { Device = best };
            }
            // если нет вообще без характеристик — возвращаем fallback (максимальный поток)
            var fallback = candidates.OrderByDescending(d => d.MaxAirflow).FirstOrDefault();
            if (fallback != null)
                return new DeviceConfigResult { Device = fallback };
        }

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

        // 2. Поиск наиболее близкого устройства по характеристикам
        Device? bestDevice = null;
        double bestScore = double.MaxValue;
        List<(int possibleCharacteristicId, string expected, string actual)>? bestMismatches = null;
        foreach (var device in candidates)
        {
            double score = 0;
            int boolMatches = 0;
            int boolTotal = 0;
            var mismatches = new List<(int, string, string)>();
            foreach (var selChar in selectedCharacteristics)
            {
                var devChar = device.Characteristics?.FirstOrDefault(dc => dc.PossibleCharacteristicId == selChar.possibleCharacteristicId);
                if (devChar == null)
                {
                    mismatches.Add((selChar.possibleCharacteristicId, selChar.value, "(нет у устройства)"));
                    score += 1000; // штраф за отсутствие
                    continue;
                }
                // Определяем тип характеристики
                var type = devChar.PossibleCharacteristic?.Type;
                if (type == "number")
                {
                    if (double.TryParse(selChar.value, out var userVal) && double.TryParse(devChar.Value, out var devVal))
                    {
                        score += Math.Abs(userVal - devVal);
                        if (userVal != devVal)
                            mismatches.Add((selChar.possibleCharacteristicId, selChar.value, devChar.Value));
                    }
                    else
                    {
                        mismatches.Add((selChar.possibleCharacteristicId, selChar.value, devChar.Value));
                        score += 1000;
                    }
                }
                else if (type == "bool")
                {
                    boolTotal++;
                    bool userBool = selChar.value == "true";
                    bool devBool = devChar.Value == "true";
                    if (userBool == devBool)
                    {
                        boolMatches++;
                    }
                    else
                    {
                        mismatches.Add((selChar.possibleCharacteristicId, selChar.value, devChar.Value));
                        score += 10; // небольшой штраф
                    }
                }
                else // string
                {
                    if (selChar.value != devChar.Value)
                    {
                        mismatches.Add((selChar.possibleCharacteristicId, selChar.value, devChar.Value));
                        score += 100;
                    }
                }
            }
            // Чем больше совпадений по bool, тем лучше (уменьшаем score)
            if (boolTotal > 0)
                score -= boolMatches * 5;
            if (score < bestScore)
            {
                bestScore = score;
                bestDevice = device;
                bestMismatches = mismatches;
            }
        }
        if (bestDevice != null)
            return new DeviceConfigResult { Device = bestDevice, Mismatches = bestMismatches };

        // Нет подходящих вообще
        return new DeviceConfigResult { Reason = "Нет подходящих устройств по воздуху или типу устройства" };
    }
} 
using BackendDataAccess.Repositories.IRepositories;
using BackendModels;

namespace backend.Services;

public class RoomTypeService
{
    private readonly IRoomTypeRepository _roomTypeRepository;

    public RoomTypeService(IRoomTypeRepository roomTypeRepository)
    {
        _roomTypeRepository = roomTypeRepository;
    }

    public async Task<RoomType> CreateRoomTypeAsync(RoomType roomType)
    {
        await _roomTypeRepository.AddAsync(roomType);
        return roomType;
    }

    public async Task<RoomType> UpdateRoomTypeAsync(int id, RoomType roomType)
    {
        var existingRoomType = await _roomTypeRepository.GetByIdAsync(id);
        if (existingRoomType == null)
        {
            throw new ArgumentException($"Тип помещения с ID {id} не найден");
        }

        existingRoomType.Name = roomType.Name;
        existingRoomType.AreaCoefficient = roomType.AreaCoefficient;
        existingRoomType.PeopleCoefficient = roomType.PeopleCoefficient;

        await _roomTypeRepository.UpdateAsync(existingRoomType);
        return existingRoomType;
    }
} 
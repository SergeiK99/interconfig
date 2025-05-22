using BackendModels;

namespace BackendDataAccess.Repositories.IRepositories;

public interface IRoomTypeRepository : IRepository<RoomType>
{
    Task<IEnumerable<RoomType>> GetAllWithDetailsAsync();
    Task<RoomType?> GetByIdWithDetailsAsync(int id);
} 
using BackendDataAccess.Repositories.IRepositories;
using BackendModels;
using Microsoft.EntityFrameworkCore;

namespace BackendDataAccess.Repositories;

public class RoomTypeRepository : Repository<RoomType>, IRoomTypeRepository
{
    public RoomTypeRepository(ApplicationDbContext context) : base(context)
    {
    }

    public async Task<IEnumerable<RoomType>> GetAllWithDetailsAsync()
    {
        return await _context.RoomTypes.ToListAsync();
    }

    public async Task<RoomType?> GetByIdWithDetailsAsync(int id)
    {
        return await _context.RoomTypes.FindAsync(id);
    }
} 
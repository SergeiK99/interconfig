using BackendDataAccess.Repositories.IRepositories;
using BackendModels;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace BackendDataAccess.Repositories;

public class DeviceTypeRepository : Repository<DeviceType>, IDeviceTypeRepository
{
    private readonly ILogger<DeviceTypeRepository> _logger;

    public DeviceTypeRepository(ApplicationDbContext context, ILogger<DeviceTypeRepository> logger) : base(context)
    {
        _logger = logger;
    }

    public override async Task<IEnumerable<DeviceType>> GetAllAsync()
    {
        try
        {
            return await _context.DeviceTypes
                .Include(dt => dt.PossibleCharacteristics)
                    .ThenInclude(pc => pc.Characteristics)
                .ToListAsync();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error occurred while getting all device types");
            throw new Exception("Failed to retrieve device types", ex);
        }
    }

    public override async Task<DeviceType?> GetByIdAsync(int id)
    {
        try
        {
            return await _context.DeviceTypes
                .Include(dt => dt.PossibleCharacteristics)
                    .ThenInclude(pc => pc.Characteristics)
                .FirstOrDefaultAsync(dt => dt.Id == id);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error occurred while getting device type with id {Id}", id);
            throw new Exception($"Failed to retrieve device type with id {id}", ex);
        }
    }
}

using BackendDataAccess.Repositories.IRepositories;
using BackendModels;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace BackendDataAccess.Repositories;

public class PossibleCharacteristicRepository : Repository<PossibleCharacteristic>, IPossibleCharacteristicRepository
{
    private readonly ILogger<PossibleCharacteristicRepository> _logger;

    public PossibleCharacteristicRepository(ApplicationDbContext context, ILogger<PossibleCharacteristicRepository> logger) : base(context)
    {
        _logger = logger;
    }

    public async Task<IEnumerable<PossibleCharacteristic>> GetAllWithDetailsAsync(int? deviceTypeId = null)
    {
        try
        {
            var query = _context.PossibleCharacteristics
                .Include(pc => pc.DeviceType)
                .Include(pc => pc.Characteristics)
                .AsQueryable();

            if (deviceTypeId.HasValue)
            {
                query = query.Where(pc => pc.DeviceTypeId == deviceTypeId.Value);
            }

            return await query.ToListAsync();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error occurred while getting possible characteristics for device type {DeviceTypeId}", deviceTypeId);
            throw new Exception($"Failed to retrieve possible characteristics for device type {deviceTypeId}", ex);
        }
    }

    public async Task<PossibleCharacteristic?> GetByIdWithDetailsAsync(int id)
    {
        try
        {
            return await _context.PossibleCharacteristics
                .Include(pc => pc.DeviceType)
                .Include(pc => pc.Characteristics)
                .FirstOrDefaultAsync(pc => pc.Id == id);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error occurred while getting possible characteristic with id {Id}", id);
            throw new Exception($"Failed to retrieve possible characteristic with id {id}", ex);
        }
    }
} 
using BackendDataAccess.Repositories.IRepositories;
using BackendModels;
using Microsoft.EntityFrameworkCore;

namespace BackendDataAccess.Repositories
{
    public class DeviceRepository(ApplicationDbContext context) : Repository<Device>(context), IDeviceRepository
    {
        public override async Task<IEnumerable<Device>> GetAllAsync()
        {
            return await _context.Devices
                .Include(d => d.DeviceType)
                .Include(d => d.Characteristics)
                    .ThenInclude(c => c.PossibleCharacteristic)
                .ToListAsync();
        }

        public override async Task<Device?> GetByIdAsync(int id)
        {
            return await _context.Devices.Include(d => d.DeviceType).FirstOrDefaultAsync(d => d.Id == id);
        }

        public async Task<DeviceType?> GetDeviceTypeByIdAsync(int id)
        {
            return await _context.DeviceTypes.FindAsync(id);
        }
    }
}

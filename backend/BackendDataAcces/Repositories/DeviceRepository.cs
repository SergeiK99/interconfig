using BackendDataAccess.Repositories.IRepositories;
using BackendModels;
using Microsoft.EntityFrameworkCore;

namespace BackendDataAccess.Repositories
{
    public class DeviceRepository(ApplicationDbContext context) : Repository<Device>(context), IDeviceRepository
    {
        public override async Task<IEnumerable<Device>> GetAllAsync()
        {
            return await _context.Devices.Include(d => d.VentilationType).ToListAsync();
        }

        public override async Task<Device?> GetByIdAsync(int id)
        {
            return await _context.Devices.Include(d => d.VentilationType).FirstOrDefaultAsync(d => d.Id == id);
        }

        public async Task<VentilationType?> GetVentilationTypeByIdAsync(int id)
        {
            return await _context.VentilationTypes.FindAsync(id);
        }
    }
}

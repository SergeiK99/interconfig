using BackendDataAccess.Repositories.IRepositories;
using BackendModels;
using Microsoft.EntityFrameworkCore;

namespace BackendDataAccess.Repositories
{
    public class DeviceRepository : Repository<Device>, IDeviceRepository
    {
        private readonly ApplicationDbContext _context;

        public DeviceRepository(ApplicationDbContext context) : base(context) 
        { 
            _context = context;
        }

        public async Task<IEnumerable<Device>> GetAllAsync()
        {
            return await _context.Devices.Include(d => d.VentilationType).ToListAsync();
        }

        public async Task<Device> GetByIdAsync(int id)
        {
            return await _context.Devices.Include(d => d.VentilationType).FirstOrDefaultAsync(d => d.Id == id);
        }
    }
}

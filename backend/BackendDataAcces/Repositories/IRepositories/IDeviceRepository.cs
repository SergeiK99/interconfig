using BackendModels;

namespace BackendDataAccess.Repositories.IRepositories
{
    public interface IDeviceRepository : IRepository<Device>
    {
        Task<VentilationType?> GetVentilationTypeByIdAsync(int id);
    }
}

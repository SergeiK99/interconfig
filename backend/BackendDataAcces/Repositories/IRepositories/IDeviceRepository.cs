using BackendModels;

namespace BackendDataAccess.Repositories.IRepositories
{
    public interface IDeviceRepository : IRepository<Device>
    {
        Task<DeviceType?> GetDeviceTypeByIdAsync(int id);
    }
}

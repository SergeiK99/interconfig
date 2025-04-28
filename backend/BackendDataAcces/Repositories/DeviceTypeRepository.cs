using BackendDataAccess.Repositories.IRepositories;
using BackendModels;

namespace BackendDataAccess.Repositories;

public class DeviceTypeRepository(ApplicationDbContext context) : Repository<DeviceType>(context), IDeviceTypeRepository
{

}

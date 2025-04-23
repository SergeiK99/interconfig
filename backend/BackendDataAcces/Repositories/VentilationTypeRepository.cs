using BackendDataAccess.Repositories.IRepositories;
using BackendModels;

namespace BackendDataAccess.Repositories
{
    public class VentilationTypeRepository(ApplicationDbContext context) : Repository<VentilationType>(context), IVentilationTypeRepository
    {
    }
}

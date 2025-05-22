using BackendModels;

namespace BackendDataAccess.Repositories.IRepositories;

public interface IPossibleCharacteristicRepository : IRepository<PossibleCharacteristic>
{
    Task<IEnumerable<PossibleCharacteristic>> GetAllWithDetailsAsync(int? deviceTypeId = null);
    Task<PossibleCharacteristic?> GetByIdWithDetailsAsync(int id);
}
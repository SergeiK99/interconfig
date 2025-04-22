using BackendModels;

namespace BackendDataAccess.Repositories.IRepositories
{
    public interface IUserRepository
    {
        Task<User?> GetByEmailAsync(string email);
        Task<bool> ExistsByEmailAsync(string email);
        Task<User> CreateAsync(User user);
    }
} 
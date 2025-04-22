using backend.DTOs;
using backend.Extensions;
using BackendDataAccess.Repositories.IRepositories;
using BackendModels;

namespace backend.Services
{
    public class AuthService : IAuthService
    {
        private readonly IConfiguration _configuration;
        private readonly IUserRepository _userRepository;

        public AuthService(IConfiguration configuration, IUserRepository userRepository)
        {
            _configuration = configuration;
            _userRepository = userRepository;
        }

        public async Task CreateAdminAsync(string email, string password)
        {
            if (await _userRepository.ExistsByEmailAsync(email))
            {
                throw new Exception("Пользователь с таким email уже существует");
            }

            var admin = new User
            {
                Email = email,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(password),
                Role = "Admin"
            };

            await _userRepository.CreateAsync(admin);
        }

        public async Task<AuthResponseDTO> RegisterAsync(RegisterDTO model)
        {
            if (await _userRepository.ExistsByEmailAsync(model.Email))
            {
                throw new Exception("Пользователь с таким email уже существует");
            }

            var user = new User
            {
                Email = model.Email,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(model.Password),
                Role = "User"
            };

            await _userRepository.CreateAsync(user);

            var token = user.GenerateJwtToken(_configuration);
            return new AuthResponseDTO
            {
                Token = token,
                Role = user.Role,
                Email = user.Email
            };
        }

        public async Task<AuthResponseDTO> LoginAsync(LoginDTO model)
        {
            var user = await _userRepository.GetByEmailAsync(model.Email);
            if (user == null || !BCrypt.Net.BCrypt.Verify(model.Password, user.PasswordHash))
            {
                throw new Exception("Неверный email или пароль");
            }

            var token = user.GenerateJwtToken(_configuration);
            return new AuthResponseDTO
            {
                Token = token,
                Role = user.Role,
                Email = user.Email
            };
        }
    }
} 
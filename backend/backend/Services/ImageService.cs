using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Hosting;

namespace backend.Services
{
    public class ImageService
    {
        private readonly IWebHostEnvironment _environment;
        private readonly string[] _allowedExtensions = { ".jpg", ".jpeg", ".png", ".gif" };

        public ImageService(IWebHostEnvironment environment)
        {
            _environment = environment;
        }

        public async Task<string> SaveImageAsync(IFormFile image, string subfolder = "devices")
        {
            if (image == null || image.Length == 0)
            {
                throw new ArgumentException("Изображение обязательно для загрузки");
            }

            var fileExtension = Path.GetExtension(image.FileName).ToLowerInvariant();
            if (!_allowedExtensions.Contains(fileExtension))
            {
                throw new ArgumentException($"Недопустимый формат файла. Разрешены только: {string.Join(", ", _allowedExtensions)}");
            }

            var uploadsFolder = Path.Combine(_environment.WebRootPath ?? "wwwroot", "uploads", subfolder);
            if (!Directory.Exists(uploadsFolder))
            {
                Directory.CreateDirectory(uploadsFolder);
            }

            var uniqueFileName = $"{Guid.NewGuid()}_{image.FileName}";
            var filePath = Path.Combine(uploadsFolder, uniqueFileName);

            using (var fileStream = new FileStream(filePath, FileMode.Create))
            {
                await image.CopyToAsync(fileStream);
            }

            return $"/uploads/{subfolder}/{uniqueFileName}";
        }

        public void DeleteImage(string imagePath)
        {
            if (string.IsNullOrEmpty(imagePath))
            {
                return;
            }

            // Удаляем начальный слэш, если он есть
            var relativePath = imagePath.TrimStart('/');
            var fullPath = Path.Combine(_environment.WebRootPath ?? "wwwroot", relativePath);

            if (File.Exists(fullPath))
            {
                File.Delete(fullPath);
            }
        }
    }
} 
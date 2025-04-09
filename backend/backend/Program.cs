using BackendDataAccess;
using BackendDataAccess.Repositories;
using BackendDataAccess.Repositories.IRepositories;
using Microsoft.EntityFrameworkCore;

namespace backend
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            // Add services to the container.

            builder.Services.AddControllers();
            // Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen();

            builder.Services.AddScoped<IDeviceRepository, DeviceRepository>();
            builder.Services.AddScoped<IVentilationTypeRepository, VentilationTypeRepository>();
            builder.Services.AddControllers();

            builder.Services.AddDbContext<ApplicationDbContext>(
                options =>
                {
                    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection"));
                });

            builder.Services.AddCors(options =>
            {
                options.AddDefaultPolicy(policy =>
                {
                    policy.WithOrigins("http://localhost:3000");
                    policy.AllowAnyHeader();
                    policy.AllowAnyMethod();
                }
                );
            }
            );

            var app = builder.Build();

            // Configure the HTTP request pipeline.
            if (app.Environment.IsDevelopment())
            {
                app.UseSwagger();
                app.UseSwaggerUI();
            }

            app.UseHttpsRedirection();

            app.UseAuthorization();


            app.UseCors();
            app.MapControllers();

            app.Run();
        }
    }
}

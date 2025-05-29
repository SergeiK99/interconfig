using BackendDataAccess.Configurations;
using BackendModels;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BackendDataAccess
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
        { 

        }

        public DbSet<Device> Devices { get; set; }
        public DbSet<RoomType> RoomTypes { get; set; }
        public DbSet<DeviceType> DeviceTypes { get; set; }
        public DbSet<User> Users { get; set; }
        public DbSet<Cart> Carts { get; set; }
        public DbSet<Order> Orders { get; set; }
        public DbSet<CartItem> CartItems { get; set; }
        public DbSet<OrderItem> OrderItems { get; set; }
        public DbSet<PossibleCharacteristic> PossibleCharacteristics { get; set; }
        public DbSet<Characteristic> Characteristics { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.ApplyConfiguration(new DeviceConfiguration());
            modelBuilder.ApplyConfiguration(new RoomTypeConfiguration());
            modelBuilder.ApplyConfiguration(new DeviceTypeConfiguration());

            // Конфигурация для User
            modelBuilder.Entity<User>()
                .HasIndex(u => u.Email)
                .IsUnique();

            // Конфигурация для PossibleCharacteristic
            modelBuilder.Entity<PossibleCharacteristic>()
                .HasOne(pc => pc.DeviceType)
                .WithMany(dt => dt.PossibleCharacteristics)
                .HasForeignKey(pc => pc.DeviceTypeId)
                .OnDelete(DeleteBehavior.Cascade);

            // Конфигурация для Characteristic
            modelBuilder.Entity<Characteristic>()
                .HasOne(c => c.Device)
                .WithMany(d => d.Characteristics)
                .HasForeignKey(c => c.DeviceId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Characteristic>()
                .HasOne(c => c.PossibleCharacteristic)
                .WithMany(pc => pc.Characteristics)
                .HasForeignKey(c => c.PossibleCharacteristicId)
                .OnDelete(DeleteBehavior.Restrict);

            base.OnModelCreating(modelBuilder);
        }
    }
}

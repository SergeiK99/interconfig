﻿using BackendDataAccess.Configurations;
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
            modelBuilder.ApplyConfiguration(new UserConfiguration());
            modelBuilder.ApplyConfiguration(new PossibleCharacteristicConfiguration());
            modelBuilder.ApplyConfiguration(new CharacteristicConfiguration());

            base.OnModelCreating(modelBuilder);
        }
    }
}

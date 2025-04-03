using BackendModels;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BackendDataAcces
{
    public class ApplicationDbContext : DbContext
    {
        ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
        { 

        }

        public DbSet<Device> Devices { get; set; }
        public DbSet<RoomType> RoomTypes { get; set; }
        public DbSet<VentilationType> VentilationTypes { get; set; }
    }
}

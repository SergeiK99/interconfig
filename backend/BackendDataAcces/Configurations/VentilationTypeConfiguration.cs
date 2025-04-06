using BackendModels;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using System.Security.Cryptography.X509Certificates;

namespace BackendDataAccess.Configurations
{
    public class VentilationTypeConfiguration : IEntityTypeConfiguration<VentilationType>
    {
        public void Configure(EntityTypeBuilder<VentilationType> builder)
        {
            builder.HasKey(x => x.Id);
            builder.HasMany(x = )
        }
    }
}

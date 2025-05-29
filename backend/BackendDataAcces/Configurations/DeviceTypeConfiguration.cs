using BackendModels;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using System.Security.Cryptography.X509Certificates;

namespace BackendDataAccess.Configurations
{
    public class DeviceTypeConfiguration : IEntityTypeConfiguration<DeviceType>
    {
        public void Configure(EntityTypeBuilder<DeviceType> builder)
        {
            builder.HasKey(x => x.Id);

            builder.Property(x => x.Name)
                .IsRequired()
                .HasMaxLength(100);

            builder.Property(x => x.Description)
                .HasMaxLength(500);

            builder.HasMany(x => x.PossibleCharacteristics)
                .WithOne(x => x.DeviceType)
                .HasForeignKey(x => x.DeviceTypeId)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}

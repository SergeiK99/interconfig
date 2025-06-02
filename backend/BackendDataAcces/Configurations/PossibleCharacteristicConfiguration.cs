using BackendModels;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace BackendDataAccess.Configurations
{
    public class PossibleCharacteristicConfiguration : IEntityTypeConfiguration<PossibleCharacteristic>
    {
        public void Configure(EntityTypeBuilder<PossibleCharacteristic> builder)
        {
            builder.HasOne(pc => pc.DeviceType)
                .WithMany(dt => dt.PossibleCharacteristics)
                .HasForeignKey(pc => pc.DeviceTypeId)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
} 
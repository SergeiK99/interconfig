using BackendModels;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace BackendDataAccess.Configurations
{
    public class CharacteristicConfiguration : IEntityTypeConfiguration<Characteristic>
    {
        public void Configure(EntityTypeBuilder<Characteristic> builder)
        {
            builder.HasOne(c => c.Device)
                .WithMany(d => d.Characteristics)
                .HasForeignKey(c => c.DeviceId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.HasOne(c => c.PossibleCharacteristic)
                .WithMany(pc => pc.Characteristics)
                .HasForeignKey(c => c.PossibleCharacteristicId)
                .OnDelete(DeleteBehavior.Restrict);
        }
    }
} 
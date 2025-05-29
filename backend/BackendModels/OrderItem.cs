using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BackendModels;

public class OrderItem
{
    [Key]
    public int Id { get; set; }
    
    [Required]
    public int OrderId { get; set; }
    
    [ForeignKey("OrderId")]
    public Order Order { get; set; }
    
    [Required]
    public int DeviceId { get; set; }
    
    [ForeignKey("DeviceId")]
    public Device Device { get; set; }
    
    [Required]
    [Range(1, int.MaxValue)]
    public int Quantity { get; set; }
    
    [Required]
    public decimal UnitPrice { get; set; }
    
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
} 
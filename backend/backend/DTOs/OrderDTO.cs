using BackendModels;

namespace backend.DTOs;

public class OrderDTO
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public List<OrderItemDTO> Items { get; set; }
    public decimal TotalPrice { get; set; }
    public string ShippingAddress { get; set; }
    public string PhoneNumber { get; set; }
    public string Email { get; set; }
    public string? Notes { get; set; }
    public OrderStatus Status { get; set; }
    public DateTime CreatedAt { get; set; }
}

public class OrderItemDTO
{
    public int Id { get; set; }
    public int DeviceId { get; set; }
    public string DeviceName { get; set; }
    public decimal UnitPrice { get; set; }
    public int Quantity { get; set; }
    public decimal TotalPrice => UnitPrice * Quantity;
}

public class CreateOrderDTO
{
    public string ShippingAddress { get; set; }
    public string PhoneNumber { get; set; }
    public string Email { get; set; }
    public string? Notes { get; set; }
} 
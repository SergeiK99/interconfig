using BackendModels;

namespace backend.DTOs;

public class CartDTO
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public List<CartItemDTO> Items { get; set; }
    public decimal TotalPrice { get; set; }
}

public class CartItemDTO
{
    public int Id { get; set; }
    public int DeviceId { get; set; }
    public string DeviceName { get; set; }
    public decimal DevicePrice { get; set; }
    public int Quantity { get; set; }
    public decimal TotalPrice => DevicePrice * Quantity;
}

public class AddToCartDTO
{
    public int DeviceId { get; set; }
    public int Quantity { get; set; }
}

public class UpdateCartItemDTO
{
    public int Quantity { get; set; }
} 
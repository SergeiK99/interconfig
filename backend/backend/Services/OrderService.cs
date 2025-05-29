using BackendDataAccess;
using BackendModels;
using backend.DTOs;
using Microsoft.EntityFrameworkCore;

namespace backend.Services;

public interface IOrderService
{
    Task<OrderDTO> CreateOrderAsync(int userId, CreateOrderDTO dto);
    Task<OrderDTO> GetOrderAsync(int userId, int orderId);
    Task<List<OrderDTO>> GetUserOrdersAsync(int userId);
    Task<OrderDTO> UpdateOrderStatusAsync(int userId, int orderId, OrderStatus status);
}

public class OrderService : IOrderService
{
    private readonly ApplicationDbContext _context;
    private readonly ICartService _cartService;

    public OrderService(ApplicationDbContext context, ICartService cartService)
    {
        _context = context;
        _cartService = cartService;
    }

    public async Task<OrderDTO> CreateOrderAsync(int userId, CreateOrderDTO dto)
    {
        var cart = await _context.Carts
            .Include(c => c.Items)
            .ThenInclude(i => i.Device)
            .FirstOrDefaultAsync(c => c.UserId == userId);

        if (cart == null || !cart.Items.Any())
            throw new ArgumentException("Cart is empty");

        var order = new Order
        {
            UserId = userId,
            ShippingAddress = dto.ShippingAddress,
            PhoneNumber = dto.PhoneNumber,
            Email = dto.Email,
            Notes = dto.Notes,
            Items = cart.Items.Select(i => new OrderItem
            {
                DeviceId = i.DeviceId,
                Quantity = i.Quantity,
                UnitPrice = i.Device.Price
            }).ToList()
        };

        _context.Orders.Add(order);
        await _cartService.ClearCartAsync(userId);
        await _context.SaveChangesAsync();

        return MapToDTO(order);
    }

    public async Task<OrderDTO> GetOrderAsync(int userId, int orderId)
    {
        var order = await _context.Orders
            .Include(o => o.Items)
            .ThenInclude(i => i.Device)
            .FirstOrDefaultAsync(o => o.Id == orderId && o.UserId == userId);

        if (order == null)
            throw new ArgumentException("Order not found");

        return MapToDTO(order);
    }

    public async Task<List<OrderDTO>> GetUserOrdersAsync(int userId)
    {
        var orders = await _context.Orders
            .Include(o => o.Items)
            .ThenInclude(i => i.Device)
            .Where(o => o.UserId == userId)
            .OrderByDescending(o => o.CreatedAt)
            .ToListAsync();

        return orders.Select(MapToDTO).ToList();
    }

    public async Task<OrderDTO> UpdateOrderStatusAsync(int userId, int orderId, OrderStatus status)
    {
        var order = await _context.Orders
            .Include(o => o.Items)
            .ThenInclude(i => i.Device)
            .FirstOrDefaultAsync(o => o.Id == orderId && o.UserId == userId);

        if (order == null)
            throw new ArgumentException("Order not found");

        order.Status = status;
        order.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        return MapToDTO(order);
    }

    private static OrderDTO MapToDTO(Order order)
    {
        return new OrderDTO
        {
            Id = order.Id,
            UserId = order.UserId,
            Items = order.Items.Select(i => new OrderItemDTO
            {
                Id = i.Id,
                DeviceId = i.DeviceId,
                DeviceName = i.Device.Name,
                UnitPrice = i.UnitPrice,
                Quantity = i.Quantity
            }).ToList(),
            TotalPrice = order.TotalPrice,
            ShippingAddress = order.ShippingAddress,
            PhoneNumber = order.PhoneNumber,
            Email = order.Email,
            Notes = order.Notes,
            Status = order.Status,
            CreatedAt = order.CreatedAt
        };
    }
} 
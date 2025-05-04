using System.Security.Claims;
using BackendDataAccess;
using BackendModels;
using backend.DTOs;
using Microsoft.EntityFrameworkCore;

namespace backend.Services;

public interface ICartService
{
    Task<CartDTO> GetCartAsync(int userId);
    Task<CartDTO> AddToCartAsync(int userId, AddToCartDTO dto);
    Task<CartDTO> UpdateCartItemAsync(int userId, int itemId, UpdateCartItemDTO dto);
    Task RemoveFromCartAsync(int userId, int itemId);
    Task ClearCartAsync(int userId);
}

public class CartService : ICartService
{
    private readonly ApplicationDbContext _context;

    public CartService(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<CartDTO> GetCartAsync(int userId)
    {
        var cart = await _context.Carts
            .Include(c => c.Items)
            .ThenInclude(i => i.Device)
            .FirstOrDefaultAsync(c => c.UserId == userId);

        if (cart == null)
        {
            cart = new Cart { UserId = userId };
            _context.Carts.Add(cart);
            await _context.SaveChangesAsync();
        }

        return MapToDTO(cart);
    }

    public async Task<CartDTO> AddToCartAsync(int userId, AddToCartDTO dto)
    {
        var cart = await _context.Carts
            .Include(c => c.Items)
            .ThenInclude(i => i.Device)
            .FirstOrDefaultAsync(c => c.UserId == userId);

        if (cart == null)
        {
            cart = new Cart { UserId = userId };
            _context.Carts.Add(cart);
        }

        var existingItem = cart.Items.FirstOrDefault(i => i.DeviceId == dto.DeviceId);
        if (existingItem != null)
        {
            existingItem.Quantity += dto.Quantity;
            existingItem.UpdatedAt = DateTime.UtcNow;
        }
        else
        {
            var device = await _context.Devices.FindAsync(dto.DeviceId);
            if (device == null)
                throw new ArgumentException("Device not found");

            cart.Items.Add(new CartItem
            {
                DeviceId = dto.DeviceId,
                Quantity = dto.Quantity
            });
        }

        cart.UpdatedAt = DateTime.UtcNow;
        await _context.SaveChangesAsync();

        return MapToDTO(cart);
    }

    public async Task<CartDTO> UpdateCartItemAsync(int userId, int itemId, UpdateCartItemDTO dto)
    {
        var cart = await _context.Carts
            .Include(c => c.Items)
            .ThenInclude(i => i.Device)
            .FirstOrDefaultAsync(c => c.UserId == userId);

        if (cart == null)
            throw new ArgumentException("Cart not found");

        var item = cart.Items.FirstOrDefault(i => i.Id == itemId);
        if (item == null)
            throw new ArgumentException("Item not found");

        item.Quantity = dto.Quantity;
        item.UpdatedAt = DateTime.UtcNow;
        cart.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        return MapToDTO(cart);
    }

    public async Task RemoveFromCartAsync(int userId, int itemId)
    {
        var cart = await _context.Carts
            .Include(c => c.Items)
            .FirstOrDefaultAsync(c => c.UserId == userId);

        if (cart == null)
            throw new ArgumentException("Cart not found");

        var item = cart.Items.FirstOrDefault(i => i.Id == itemId);
        if (item == null)
            throw new ArgumentException("Item not found");

        cart.Items.Remove(item);
        cart.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();
    }

    public async Task ClearCartAsync(int userId)
    {
        var cart = await _context.Carts
            .Include(c => c.Items)
            .FirstOrDefaultAsync(c => c.UserId == userId);

        if (cart == null)
            throw new ArgumentException("Cart not found");

        cart.Items.Clear();
        cart.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();
    }

    private static CartDTO MapToDTO(Cart cart)
    {
        return new CartDTO
        {
            Id = cart.Id,
            UserId = cart.UserId,
            Items = cart.Items.Select(i => new CartItemDTO
            {
                Id = i.Id,
                DeviceId = i.DeviceId,
                DeviceName = i.Device.Name,
                DevicePrice = i.Device.Price,
                Quantity = i.Quantity
            }).ToList(),
            TotalPrice = cart.TotalPrice
        };
    }
} 
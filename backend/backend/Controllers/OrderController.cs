using backend.DTOs;
using backend.Services;
using BackendModels;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace backend.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class OrderController : ControllerBase
{
    private readonly IOrderService _orderService;

    public OrderController(IOrderService orderService)
    {
        _orderService = orderService;
    }

    [HttpPost]
    public async Task<ActionResult<OrderDTO>> CreateOrder(CreateOrderDTO dto)
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (userIdClaim == null || !int.TryParse(userIdClaim, out int userId))
            return Unauthorized();

        var order = await _orderService.CreateOrderAsync(userId, dto);
        return Ok(order);
    }

    [HttpGet("{orderId}")]
    public async Task<ActionResult<OrderDTO>> GetOrder(int orderId)
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (userIdClaim == null || !int.TryParse(userIdClaim, out int userId))
            return Unauthorized();

        var order = await _orderService.GetOrderAsync(userId, orderId);
        return Ok(order);
    }

    [HttpGet]
    public async Task<ActionResult<List<OrderDTO>>> GetUserOrders()
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (userIdClaim == null || !int.TryParse(userIdClaim, out int userId))
            return Unauthorized();

        var orders = await _orderService.GetUserOrdersAsync(userId);
        return Ok(orders);
    }

    [HttpPut("{orderId}/status")]
    public async Task<ActionResult<OrderDTO>> UpdateOrderStatus(int orderId, [FromBody] OrderStatus status)
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (userIdClaim == null || !int.TryParse(userIdClaim, out int userId))
            return Unauthorized();

        var order = await _orderService.UpdateOrderStatusAsync(userId, orderId, status);
        return Ok(order);
    }
} 
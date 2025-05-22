using backend.DTOs;
using backend.Services;
using BackendDataAccess.Repositories.IRepositories;
using BackendModels;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers;

[Route("api/[controller]")]
[ApiController]
public class RoomTypesController : ControllerBase
{
    private readonly IRoomTypeRepository _roomTypeRepository;
    private readonly RoomTypeService _roomTypeService;

    public RoomTypesController(IRoomTypeRepository roomTypeRepository, RoomTypeService roomTypeService)
    {
        _roomTypeRepository = roomTypeRepository;
        _roomTypeService = roomTypeService;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<RoomType>>> GetRoomTypes()
    {
        var roomTypes = await _roomTypeRepository.GetAllWithDetailsAsync();
        return Ok(roomTypes);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<RoomType>> GetRoomType(int id)
    {
        var roomType = await _roomTypeRepository.GetByIdWithDetailsAsync(id);
        if (roomType == null)
        {
            return NotFound();
        }
        return Ok(roomType);
    }

    [HttpPost]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<RoomType>> CreateRoomType(RoomTypeDto roomTypeDto)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        try
        {
            var roomType = new RoomType
            {
                Name = roomTypeDto.Name,
                AreaCoefficient = roomTypeDto.AreaCoefficient,
                PeopleCoefficient = roomTypeDto.PeopleCoefficient
            };

            var createdRoomType = await _roomTypeService.CreateRoomTypeAsync(roomType);
            return CreatedAtAction(nameof(GetRoomType), new { id = createdRoomType.Id }, createdRoomType);
        }
        catch (ArgumentException ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [HttpPut("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> UpdateRoomType(int id, RoomTypeDto roomTypeDto)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        try
        {
            var roomType = new RoomType
            {
                Name = roomTypeDto.Name,
                AreaCoefficient = roomTypeDto.AreaCoefficient,
                PeopleCoefficient = roomTypeDto.PeopleCoefficient
            };

            var updatedRoomType = await _roomTypeService.UpdateRoomTypeAsync(id, roomType);
            return Ok(updatedRoomType);
        }
        catch (ArgumentException ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [HttpDelete("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> DeleteRoomType(int id)
    {
        var roomType = await _roomTypeRepository.GetByIdAsync(id);
        if (roomType == null)
        {
            return NotFound();
        }

        await _roomTypeRepository.DeleteAsync(id);
        return NoContent();
    }
} 
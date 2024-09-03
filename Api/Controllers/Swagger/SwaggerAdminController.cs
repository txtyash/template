using Api.Dtos;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Api.Models;

namespace Api.Controllers.Swagger;

[Route("api/[controller]")]
[ApiController]
[Authorize(Roles = "Admin")]
public class SwaggerAdminController(UserManager<AppUser> userManager) : ControllerBase
{
    private readonly UserManager<AppUser> _userManager = userManager;
    
    [HttpGet]
    public async Task<ActionResult<SwaggerUserDto>> Get()
    {
        var userId = _userManager.GetUserId(User);
        if (userId == null) return NotFound();
        var user = await _userManager.FindByIdAsync(userId);
        if (user == null) return NotFound();
        var roles = await _userManager.GetRolesAsync(user);
        var dto = new SwaggerUserDto
        {
            Id = user.Id,
            UserName = user.UserName ?? "USER NAME NOT SET",
            Email = user.Email ?? "USER EMAIL NOT SET",
            FirstName = user.FirstName,
            LastName = user.LastName,
            Roles = roles.ToList(),
            Message = "This can only be seen by users with 'Admin' role" 
        };
        return dto;
    }
}
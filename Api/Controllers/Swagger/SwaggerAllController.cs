using Api.Dtos;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Api.Models;

namespace Api.Controllers.Swagger;

[Route("api/[controller]")]
[ApiController]
public class SwaggerAllController(UserManager<AppUser> userManager) : ControllerBase
{
    private readonly UserManager<AppUser> _userManager = userManager;
    
    [HttpGet]
    public async Task<ActionResult<IEnumerable<SwaggerUserDto>>> Get()
    {
        var users = await _userManager.Users.ToListAsync();
        var userDtos = new List<SwaggerUserDto>();

        foreach (var user in users)
        {
            var roles = await _userManager.GetRolesAsync(user);
            userDtos.Add(new SwaggerUserDto()
            {
                Id = user.Id,
                UserName = user.UserName ?? "USERNAME NOT SET",
                Email = user.Email ?? "EMAIL NOT SET",
                FirstName = user.FirstName,
                LastName = user.LastName,
                Roles = roles.ToList(),
                Message = "This can be seen by unauthorized users." 
            });
        }
        return userDtos;
    }
}
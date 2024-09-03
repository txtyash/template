using Api.Dtos;
using Api.Models;
using Api.Services;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;
using System.Net;

namespace Api.Controllers;

[Route("api/[controller]")]
[ApiController]
public class AuthController(UserManager<AppUser> userManager, JwtService jwtService, ILogger<AuthController> logger) : ControllerBase
{
    [HttpPost("register")]
    [EnableRateLimiting("registration")]
    public async Task<IActionResult> Register(RegisterModelDto modelDto)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        if (modelDto.Password != modelDto.ConfirmPassword)
        {
            return BadRequest(new { message = "Password and Confirmation Password do not match." });
        }

        var user = new AppUser
        {
            UserName = modelDto.Email,
            Email = modelDto.Email,
            FirstName = modelDto.FirstName,
            LastName = modelDto.LastName
        };

        var result = await userManager.CreateAsync(user, modelDto.Password);

        if (!result.Succeeded)
        {
            foreach (var error in result.Errors)
            {
                ModelState.AddModelError(string.Empty, error.Description);
            }
            return BadRequest(ModelState);
        }

        string role = user.Email == "admin@gmail.com" ? "Admin" : "User";
        await userManager.AddToRoleAsync(user, role);

        logger.LogInformation($"User {user.Email} registered successfully with role {role}");
        return Ok(new { message = "User registered successfully" });
    }

    [HttpPost("login")]
    [EnableRateLimiting("login")]
    public async Task<IActionResult> Login(LoginModelDto model)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        var user = await userManager.FindByEmailAsync(model.Email);
        if (user == null || !await userManager.CheckPasswordAsync(user, model.Password))
        {
            logger.LogWarning($"Failed login attempt for email: {model.Email}");
            return StatusCode((int)HttpStatusCode.Unauthorized, new { message = "Invalid email or password" });
        }

        var roles = await userManager.GetRolesAsync(user);
        var token = jwtService.CreateToken(user, roles);

        logger.LogInformation($"Successful login for user: {user.Email}");
        return Ok(new { token, message = "Login successful" });
    }
}
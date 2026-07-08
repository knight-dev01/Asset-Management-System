using AssetManagement.Api.Models;
using AssetManagement.Api.Services;
using Microsoft.AspNetCore.Mvc;

namespace AssetManagement.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IUserRepository _userRepository;

    public AuthController(IUserRepository userRepository)
    {
        _userRepository = userRepository;
    }

    [HttpPost("register")]
    public IActionResult Register([FromBody] RegisterRequest request)
    {
        if (request == null || string.IsNullOrWhiteSpace(request.Email) || string.IsNullOrWhiteSpace(request.Password))
        {
            return BadRequest(new { error = "Email, displayName and password are required." });
        }

        try
        {
            var user = _userRepository.Create(request.Email.Trim().ToLowerInvariant(), request.DisplayName.Trim(), request.Password);
            return Ok(new AuthResponse(
                user.UserId,
                user.Email,
                user.DisplayName,
                true,
                Guid.NewGuid().ToString()));
        }
        catch (InvalidOperationException ex)
        {
            return Conflict(new { error = ex.Message });
        }
    }

    [HttpPost("login")]
    public IActionResult Login([FromBody] LoginRequest request)
    {
        if (request == null || string.IsNullOrWhiteSpace(request.Email) || string.IsNullOrWhiteSpace(request.Password))
        {
            return BadRequest(new { error = "Email and password are required." });
        }

        if (!_userRepository.ValidatePassword(request.Email.Trim().ToLowerInvariant(), request.Password, out var user) || user == null)
        {
            return Unauthorized(new { error = "Invalid email or password." });
        }

        return Ok(new AuthResponse(
            user.UserId,
            user.Email,
            user.DisplayName,
            true,
            Guid.NewGuid().ToString()));
    }
}

public record RegisterRequest(string Email, string DisplayName, string Password);
public record LoginRequest(string Email, string Password);
public record AuthResponse(string UserId, string Email, string DisplayName, bool IsLocal, string SessionToken);

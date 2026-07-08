using AssetManagement.Api.Models;
using AssetManagement.Api.Services;
using Microsoft.AspNetCore.Mvc;

namespace AssetManagement.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IUserRepository _userRepository;
    private readonly ISessionRepository _sessionRepository;

    public AuthController(IUserRepository userRepository, ISessionRepository sessionRepository)
    {
        _userRepository = userRepository;
        _sessionRepository = sessionRepository;
    }

    [HttpPost("register")]
    public IActionResult Register([FromBody] RegisterRequest request)
    {
        if (request == null || string.IsNullOrWhiteSpace(request.Email) || string.IsNullOrWhiteSpace(request.Password) || string.IsNullOrWhiteSpace(request.DisplayName))
        {
            return BadRequest(new { error = "Email, displayName and password are required." });
        }

        try
        {
            var user = _userRepository.Create(request.Email.Trim().ToLowerInvariant(), request.DisplayName.Trim(), request.Password);
            var session = _sessionRepository.CreateSession(user);

            return Ok(new AuthResponse(
                user.UserId,
                user.Email,
                user.DisplayName,
                true,
                session.SessionToken,
                session.ExpiresAt));
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

        var session = _sessionRepository.CreateSession(user);
        return Ok(new AuthResponse(
            user.UserId,
            user.Email,
            user.DisplayName,
            true,
            session.SessionToken,
            session.ExpiresAt));
    }

    [HttpPost("logout")]
    public IActionResult Logout([FromBody] LogoutRequest request)
    {
        if (request == null || string.IsNullOrWhiteSpace(request.SessionToken))
        {
            return BadRequest(new { error = "Session token is required." });
        }

        if (!_sessionRepository.InvalidateSession(request.SessionToken))
        {
            return NotFound(new { error = "Session not found or already expired." });
        }

        return NoContent();
    }
}

public record RegisterRequest(string Email, string DisplayName, string Password);
public record LoginRequest(string Email, string Password);
public record LogoutRequest(string SessionToken);
public record AuthResponse(string UserId, string Email, string DisplayName, bool IsLocal, string SessionToken, DateTime ExpiresAt);

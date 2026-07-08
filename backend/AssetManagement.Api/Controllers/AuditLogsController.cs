using AssetManagement.Api.Models;
using AssetManagement.Api.Services;
using Microsoft.AspNetCore.Mvc;

namespace AssetManagement.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuditLogsController : ControllerBase
{
    private readonly IAuditLogRepository _auditLogRepository;

    public AuditLogsController(IAuditLogRepository auditLogRepository)
    {
        _auditLogRepository = auditLogRepository;
    }

    [HttpGet]
    public IActionResult GetAll()
    {
        var logs = _auditLogRepository.GetAll();
        return Ok(logs);
    }

    [HttpGet("user/{userId}")]
    public IActionResult GetByUserId(string userId)
    {
        var logs = _auditLogRepository.GetByUserId(userId);
        return Ok(logs);
    }

    [HttpGet("entity/{entityType}/{entityId}")]
    public IActionResult GetByEntity(string entityType, string entityId)
    {
        var logs = _auditLogRepository.GetByEntity(entityType, entityId);
        return Ok(logs);
    }
}

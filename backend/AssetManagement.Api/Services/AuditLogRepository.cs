using AssetManagement.Api.Models;

namespace AssetManagement.Api.Services;

public interface IAuditLogRepository
{
    void Log(string userId, string action, string entityType, string entityId, string details, string? oldValue = null, string? newValue = null);
    IEnumerable<AuditLog> GetByUserId(string userId);
    IEnumerable<AuditLog> GetByEntity(string entityType, string entityId);
    IEnumerable<AuditLog> GetAll();
}

public class InMemoryAuditLogRepository : IAuditLogRepository
{
    private readonly List<AuditLog> _logs = new();

    public void Log(string userId, string action, string entityType, string entityId, string details, string? oldValue = null, string? newValue = null)
    {
        var log = new AuditLog
        {
            UserId = userId,
            Action = action,
            EntityType = entityType,
            EntityId = entityId,
            Details = details,
            OldValue = oldValue ?? string.Empty,
            NewValue = newValue ?? string.Empty,
            IpAddress = "0.0.0.0"
        };
        _logs.Add(log);
    }

    public IEnumerable<AuditLog> GetByUserId(string userId) => _logs.Where(l => l.UserId == userId).OrderByDescending(l => l.CreatedAt);

    public IEnumerable<AuditLog> GetByEntity(string entityType, string entityId) =>
        _logs.Where(l => l.EntityType == entityType && l.EntityId == entityId).OrderByDescending(l => l.CreatedAt);

    public IEnumerable<AuditLog> GetAll() => _logs.OrderByDescending(l => l.CreatedAt);
}

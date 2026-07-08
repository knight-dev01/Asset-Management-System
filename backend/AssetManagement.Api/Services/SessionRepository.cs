using AssetManagement.Api.Models;
using System.Collections.Concurrent;

namespace AssetManagement.Api.Services;

public interface ISessionRepository
{
    UserSession CreateSession(User user);
    bool TryGetSession(string sessionToken, out UserSession? session);
    bool InvalidateSession(string sessionToken);
}

public class InMemorySessionRepository : ISessionRepository
{
    private static readonly ConcurrentDictionary<string, UserSession> Sessions = new();

    public UserSession CreateSession(User user)
    {
        var token = Guid.NewGuid().ToString("N");
        var session = new UserSession
        {
            SessionToken = token,
            UserId = user.UserId,
            Email = user.Email,
            DisplayName = user.DisplayName,
            IsLocal = true,
            CreatedAt = DateTime.UtcNow,
            ExpiresAt = DateTime.UtcNow.AddHours(8)
        };

        Sessions[session.SessionToken] = session;
        return session;
    }

    public bool TryGetSession(string sessionToken, out UserSession? session)
    {
        if (string.IsNullOrWhiteSpace(sessionToken))
        {
            session = null;
            return false;
        }

        if (Sessions.TryGetValue(sessionToken, out session) && session != null)
        {
            if (session.ExpiresAt > DateTime.UtcNow)
            {
                return true;
            }

            Sessions.TryRemove(sessionToken, out _);
            session = null;
        }

        return false;
    }

    public bool InvalidateSession(string sessionToken)
    {
        if (string.IsNullOrWhiteSpace(sessionToken)) return false;
        return Sessions.TryRemove(sessionToken, out _);
    }
}

using AssetManagement.Api.Models;
using System.Collections.Concurrent;
using System.Security.Cryptography;
using System.Text;

namespace AssetManagement.Api.Services;

public interface IUserRepository
{
    User? GetByEmail(string email);
    User? GetById(string userId);
    User Create(string email, string displayName, string password);
    bool ValidatePassword(string email, string password, out User? user);
}

public class InMemoryUserRepository : IUserRepository
{
    private static readonly ConcurrentDictionary<string, User> Users = new();

    public User? GetByEmail(string email)
    {
        return Users.Values.FirstOrDefault(u => u.Email.Equals(email, StringComparison.OrdinalIgnoreCase));
    }

    public User? GetById(string userId)
    {
        Users.TryGetValue(userId, out var user);
        return user;
    }

    public User Create(string email, string displayName, string password)
    {
        if (GetByEmail(email) != null)
        {
            throw new InvalidOperationException("A user with this email already exists.");
        }

        var salt = RandomNumberGenerator.GetBytes(16);
        var hash = DerivePasswordHash(password, salt);

        var user = new User
        {
            UserId = Guid.NewGuid().ToString(),
            Email = email,
            DisplayName = displayName,
            PasswordSalt = Convert.ToBase64String(salt),
            PasswordHash = Convert.ToBase64String(hash)
        };

        Users[user.UserId] = user;
        return user;
    }

    public bool ValidatePassword(string email, string password, out User? user)
    {
        user = GetByEmail(email);
        if (user == null)
        {
            return false;
        }

        var salt = Convert.FromBase64String(user.PasswordSalt);
        var expectedHash = DerivePasswordHash(password, salt);
        var actualHash = Convert.FromBase64String(user.PasswordHash);
        return CryptographicOperations.FixedTimeEquals(expectedHash, actualHash);
    }

    private static byte[] DerivePasswordHash(string password, byte[] salt)
    {
        return Rfc2898DeriveBytes.Pbkdf2(
            Encoding.UTF8.GetBytes(password),
            salt,
            100_000,
            HashAlgorithmName.SHA256,
            32);
    }
}

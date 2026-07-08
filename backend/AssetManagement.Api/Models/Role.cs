namespace AssetManagement.Api.Models;

public enum UserRole
{
    Admin,
    Manager,
    User,
    Viewer
}

public class RolePermission
{
    public string Id { get; set; } = string.Empty;
    public UserRole Role { get; set; }
    public string Permission { get; set; } = string.Empty;
}

public class UserWithRole : User
{
    public UserRole Role { get; set; } = UserRole.User;
}

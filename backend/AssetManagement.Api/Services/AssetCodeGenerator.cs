namespace AssetManagement.Api.Services;

public static class AssetCodeGenerator
{
    private static readonly Dictionary<string, string> CategoryPrefixes = new()
    {
        { "IT Equipment", "IT" },
        { "Furniture & Fixtures", "FF" },
        { "Vehicles", "VH" },
        { "Machinery & Tools", "MT" },
        { "Office Supplies", "OS" },
        { "Facilities & Security", "FS" },
        { "Software Licenses", "SL" },
        { "Other", "OT" }
    };

    public static string GenerateAssetCode(string category)
    {
        var prefix = CategoryPrefixes.TryGetValue(category, out var value) ? value : "GEN";
        var year = DateTime.UtcNow.Year;
        var randomValue = Random.Shared.Next(1000, 9999);
        return $"AST-{prefix}-{year}-{randomValue}";
    }
}

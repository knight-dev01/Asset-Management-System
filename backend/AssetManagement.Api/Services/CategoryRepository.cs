using AssetManagement.Api.Models;

namespace AssetManagement.Api.Services;

public interface ICategoryRepository
{
    AssetCategory Create(string name, string description, string icon);
    IEnumerable<AssetCategory> GetAll();
    AssetCategory? GetById(string id);
    void Update(AssetCategory category);
    void Delete(string id);
}

public class InMemoryCategoryRepository : ICategoryRepository
{
    private readonly List<AssetCategory> _categories = new();

    public InMemoryCategoryRepository()
    {
        // Seed default categories
        _categories.AddRange(new[]
        {
            new AssetCategory { Id = Guid.NewGuid().ToString(), Name = "Computers", Description = "Desktops and Laptops", Icon = "💻" },
            new AssetCategory { Id = Guid.NewGuid().ToString(), Name = "Furniture", Description = "Office Furniture", Icon = "🪑" },
            new AssetCategory { Id = Guid.NewGuid().ToString(), Name = "Equipment", Description = "General Equipment", Icon = "🔧" },
            new AssetCategory { Id = Guid.NewGuid().ToString(), Name = "Vehicles", Description = "Company Vehicles", Icon = "🚗" },
            new AssetCategory { Id = Guid.NewGuid().ToString(), Name = "Other", Description = "Other Assets", Icon = "📦" }
        });
    }

    public AssetCategory Create(string name, string description, string icon)
    {
        var category = new AssetCategory { Name = name, Description = description, Icon = icon };
        _categories.Add(category);
        return category;
    }

    public IEnumerable<AssetCategory> GetAll() => _categories;

    public AssetCategory? GetById(string id) => _categories.FirstOrDefault(c => c.Id == id);

    public void Update(AssetCategory category)
    {
        var existing = GetById(category.Id);
        if (existing != null)
        {
            existing.Name = category.Name;
            existing.Description = category.Description;
            existing.Icon = category.Icon;
        }
    }

    public void Delete(string id) => _categories.RemoveAll(c => c.Id == id);
}

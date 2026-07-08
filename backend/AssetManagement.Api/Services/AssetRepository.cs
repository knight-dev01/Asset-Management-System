using AssetManagement.Api.Models;
using System.Collections.Concurrent;

namespace AssetManagement.Api.Services;

public interface IAssetRepository
{
    IEnumerable<Asset> GetAll(string createdBy);
    Asset? GetById(string id, string createdBy);
    Asset Create(Asset asset);
    Asset Update(string id, Asset asset, string createdBy);
    bool Delete(string id, string createdBy);
}

public class InMemoryAssetRepository : IAssetRepository
{
    private static readonly ConcurrentDictionary<string, Asset> Assets = new();

    public IEnumerable<Asset> GetAll(string createdBy)
    {
        return Assets.Values.Where(a => a.CreatedBy == createdBy).OrderByDescending(a => a.CreatedAt);
    }

    public Asset? GetById(string id, string createdBy)
    {
        if (Assets.TryGetValue(id, out var asset) && asset.CreatedBy == createdBy)
        {
            return asset;
        }
        return null;
    }

    public Asset Create(Asset asset)
    {
        asset.Id = Guid.NewGuid().ToString();
        asset.CreatedAt = DateTime.UtcNow;
        asset.UpdatedAt = DateTime.UtcNow;
        asset.BarcodeSvg = AssetBarcode.GenerateSvg(asset.AssetCode);
        asset.BarcodeFileName = $"{asset.AssetCode}.svg";
        Assets[asset.Id] = asset;
        return asset;
    }

    public Asset Update(string id, Asset asset, string createdBy)
    {
        var existing = GetById(id, createdBy);
        if (existing == null)
        {
            throw new KeyNotFoundException("Asset not found.");
        }

        existing.AssetName = asset.AssetName;
        existing.Category = asset.Category;
        existing.Brand = asset.Brand;
        existing.Model = asset.Model;
        existing.SerialNumber = asset.SerialNumber;
        existing.PurchaseDate = asset.PurchaseDate;
        existing.PurchaseCost = asset.PurchaseCost;
        existing.Department = asset.Department;
        existing.Location = asset.Location;
        existing.Status = asset.Status;
        existing.Description = asset.Description;
        existing.UpdatedAt = DateTime.UtcNow;
        return existing;
    }

    public bool Delete(string id, string createdBy)
    {
        var asset = GetById(id, createdBy);
        if (asset == null)
        {
            return false;
        }

        return Assets.TryRemove(id, out _);
    }
}

using AssetManagement.Api.Models;
using AssetManagement.Api.Services;
using Microsoft.AspNetCore.Mvc;

namespace AssetManagement.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AssetsController : ControllerBase
{
    private readonly IAssetRepository _repository;

    public AssetsController(IAssetRepository repository)
    {
        _repository = repository;
    }

    [HttpGet]
    public IActionResult GetAll([FromQuery] string createdBy)
    {
        if (string.IsNullOrWhiteSpace(createdBy))
        {
            return BadRequest(new { error = "createdBy query parameter is required." });
        }

        var assets = _repository.GetAll(createdBy);
        return Ok(assets);
    }

    [HttpGet("{id}")]
    public IActionResult GetById(string id, [FromQuery] string createdBy)
    {
        var asset = _repository.GetById(id, createdBy);
        if (asset == null) return NotFound();
        return Ok(asset);
    }

    [HttpPost]
    public IActionResult Create([FromBody] Asset asset)
    {
        if (asset == null) return BadRequest();
        if (string.IsNullOrWhiteSpace(asset.CreatedBy)) return BadRequest(new { error = "CreatedBy is required." });

        asset.AssetCode = AssetCodeGenerator.GenerateAssetCode(asset.Category);
        asset.BarcodeSvg = AssetBarcode.GenerateSvg(asset.AssetCode);
        asset.BarcodeFileName = $"{asset.AssetCode}.svg";

        var created = _repository.Create(asset);
        return CreatedAtAction(nameof(GetById), new { id = created.Id, createdBy = created.CreatedBy }, created);
    }

    [HttpPut("{id}")]
    public IActionResult Update(string id, [FromQuery] string createdBy, [FromBody] Asset asset)
    {
        if (string.IsNullOrWhiteSpace(createdBy)) return BadRequest(new { error = "createdBy query parameter is required." });
        if (asset == null) return BadRequest();

        try
        {
            var updated = _repository.Update(id, asset, createdBy);
            return Ok(updated);
        }
        catch (KeyNotFoundException)
        {
            return NotFound();
        }
    }

    [HttpDelete("{id}")]
    public IActionResult Delete(string id, [FromQuery] string createdBy)
    {
        if (string.IsNullOrWhiteSpace(createdBy)) return BadRequest(new { error = "createdBy query parameter is required." });

        if (!_repository.Delete(id, createdBy))
        {
            return NotFound();
        }

        return NoContent();
    }
}

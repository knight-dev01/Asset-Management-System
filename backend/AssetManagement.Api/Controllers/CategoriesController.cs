using AssetManagement.Api.Models;
using AssetManagement.Api.Services;
using Microsoft.AspNetCore.Mvc;

namespace AssetManagement.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CategoriesController : ControllerBase
{
    private readonly ICategoryRepository _categoryRepository;

    public CategoriesController(ICategoryRepository categoryRepository)
    {
        _categoryRepository = categoryRepository;
    }

    [HttpGet]
    public IActionResult GetAll()
    {
        var categories = _categoryRepository.GetAll();
        return Ok(categories);
    }

    [HttpGet("{id}")]
    public IActionResult GetById(string id)
    {
        var category = _categoryRepository.GetById(id);
        if (category == null)
            return NotFound(new { error = "Category not found" });

        return Ok(category);
    }

    [HttpPost]
    public IActionResult Create([FromBody] CreateCategoryRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.Name))
            return BadRequest(new { error = "Name is required" });

        var category = _categoryRepository.Create(request.Name, request.Description ?? "", request.Icon ?? "📦");
        return CreatedAtAction(nameof(GetById), new { id = category.Id }, category);
    }

    [HttpPut("{id}")]
    public IActionResult Update(string id, [FromBody] UpdateCategoryRequest request)
    {
        var category = _categoryRepository.GetById(id);
        if (category == null)
            return NotFound(new { error = "Category not found" });

        category.Name = request.Name ?? category.Name;
        category.Description = request.Description ?? category.Description;
        category.Icon = request.Icon ?? category.Icon;

        _categoryRepository.Update(category);
        return Ok(category);
    }

    [HttpDelete("{id}")]
    public IActionResult Delete(string id)
    {
        var category = _categoryRepository.GetById(id);
        if (category == null)
            return NotFound(new { error = "Category not found" });

        _categoryRepository.Delete(id);
        return NoContent();
    }
}

public record CreateCategoryRequest(string Name, string? Description, string? Icon);
public record UpdateCategoryRequest(string? Name, string? Description, string? Icon);

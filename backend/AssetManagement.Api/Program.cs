var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddOpenApi();
builder.Services.AddSingleton<AssetManagement.Api.Services.IAssetRepository, AssetManagement.Api.Services.InMemoryAssetRepository>();
builder.Services.AddSingleton<AssetManagement.Api.Services.IUserRepository, AssetManagement.Api.Services.InMemoryUserRepository>();
builder.Services.AddSingleton<AssetManagement.Api.Services.ISessionRepository, AssetManagement.Api.Services.InMemorySessionRepository>();

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseDeveloperExceptionPage();
    app.MapOpenApi();
}

app.UseStaticFiles();
app.UseCors("AllowAll");
app.UseHttpsRedirection();
app.UseAuthorization();
app.MapControllers();

app.Run();

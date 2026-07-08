# Asset Management System

A clean Flutter frontend with a C#.NET backend for barcode-enabled asset management.

## 🚀 Live Demo

- **Frontend**: https://knight-dev01.github.io/Asset-Management-System/
- **Backend API**: https://asset-management-system-api.onrender.com/api

## Repository Structure

- `backend/AssetManagement.Api` - .NET Web API project
- `flutter_app` - Flutter frontend application with web and Linux support
- `AssetManagement.slnx` - root .NET solution file

## Quick Start

### Prerequisites
- Flutter 3.44.5+
- .NET SDK 10.0+
- Git

### Running Locally

**Terminal 1 - Backend (.NET API)**
```bash
cd backend/AssetManagement.Api
dotnet restore
dotnet run
# Listens on http://localhost:5238
```

**Terminal 2 - Frontend (Flutter)**
```bash
cd flutter_app
flutter pub get
flutter build web --release --dart-define=ASSET_API_URL=http://localhost:5238/api
```

**Terminal 3 - Web Server**
```bash
cd flutter_app/build/web
python3 -m http.server 8080
# Open http://localhost:8080
```

## Deployment

### Automated Deployment
Every push to `main` automatically:
1. ✅ Builds Flutter frontend → GitHub Pages
2. ✅ Builds .NET backend → Render

See `.github/workflows/flutter_dotnet_deploy.yml`

### Current Deployment
- **Frontend**: GitHub Pages (auto-deployed on push)
- **Backend**: Render (free tier, auto-deployed on push)

## Features

- ✅ User authentication (register/login)
- ✅ Session management
- ✅ Asset CRUD operations
- ✅ In-memory data storage
- ✅ Cross-platform (web, Linux)
- ✅ CORS-enabled API

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Flutter / Dart |
| Backend | .NET 10.0 / C# / ASP.NET Core |
| Database | In-memory (upgradable) |
| Deployment | GitHub Pages / Render |
| CI/CD | GitHub Actions |

## Testing API

```bash
# Register
curl -X POST http://localhost:5238/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","displayName":"Test","password":"pass123"}'

# Login
curl -X POST http://localhost:5238/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"pass123"}'
```

## Contributing

Want to contribute? See [CONTRIBUTING.md](CONTRIBUTING.md) for:
- Setup instructions
- Development workflow
- Code structure
- API documentation
- Deployment guidelines

## Notes

- The repository is focused on Flutter (web/Linux) and C#/.NET
- Backend uses an in-memory asset repository for prototyping
- Ready for database upgrade (PostgreSQL/SQL Server)
- Barcode functionality can be extended
- Print support available via Flutter plugins

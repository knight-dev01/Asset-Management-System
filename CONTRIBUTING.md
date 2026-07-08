# Contributing to Asset Management System

Thank you for your interest in contributing! This guide will help you set up the project and start developing.

## Prerequisites

### Required
- **Git** - Version control
- **Flutter** - 3.44.5 or later (for frontend)
- **.NET SDK** - 10.0 or later (for backend)
- **Node.js** - 18+ (for build tools, optional)

### Optional
- **Docker** - For containerized backend testing
- **VS Code** - Recommended editor
- **Postman** - For API testing

## Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/knight-dev01/Asset-Management-System.git
cd Asset-Management-System
```

### 2. Backend Setup (.NET API)

```bash
cd backend/AssetManagement.Api

# Restore NuGet packages
dotnet restore

# Build the project
dotnet build

# Run the development server (listens on http://localhost:5238)
dotnet run
```

**Backend URL**: `http://localhost:5238/api`

### 3. Frontend Setup (Flutter)

In a new terminal:

```bash
cd flutter_app

# Get dependencies
flutter pub get

# Build web version
flutter build web --release --dart-define=ASSET_API_URL=http://localhost:5238/api

# Or run in development mode
flutter run -d chrome
```

**Frontend URL**: `http://localhost:8080` (if using local server)

### 4. Serve Frontend Locally

In another terminal:

```bash
cd flutter_app/build/web
python3 -m http.server 8080
```

Then open: **http://localhost:8080**

## Project Structure

```
Asset-Management-System/
├── backend/
│   └── AssetManagement.Api/
│       ├── Controllers/          # API endpoints
│       ├── Models/               # Data models
│       ├── Services/             # Business logic
│       └── Program.cs            # Startup configuration
├── flutter_app/
│   ├── lib/
│   │   ├── main.dart            # App entry point
│   │   ├── screens/             # UI screens
│   │   ├── models.dart          # Data models
│   │   └── api_service.dart     # API client
│   └── pubspec.yaml             # Dependencies
└── .github/workflows/
    └── flutter_dotnet_deploy.yml # CI/CD pipeline
```

## API Endpoints

### Authentication

- **POST** `/api/auth/register` - Create account
  ```json
  {
    "email": "user@example.com",
    "displayName": "User Name",
    "password": "password123"
  }
  ```

- **POST** `/api/auth/login` - Login
  ```json
  {
    "email": "user@example.com",
    "password": "password123"
  }
  ```

- **POST** `/api/auth/logout` - Logout
  ```json
  {
    "sessionToken": "token_here"
  }
  ```

## Development Workflow

### Making Changes

1. **Create a branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes** - Edit code in `backend/` or `flutter_app/`

3. **Test locally** - Ensure both backend and frontend run without errors

4. **Commit changes**
   ```bash
   git add .
   git commit -m "Add: brief description of changes"
   ```

5. **Push to GitHub**
   ```bash
   git push origin feature/your-feature-name
   ```

6. **Create a Pull Request** on GitHub

### Commit Message Format

Use clear, descriptive commit messages:
- `Add: New feature description`
- `Fix: Bug fix description`
- `Update: Documentation or dependencies`
- `Refactor: Code restructuring`

## Testing

### Backend
```bash
cd backend/AssetManagement.Api
dotnet test
```

### Frontend
```bash
cd flutter_app
flutter test
```

### API Testing
Use Postman or curl:
```bash
# Test register endpoint
curl -X POST http://localhost:5238/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","displayName":"Test","password":"pass123"}'
```

## Deployment

### GitHub Pages (Frontend)
- Automatically deploys on push to `main` via GitHub Actions
- URL: `https://knight-dev01.github.io/Asset-Management-System/`

### Render (Backend)
- Automatically deploys on push to `main`
- URL: `https://asset-management-system-api.onrender.com/api`

## Environment Variables

### Backend (Production)
- `ASPNETCORE_ENVIRONMENT=Production`
- `ASPNETCORE_URLS=http://+:8080`

### Frontend (Build Time)
```bash
flutter build web --dart-define=ASSET_API_URL=https://your-api-url/api
```

## Troubleshooting

### Backend won't start
```bash
# Clear build artifacts
dotnet clean
dotnet restore
dotnet run
```

### Flutter won't build
```bash
flutter clean
flutter pub get
flutter build web --release
```

### API Connection Issues
- Ensure backend is running: `http://localhost:5238`
- Check CORS settings in `Program.cs`
- Verify API URL in Flutter app matches backend URL

### Port Already in Use
```bash
# Find process using port 5238 (backend)
lsof -i :5238
kill -9 <PID>

# Find process using port 8080 (frontend)
lsof -i :8080
kill -9 <PID>
```

## Key Technologies

- **Frontend**: Flutter, Dart
- **Backend**: .NET 10.0, C#, ASP.NET Core
- **Database**: In-memory (can be upgraded to SQL/PostgreSQL)
- **Deployment**: GitHub Pages (frontend), Render (backend)
- **CI/CD**: GitHub Actions

## Current Features

- ✅ User authentication (register/login)
- ✅ Session management
- ✅ Asset CRUD operations
- ✅ Barcode support (preparation)
- ✅ Cross-platform (web, Linux)

## Future Enhancements

- [ ] Add database persistence (PostgreSQL)
- [ ] Implement barcode scanning
- [ ] Add print functionality
- [ ] Mobile app (iOS/Android)
- [ ] User roles and permissions
- [ ] Asset categories
- [ ] Audit logging

## Questions?

Open an **Issue** on GitHub or check existing documentation in the repo.

## Code of Conduct

- Be respectful and constructive
- Follow the existing code style
- Test your changes before submitting
- Write clear commit messages

Happy contributing! 🚀

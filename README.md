# Asset Management System

A clean Flutter frontend with a C#.NET backend for barcode-enabled asset management.

## Repository Structure

- `backend/AssetManagement.Api` - .NET Web API project
- `flutter_app` - Flutter frontend application with web and Linux support
- `AssetManagement.slnx` - root .NET solution file

## Running Locally

### Flutter frontend

```bash
cd flutter_app
flutter pub get
flutter build web --release
```

### .NET backend

```bash
cd backend/AssetManagement.Api
dotnet build
```

## Deployment

This repo is prepared for GitHub Pages web deployment from the Flutter web build output.

> Workflow fix committed and workflow retry pending.

## Notes

- The repository is now focused on Flutter and C#/.NET.
- The backend currently uses an in-memory asset repository for prototyping.
- The Flutter app is configured for web deployment and can be extended with authentication, asset CRUD, barcode display, and printing.

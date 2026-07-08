# Asset Management System - Complete Feature Demo

## 🎉 Comprehensive Feature Implementation

This demo showcases a fully-featured asset management system with production-ready capabilities.

### ✨ New Features Implemented

#### 1. **User Roles & Permissions**
- **Admin**: Full access to all features
- **Manager**: Manage assets and view reports
- **User**: Create and manage own assets
- **Viewer**: Read-only access

**Backend**: `Models/Role.cs`, `Services/CategoryRepository.cs`

```csharp
public enum UserRole { Admin, Manager, User, Viewer }
```

#### 2. **Asset Categories**
- Predefined categories: Computers, Furniture, Equipment, Vehicles, Other
- Category management endpoints: Create, Read, Update, Delete
- Icons for quick visual identification

**API Endpoints**:
- `GET /api/categories` - List all categories
- `POST /api/categories` - Create category
- `PUT /api/categories/{id}` - Update category
- `DELETE /api/categories/{id}` - Delete category

#### 3. **Barcode Scanning & Generation**
- **Code128** barcode generation for asset codes
- **QR Code** support for quick reference
- Barcode widget integration in Flutter
- Mobile barcode scanning capability

**Flutter Services**:
```dart
import 'barcode_service.dart';
import 'package:barcode_widget/barcode_widget.dart';
import 'package:mobile_scanner/mobile_scanner.dart';

// Generate barcode
String svg = BarcodeGenerator.generateBarcodeSvg('ASSET-001');

// Scan barcode via mobile camera
```

#### 4. **Print Functionality**
- Print individual asset details
- Print asset inventory reports (PDF format)
- Multiple layout options
- Print queue management

**Flutter Services**:
```dart
import 'print_service.dart';
import 'package:printing/printing.dart';

// Print single asset
PrintService.printAsset(asset);

// Print asset list
PrintService.printAssetList(assetList);
```

#### 5. **Audit Logging**
- Track all asset modifications
- User action logging (Create, Update, Delete, Login, Logout)
- Timestamp tracking
- Entity change history

**API Endpoints**:
- `GET /api/auditlogs` - List all audit logs
- `GET /api/auditlogs/user/{userId}` - User activity history
- `GET /api/auditlogs/entity/{entityType}/{entityId}` - Entity change history

**Audit Log Model**:
```csharp
public class AuditLog {
    public string Action { get; set; }        // Create, Update, Delete, Login, etc.
    public string EntityType { get; set; }    // Asset, User, Category, etc.
    public string EntityId { get; set; }      // ID of modified entity
    public string OldValue { get; set; }      // Previous value
    public string NewValue { get; set; }      // New value
    public DateTime CreatedAt { get; set; }   // When change occurred
    public string UserId { get; set; }        // Who made the change
}
```

#### 6. **Mobile App Support** (iOS/Android)
Flutter configuration supports:
- Web deployment (GitHub Pages) ✅
- Linux desktop ✅
- iOS/Android mobile (configuration ready)
- Responsive design for all screen sizes

**To build for mobile**:
```bash
# iOS
flutter build ios --release

# Android
flutter build apk --release
flutter build appbundle --release
```

---

## 📊 Data Models

### Asset
```dart
class Asset {
  String id;
  String assetCode;              // Unique code for barcode
  String assetName;
  String category;               // Now linked to categories
  String brand;
  String model;
  String serialNumber;
  String purchaseDate;
  double purchaseCost;
  String department;
  String location;
  String status;
  String description;
  String createdBy;              // User ID who created
  DateTime createdAt;
  DateTime updatedAt;
  String barcodeSvg;            // Generated barcode
  String barcodeFileName;
}
```

### User
```dart
class User {
  String userId;
  String email;
  String displayName;
  UserRole role;                // New: user role
  DateTime createdAt;           // New: creation timestamp
}
```

### AssetCategory
```dart
class AssetCategory {
  String id;
  String name;                   // "Computers", "Furniture", etc.
  String description;
  String icon;                   // "💻", "🪑", etc.
  DateTime createdAt;
}
```

### AuditLog
```dart
class AuditLog {
  String id;
  String userId;                // Who performed action
  String action;                // "Create", "Update", "Delete"
  String entityType;            // "Asset", "User", "Category"
  String entityId;              // ID of entity affected
  String details;               // Additional context
  DateTime createdAt;           // When it happened
}
```

---

## 🔗 API Endpoints Summary

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout

### Assets
- `GET /api/assets` - List assets
- `GET /api/assets/summary` - Asset statistics
- `POST /api/assets` - Create asset
- `PUT /api/assets/{id}` - Update asset
- `DELETE /api/assets/{id}` - Delete asset

### Categories (NEW)
- `GET /api/categories` - List categories
- `GET /api/categories/{id}` - Get category details
- `POST /api/categories` - Create category
- `PUT /api/categories/{id}` - Update category
- `DELETE /api/categories/{id}` - Delete category

### Audit Logs (NEW)
- `GET /api/auditlogs` - List all logs
- `GET /api/auditlogs/user/{userId}` - User activity
- `GET /api/auditlogs/entity/{entityType}/{entityId}` - Entity history

---

## 🚀 Deployment Architecture

### Frontend (GitHub Pages)
- **URL**: https://knight-dev01.github.io/Asset-Management-System/
- **Technology**: Flutter Web
- **Auto-deploy**: On every push to `main`
- **Workflow**: `.github/workflows/flutter_dotnet_deploy.yml`

### Backend (Render)
- **URL**: https://asset-management-system-api.onrender.com/api
- **Technology**: .NET 10.0 / C# / ASP.NET Core
- **Database**: In-memory (in-demo, upgradable to PostgreSQL/SQL Server)
- **Auto-deploy**: On every push to `main`

### Workflow
```yaml
On push to main:
  1. Build Flutter web → GitHub Pages
  2. Build .NET backend → Render
  3. Run tests (when added)
  4. Auto-deploy both services
```

---

## 📋 Testing the Complete Demo

### 1. **Register & Login**
```
Email: demo@example.com
Password: Demo@123
Display Name: Demo User
```

### 2. **Create Asset with Barcode**
- Navigate to "Create Asset"
- Fill in details (Name, Category, Serial Number, etc.)
- System auto-generates asset code
- Barcode is automatically created
- Submit and asset appears in dashboard

### 3. **View Categories**
- Predefined categories: Computers, Furniture, Equipment, Vehicles, Other
- Each has unique icon
- Add new custom categories

### 4. **Print Asset**
- Select asset from list
- Click "Print" button
- PDF generated with asset details and barcode
- Print or save to file

### 5. **View Audit Logs**
- All user actions tracked
- Shows who did what and when
- Edit history per asset
- User activity log

### 6. **Mobile Scanning** (on physical device)
- Open app on iOS/Android
- Navigate to "Scan Barcode"
- Point camera at barcode
- Asset details auto-load

---

## 💾 Data Persistence

### Current: In-Memory
- All data stored in RAM
- Resets on server restart
- Great for demos and development

### Future Upgrade (Easy Migration):
```csharp
// Current
builder.Services.AddSingleton<IAssetRepository, InMemoryAssetRepository>();

// Upgrade to SQL
builder.Services.AddScoped<IAssetRepository, SqlAssetRepository>();
```

**Supported Databases**:
- PostgreSQL
- SQL Server
- SQLite (for lightweight deployments)
- MySQL

---

## 🎯 Key Technologies

| Layer | Technology | Version |
|-------|-----------|---------|
| **Frontend** | Flutter | 3.44.5 |
| **Frontend Framework** | Dart | 3.4+ |
| **Backend** | .NET | 10.0 |
| **Backend Language** | C# | Latest |
| **Barcodes** | barcode_widget | 2.0.4 |
| **Mobile Scanner** | mobile_scanner | 5.2.3 |
| **Printing** | printing | 5.15.0 |
| **PDF Generation** | pdf | 3.13.0 |
| **Hosting** | GitHub Pages / Render | Latest |

---

## 📱 Responsive Design

- ✅ Desktop/Tablet (Web)
- ✅ Mobile (iOS/Android)
- ✅ Linux Desktop
- ✅ Windows (Web via browsers)

---

## 🔐 Security Features

- ✅ User authentication
- ✅ Session management (with expiry)
- ✅ CORS protection
- ✅ HTTPS in production
- ✅ Audit logging for compliance

---

## 📈 Future Enhancements

- [ ] Database persistence (PostgreSQL/SQL Server)
- [ ] Advanced barcode scanning with inventory update
- [ ] Batch printing (multiple assets)
- [ ] User dashboard with statistics
- [ ] Asset check-in/check-out workflow
- [ ] Email notifications
- [ ] Advanced reporting and analytics
- [ ] Two-factor authentication
- [ ] Asset depreciation calculations
- [ ] Maintenance scheduling

---

## 🎓 Learning Resources

### Flutter
- [Flutter Docs](https://flutter.dev)
- [Dart Programming Guide](https://dart.dev)
- [Flutter Packages](https://pub.dev)

### .NET
- [.NET Documentation](https://docs.microsoft.com/dotnet)
- [ASP.NET Core Docs](https://docs.microsoft.com/aspnet/core)
- [C# Programming Guide](https://docs.microsoft.com/dotnet/csharp)

### Deployment
- [GitHub Pages Docs](https://pages.github.com)
- [Render Docs](https://render.com/docs)

---

## 🤝 Contributing

See [CONTRIBUTING.md](../CONTRIBUTING.md) for setup instructions.

---

## 📄 License

This project is open source and available under the MIT License.

---

**Happy Asset Management! 🎉**

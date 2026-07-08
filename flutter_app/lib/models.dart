class AuthResponse {
  final String userId;
  final String email;
  final String displayName;
  final bool isLocal;
  final String sessionToken;
  final DateTime expiresAt;

  AuthResponse({
    required this.userId,
    required this.email,
    required this.displayName,
    required this.isLocal,
    required this.sessionToken,
    required this.expiresAt,
  });

  factory AuthResponse.fromJson(Map<String, dynamic> json) {
    return AuthResponse(
      userId: json['userId'] as String,
      email: json['email'] as String,
      displayName: json['displayName'] as String,
      isLocal: json['isLocal'] as bool,
      sessionToken: json['sessionToken'] as String,
      expiresAt: DateTime.parse(json['expiresAt'] as String),
    );
  }
}

class Asset {
  String id;
  String assetCode;
  String assetName;
  String category;
  String brand;
  String model;
  String serialNumber;
  String purchaseDate;
  double purchaseCost;
  String department;
  String location;
  String status;
  String description;
  String createdBy;
  DateTime createdAt;
  DateTime updatedAt;
  String barcodeSvg;
  String barcodeFileName;

  Asset({
    this.id = '',
    this.assetCode = '',
    this.assetName = '',
    this.category = '',
    this.brand = '',
    this.model = '',
    this.serialNumber = '',
    this.purchaseDate = '',
    this.purchaseCost = 0.0,
    this.department = '',
    this.location = '',
    this.status = 'Active',
    this.description = '',
    this.createdBy = '',
    DateTime? createdAt,
    DateTime? updatedAt,
    this.barcodeSvg = '',
    this.barcodeFileName = '',
  })  : createdAt = createdAt ?? DateTime.now(),
        updatedAt = updatedAt ?? DateTime.now();

  factory Asset.fromJson(Map<String, dynamic> json) {
    return Asset(
      id: json['id'] as String? ?? '',
      assetCode: json['assetCode'] as String? ?? '',
      assetName: json['assetName'] as String? ?? '',
      category: json['category'] as String? ?? '',
      brand: json['brand'] as String? ?? '',
      model: json['model'] as String? ?? '',
      serialNumber: json['serialNumber'] as String? ?? '',
      purchaseDate: json['purchaseDate'] as String? ?? '',
      purchaseCost: (json['purchaseCost'] is num)
          ? (json['purchaseCost'] as num).toDouble()
          : double.tryParse(json['purchaseCost']?.toString() ?? '0') ?? 0.0,
      department: json['department'] as String? ?? '',
      location: json['location'] as String? ?? '',
      status: json['status'] as String? ?? 'Active',
      description: json['description'] as String? ?? '',
      createdBy: json['createdBy'] as String? ?? '',
      createdAt: json['createdAt'] != null
          ? DateTime.parse(json['createdAt'] as String)
          : DateTime.now(),
      updatedAt: json['updatedAt'] != null
          ? DateTime.parse(json['updatedAt'] as String)
          : DateTime.now(),
      barcodeSvg: json['barcodeSvg'] as String? ?? '',
      barcodeFileName: json['barcodeFileName'] as String? ?? '',
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'assetCode': assetCode,
      'assetName': assetName,
      'category': category,
      'brand': brand,
      'model': model,
      'serialNumber': serialNumber,
      'purchaseDate': purchaseDate,
      'purchaseCost': purchaseCost,
      'department': department,
      'location': location,
      'status': status,
      'description': description,
      'createdBy': createdBy,
      'createdAt': createdAt.toIso8601String(),
      'updatedAt': updatedAt.toIso8601String(),
      'barcodeSvg': barcodeSvg,
      'barcodeFileName': barcodeFileName,
    };
  }
}

class AssetSummary {
  final int totalAssets;
  final int totalCategories;
  final List<Asset> recentAssets;

  AssetSummary({
    required this.totalAssets,
    required this.totalCategories,
    required this.recentAssets,
  });

  factory AssetSummary.fromJson(Map<String, dynamic> json) {
    return AssetSummary(
      totalAssets: json['totalAssets'] as int,
      totalCategories: json['totalCategories'] as int,
      recentAssets: (json['recentAssets'] as List<dynamic>?)
              ?.map((item) => Asset.fromJson(item as Map<String, dynamic>))
              .toList() ??
          [],
    );
  }
}

enum UserRole { admin, manager, user, viewer }

class AssetCategory {
  final String id;
  final String name;
  final String description;
  final String icon;
  final DateTime createdAt;

  AssetCategory({
    required this.id,
    required this.name,
    required this.description,
    required this.icon,
    required this.createdAt,
  });

  factory AssetCategory.fromJson(Map<String, dynamic> json) {
    return AssetCategory(
      id: json['id'] as String,
      name: json['name'] as String,
      description: json['description'] as String? ?? '',
      icon: json['icon'] as String? ?? '📦',
      createdAt: DateTime.parse(json['createdAt'] as String),
    );
  }
}

class AuditLog {
  final String id;
  final String userId;
  final String action;
  final String entityType;
  final String entityId;
  final String details;
  final DateTime createdAt;

  AuditLog({
    required this.id,
    required this.userId,
    required this.action,
    required this.entityType,
    required this.entityId,
    required this.details,
    required this.createdAt,
  });

  factory AuditLog.fromJson(Map<String, dynamic> json) {
    return AuditLog(
      id: json['id'] as String,
      userId: json['userId'] as String,
      action: json['action'] as String,
      entityType: json['entityType'] as String,
      entityId: json['entityId'] as String,
      details: json['details'] as String? ?? '',
      createdAt: DateTime.parse(json['createdAt'] as String),
    );
  }
}

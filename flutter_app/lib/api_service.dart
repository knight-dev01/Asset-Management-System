import 'dart:convert';

import 'package:http/http.dart' as http;
import 'models.dart';

const _baseUrl = String.fromEnvironment('ASSET_API_URL', defaultValue: 'http://localhost:5238/api');

class ApiService {
  static Future<AuthResponse> login(String email, String password) async {
    final uri = Uri.parse('$_baseUrl/auth/login');
    final response = await http.post(
      uri,
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({'email': email, 'password': password}),
    );

    if (response.statusCode != 200) {
      throw ApiException._fromResponse(response);
    }

    return AuthResponse.fromJson(jsonDecode(response.body) as Map<String, dynamic>);
  }

  static Future<AuthResponse> register(String email, String displayName, String password) async {
    final uri = Uri.parse('$_baseUrl/auth/register');
    final response = await http.post(
      uri,
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({'email': email, 'displayName': displayName, 'password': password}),
    );

    if (response.statusCode != 200) {
      throw ApiException._fromResponse(response);
    }

    return AuthResponse.fromJson(jsonDecode(response.body) as Map<String, dynamic>);
  }

  static Future<void> logout(String sessionToken) async {
    final uri = Uri.parse('$_baseUrl/auth/logout');
    final response = await http.post(
      uri,
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({'sessionToken': sessionToken}),
    );
    // Accept 204 (success) or 404 (already expired/invalid) as successful logout
    if (response.statusCode != 204 && response.statusCode != 404) {
      throw ApiException._fromResponse(response);
    }
  }

  static Future<List<Asset>> fetchAssets(String createdBy, {String? search, String? category, String? status}) async {
    final queryParameters = <String, String>{'createdBy': createdBy};
    if (search != null && search.isNotEmpty) queryParameters['search'] = search;
    if (category != null && category.isNotEmpty) queryParameters['category'] = category;
    if (status != null && status.isNotEmpty) queryParameters['status'] = status;
    final uri = Uri.parse('$_baseUrl/assets').replace(queryParameters: queryParameters);
    final response = await http.get(uri);
    if (response.statusCode != 200) {
      throw ApiException._fromResponse(response);
    }
    final body = jsonDecode(response.body) as List<dynamic>;
    return body.map((item) => Asset.fromJson(item as Map<String, dynamic>)).toList();
  }

  static Future<AssetSummary> fetchSummary(String createdBy) async {
    final uri = Uri.parse('$_baseUrl/assets/summary').replace(queryParameters: {'createdBy': createdBy});
    final response = await http.get(uri);
    if (response.statusCode != 200) {
      throw ApiException._fromResponse(response);
    }
    return AssetSummary.fromJson(jsonDecode(response.body) as Map<String, dynamic>);
  }

  static Future<Asset> createAsset(Asset asset) async {
    final uri = Uri.parse('$_baseUrl/assets');
    final response = await http.post(
      uri,
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode(asset.toJson()),
    );

    if (response.statusCode != 201) {
      throw ApiException._fromResponse(response);
    }

    return Asset.fromJson(jsonDecode(response.body) as Map<String, dynamic>);
  }

  static Future<Asset> updateAsset(Asset asset) async {
    final uri = Uri.parse('$_baseUrl/assets/${asset.id}').replace(queryParameters: {'createdBy': asset.createdBy});
    final response = await http.put(
      uri,
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode(asset.toJson()),
    );

    if (response.statusCode != 200) {
      throw ApiException._fromResponse(response);
    }

    return Asset.fromJson(jsonDecode(response.body) as Map<String, dynamic>);
  }

  static Future<void> deleteAsset(String id, String createdBy) async {
    final uri = Uri.parse('$_baseUrl/assets/$id').replace(queryParameters: {'createdBy': createdBy});
    final response = await http.delete(uri);
    if (response.statusCode != 204) {
      throw ApiException._fromResponse(response);
    }
  }

  // Categories endpoints
  static Future<List<AssetCategory>> fetchCategories() async {
    final uri = Uri.parse('$_baseUrl/categories');
    final response = await http.get(uri);
    if (response.statusCode != 200) {
      throw ApiException._fromResponse(response);
    }
    final body = jsonDecode(response.body) as List<dynamic>;
    return body.map((item) => AssetCategory.fromJson(item as Map<String, dynamic>)).toList();
  }

  static Future<AssetCategory> createCategory(String name, String description, String icon) async {
    final uri = Uri.parse('$_baseUrl/categories');
    final response = await http.post(
      uri,
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({'name': name, 'description': description, 'icon': icon}),
    );
    if (response.statusCode != 201) {
      throw ApiException._fromResponse(response);
    }
    return AssetCategory.fromJson(jsonDecode(response.body) as Map<String, dynamic>);
  }

  // Audit logs endpoints
  static Future<List<AuditLog>> fetchAuditLogs(String userId) async {
    final uri = Uri.parse('$_baseUrl/auditlogs/user/$userId');
    final response = await http.get(uri);
    if (response.statusCode != 200) {
      throw ApiException._fromResponse(response);
    }
    final body = jsonDecode(response.body) as List<dynamic>;
    return body.map((item) => AuditLog.fromJson(item as Map<String, dynamic>)).toList();
  }
}

class ApiException implements Exception {
  final String message;

  ApiException(this.message);

  factory ApiException._fromResponse(http.Response response) {
    try {
      final body = jsonDecode(response.body) as Map<String, dynamic>;
      return ApiException(body['error']?.toString() ?? response.reasonPhrase ?? 'Unknown error');
    } catch (_) {
      return ApiException(response.reasonPhrase ?? 'Unknown error');
    }
  }

  @override
  String toString() => message;
}

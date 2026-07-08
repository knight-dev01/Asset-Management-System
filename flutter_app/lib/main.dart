import 'package:flutter/material.dart';

import 'api_service.dart';
import 'models.dart';
import 'screens/asset_detail_screen.dart';
import 'screens/asset_form_screen.dart';
import 'screens/login_screen.dart';
import 'print_helper.dart';

void main() {
  runApp(const AssetManagementApp());
}

class AssetManagementApp extends StatefulWidget {
  const AssetManagementApp({super.key});

  @override
  State<AssetManagementApp> createState() => _AssetManagementAppState();
}

class _AssetManagementAppState extends State<AssetManagementApp> {
  AuthResponse? _currentUser;
  List<Asset> _assets = [];
  AssetSummary? _summary;
  bool _loading = false;
  String _search = '';
  String _category = '';
  String _status = '';
  String? _error;

  Future<void> _login(String email, String password) async {
    setState(() {
      _loading = true;
      _error = null;
    });

    try {
      final auth = await ApiService.login(email, password);
      setState(() {
        _currentUser = auth;
      });
      await _refreshData();
    } catch (error) {
      setState(() {
        _error = error.toString();
      });
    } finally {
      setState(() {
        _loading = false;
      });
    }
  }

  Future<void> _register(String email, String displayName, String password) async {
    setState(() {
      _loading = true;
      _error = null;
    });

    try {
      final auth = await ApiService.register(email, displayName, password);
      setState(() {
        _currentUser = auth;
      });
      await _refreshData();
    } catch (error) {
      setState(() {
        _error = error.toString();
      });
    } finally {
      setState(() {
        _loading = false;
      });
    }
  }

  Future<void> _logout() async {
    if (_currentUser == null) return;
    setState(() {
      _loading = true;
      _error = null;
    });
    try {
      await ApiService.logout(_currentUser!.sessionToken);
      setState(() {
        _currentUser = null;
        _assets = [];
        _summary = null;
      });
    } catch (error) {
      setState(() {
        _error = error.toString();
      });
    } finally {
      setState(() {
        _loading = false;
      });
    }
  }

  Future<void> _refreshData() async {
    if (_currentUser == null) return;
    setState(() {
      _loading = true;
      _error = null;
    });
    try {
      final summary = await ApiService.fetchSummary(_currentUser!.userId);
      final assets = await ApiService.fetchAssets(_currentUser!.userId, search: _search, category: _category, status: _status);
      setState(() {
        _summary = summary;
        _assets = assets;
      });
    } catch (error) {
      setState(() {
        _error = error.toString();
      });
    } finally {
      setState(() {
        _loading = false;
      });
    }
  }

  Future<void> _saveAsset(Asset asset) async {
    if (_currentUser == null) return;

    try {
      final created = await ApiService.createAsset(
        Asset(
          assetName: asset.assetName,
          category: asset.category,
          brand: asset.brand,
          model: asset.model,
          serialNumber: asset.serialNumber,
          purchaseDate: asset.purchaseDate,
          purchaseCost: asset.purchaseCost,
          department: asset.department,
          location: asset.location,
          status: asset.status,
          description: asset.description,
          createdBy: _currentUser!.userId,
        ),
      );
      setState(() {
        _assets.insert(0, created);
      });
      await _refreshData();
    } catch (error) {
      setState(() {
        _error = error.toString();
      });
    }
  }

  Future<void> _updateAsset(Asset asset) async {
    if (_currentUser == null) return;
    try {
      final updated = await ApiService.updateAsset(asset);
      setState(() {
        final index = _assets.indexWhere((item) => item.id == updated.id);
        if (index != -1) {
          _assets[index] = updated;
        }
      });
      await _refreshData();
    } catch (error) {
      setState(() {
        _error = error.toString();
      });
    }
  }

  Future<void> _deleteAsset(String id) async {
    if (_currentUser == null) return;
    try {
      await ApiService.deleteAsset(id, _currentUser!.userId);
      setState(() {
        _assets.removeWhere((asset) => asset.id == id);
      });
      await _refreshData();
    } catch (error) {
      setState(() {
        _error = error.toString();
      });
    }
  }

  void _printAsset(Asset asset) {
    final html = '''
      <div style="font-family: Arial, sans-serif; padding: 24px;">
        <h1>${asset.assetName}</h1>
        <p><strong>Asset Code:</strong> ${asset.assetCode}</p>
        <div>${asset.barcodeSvg}</div>
      </div>
    ''';
    printHtml(html);
  }

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Asset Management System',
      theme: ThemeData(primarySwatch: Colors.indigo),
      home: _currentUser == null
          ? LoginScreen(onLogin: _login, onRegister: _register)
          : Scaffold(
              appBar: AppBar(
                title: const Text('Asset Management System'),
                actions: [
                  IconButton(
                    icon: const Icon(Icons.logout),
                    onPressed: _logout,
                  ),
                ],
              ),
              body: Padding(
                padding: const EdgeInsets.all(16),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    if (_error != null) ...[
                      Card(
                        color: Colors.red.shade50,
                        child: Padding(
                          padding: const EdgeInsets.all(12),
                          child: Row(
                            children: [
                              const Icon(Icons.error_outline, color: Colors.redAccent),
                              const SizedBox(width: 12),
                              Expanded(child: Text(_error!, style: const TextStyle(color: Colors.redAccent))),
                            ],
                          ),
                        ),
                      ),
                      const SizedBox(height: 16),
                    ],
                    Row(
                      children: [
                        Expanded(
                          child: TextField(
                            decoration: const InputDecoration(
                              labelText: 'Search assets',
                              prefixIcon: Icon(Icons.search),
                            ),
                            onChanged: (value) {
                              _search = value;
                            },
                            onSubmitted: (_) => _refreshData(),
                          ),
                        ),
                        const SizedBox(width: 12),
                        ElevatedButton.icon(
                          onPressed: _refreshData,
                          icon: const Icon(Icons.refresh),
                          label: const Text('Refresh'),
                        ),
                      ],
                    ),
                    const SizedBox(height: 16),
                    Card(
                      elevation: 2,
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                      child: Padding(
                        padding: const EdgeInsets.symmetric(vertical: 18, horizontal: 20),
                        child: Row(
                          children: [
                            Expanded(child: _buildSummaryTile('Total assets', _summary?.totalAssets.toString() ?? '0', Icons.inventory_2_outlined)),
                            Expanded(child: _buildSummaryTile('Categories', _summary?.totalCategories.toString() ?? '0', Icons.category_outlined)),
                            Expanded(child: _buildSummaryTile('Recent', _summary?.recentAssets.length.toString() ?? '0', Icons.schedule_outlined)),
                          ],
                        ),
                      ),
                    ),
                    const SizedBox(height: 16),
                    Row(
                      children: [
                        Expanded(
                          child: TextField(
                            decoration: const InputDecoration(labelText: 'Category filter'),
                            onChanged: (value) {
                              _category = value;
                            },
                          ),
                        ),
                        const SizedBox(width: 12),
                        Expanded(
                          child: TextField(
                            decoration: const InputDecoration(labelText: 'Status filter'),
                            onChanged: (value) {
                              _status = value;
                            },
                          ),
                        ),
                        const SizedBox(width: 12),
                        ElevatedButton.icon(
                          onPressed: () => _refreshData(),
                          icon: const Icon(Icons.filter_list),
                          label: const Text('Apply'),
                        ),
                      ],
                    ),
                    const SizedBox(height: 16),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Text('Assets', style: Theme.of(context).textTheme.titleLarge),
                        ElevatedButton.icon(
                          onPressed: () async {
                            final asset = await Navigator.of(context).push<Asset?>(
                              MaterialPageRoute(
                                builder: (context) => AssetFormScreen(onSave: (asset) => Navigator.of(context).pop(asset)),
                              ),
                            );
                            if (asset != null) {
                              await _saveAsset(asset);
                            }
                          },
                          icon: const Icon(Icons.add),
                          label: const Text('New Asset'),
                        ),
                      ],
                    ),
                    const SizedBox(height: 12),
                    if (_loading) const LinearProgressIndicator(),
                    Expanded(child: _buildAssetList()),
                  ],
                ),
              ),
            ),
    );
  }

  Widget _buildSummaryTile(String title, String value, IconData icon) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Icon(icon, color: Colors.indigo.shade700),
        const SizedBox(height: 8),
        Text(value, style: const TextStyle(fontSize: 22, fontWeight: FontWeight.bold)),
        const SizedBox(height: 4),
        Text(title, style: TextStyle(color: Colors.grey.shade700)),
      ],
    );
  }

  Widget _buildAssetList() {
    if (_assets.isEmpty) {
      return const Center(child: Text('No assets found.'));
    }
    return ListView.builder(
      itemCount: _assets.length,
      itemBuilder: (context, index) {
        final asset = _assets[index];
        return Card(
          child: ListTile(
            title: Text('${asset.assetName} (${asset.assetCode})'),
            subtitle: Text('${asset.category} • ${asset.status}'),
            trailing: PopupMenuButton<String>(
              onSelected: (value) async {
                if (value == 'view') {
                  await Navigator.of(context).push(MaterialPageRoute(
                    builder: (context) => AssetDetailScreen(
                      asset: asset,
                      onPrint: () => _printAsset(asset),
                    ),
                  ));
                } else if (value == 'edit') {
                  final updatedAsset = await Navigator.of(context).push<Asset?>(
                    MaterialPageRoute(
                      builder: (context) => AssetFormScreen(
                        asset: asset,
                        onSave: (asset) => Navigator.of(context).pop(asset),
                      ),
                    ),
                  );
                  if (updatedAsset != null) {
                    await _updateAsset(updatedAsset);
                  }
                } else if (value == 'delete') {
                  final confirmed = await showDialog<bool>(
                    context: context,
                    builder: (context) => AlertDialog(
                      title: const Text('Delete asset'),
                      content: const Text('Delete this asset permanently?'),
                      actions: [
                        TextButton(onPressed: () => Navigator.of(context).pop(false), child: const Text('Cancel')),
                        TextButton(onPressed: () => Navigator.of(context).pop(true), child: const Text('Delete')),
                      ],
                    ),
                  );
                  if (confirmed == true) {
                    await _deleteAsset(asset.id);
                  }
                }
              },
              itemBuilder: (context) => const [
                PopupMenuItem(value: 'view', child: Text('View details')),
                PopupMenuItem(value: 'edit', child: Text('Edit')),
                PopupMenuItem(value: 'delete', child: Text('Delete')),
              ],
            ),
          ),
        );
      },
    );
  }
}

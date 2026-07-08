import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:flutter_svg/flutter_svg.dart';

import '../models.dart';

class AssetDetailScreen extends StatelessWidget {
  final Asset asset;
  final VoidCallback onPrint;

  const AssetDetailScreen({super.key, required this.asset, required this.onPrint});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Asset Details'),
        actions: [
          IconButton(
            icon: const Icon(Icons.print),
            tooltip: 'Print barcode',
            onPressed: onPrint,
          ),
        ],
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text('${asset.assetName} (${asset.assetCode})', style: Theme.of(context).textTheme.headlineSmall),
            const SizedBox(height: 12),
            _buildInfoRow('Category', asset.category),
            _buildInfoRow('Brand', asset.brand),
            _buildInfoRow('Model', asset.model),
            _buildInfoRow('Serial Number', asset.serialNumber),
            _buildInfoRow('Purchase Date', asset.purchaseDate),
            _buildInfoRow('Purchase Cost', asset.purchaseCost.toStringAsFixed(2)),
            _buildInfoRow('Department', asset.department),
            _buildInfoRow('Location', asset.location),
            _buildInfoRow('Status', asset.status),
            _buildInfoRow('Description', asset.description),
            _buildInfoRow('Created By', asset.createdBy),
            _buildInfoRow('Created At', asset.createdAt.toLocal().toString()),
            _buildInfoRow('Updated At', asset.updatedAt.toLocal().toString()),
            const SizedBox(height: 24),
            if (asset.barcodeSvg.isNotEmpty) ...[
              const Text('Barcode', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
              const SizedBox(height: 12),
              Container(
                width: double.infinity,
                padding: const EdgeInsets.all(12),
                decoration: BoxDecoration(
                  color: Colors.white,
                  border: Border.all(color: Colors.grey.shade300),
                  borderRadius: BorderRadius.circular(12),
                ),
                child: SvgPicture.string(
                  asset.barcodeSvg,
                  height: 180,
                  fit: BoxFit.contain,
                ),
              ),
            ],
            if (!kIsWeb)
              const Padding(
                padding: EdgeInsets.only(top: 12),
                child: Text('Barcode printing is available on web builds.'),
              ),
          ],
        ),
      ),
    );
  }

  Widget _buildInfoRow(String title, String value) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 8),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          SizedBox(width: 120, child: Text('$title:', style: const TextStyle(fontWeight: FontWeight.bold))),
          Expanded(child: Text(value.isEmpty ? '—' : value)),
        ],
      ),
    );
  }
}

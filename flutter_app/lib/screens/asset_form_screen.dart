import 'package:flutter/material.dart';

import '../models.dart';

class AssetFormScreen extends StatefulWidget {
  final Asset? asset;
  final void Function(Asset asset) onSave;

  const AssetFormScreen({super.key, this.asset, required this.onSave});

  @override
  State<AssetFormScreen> createState() => _AssetFormScreenState();
}

class _AssetFormScreenState extends State<AssetFormScreen> {
  final _formKey = GlobalKey<FormState>();
  late final TextEditingController _nameController;
  late final TextEditingController _categoryController;
  late final TextEditingController _brandController;
  late final TextEditingController _modelController;
  late final TextEditingController _serialController;
  late final TextEditingController _purchaseDateController;
  late final TextEditingController _purchaseCostController;
  late final TextEditingController _departmentController;
  late final TextEditingController _locationController;
  late final TextEditingController _descriptionController;
  String _status = 'Active';

  @override
  void initState() {
    super.initState();
    final asset = widget.asset;
    _nameController = TextEditingController(text: asset?.assetName ?? '');
    _categoryController = TextEditingController(text: asset?.category ?? '');
    _brandController = TextEditingController(text: asset?.brand ?? '');
    _modelController = TextEditingController(text: asset?.model ?? '');
    _serialController = TextEditingController(text: asset?.serialNumber ?? '');
    _purchaseDateController = TextEditingController(text: asset?.purchaseDate ?? '');
    _purchaseCostController = TextEditingController(text: asset?.purchaseCost.toString() ?? '');
    _departmentController = TextEditingController(text: asset?.department ?? '');
    _locationController = TextEditingController(text: asset?.location ?? '');
    _descriptionController = TextEditingController(text: asset?.description ?? '');
    _status = asset?.status ?? 'Active';
  }

  @override
  void dispose() {
    _nameController.dispose();
    _categoryController.dispose();
    _brandController.dispose();
    _modelController.dispose();
    _serialController.dispose();
    _purchaseDateController.dispose();
    _purchaseCostController.dispose();
    _departmentController.dispose();
    _locationController.dispose();
    _descriptionController.dispose();
    super.dispose();
  }

  void _save() {
    if (!_formKey.currentState!.validate()) return;
    final asset = Asset(
      id: widget.asset?.id ?? '',
      assetCode: widget.asset?.assetCode ?? '',
      assetName: _nameController.text.trim(),
      category: _categoryController.text.trim(),
      brand: _brandController.text.trim(),
      model: _modelController.text.trim(),
      serialNumber: _serialController.text.trim(),
      purchaseDate: _purchaseDateController.text.trim(),
      purchaseCost: double.tryParse(_purchaseCostController.text.trim()) ?? 0.0,
      department: _departmentController.text.trim(),
      location: _locationController.text.trim(),
      status: _status,
      description: _descriptionController.text.trim(),
      createdBy: widget.asset?.createdBy ?? '',
      createdAt: widget.asset?.createdAt,
      updatedAt: widget.asset?.updatedAt,
      barcodeSvg: widget.asset?.barcodeSvg ?? '',
      barcodeFileName: widget.asset?.barcodeFileName ?? '',
    );
    widget.onSave(asset);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(widget.asset == null ? 'Create Asset' : 'Update Asset'),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Form(
          key: _formKey,
          child: Column(
            children: [
              TextFormField(
                controller: _nameController,
                decoration: const InputDecoration(labelText: 'Asset Name'),
                validator: (value) => value == null || value.trim().isEmpty ? 'Enter asset name' : null,
              ),
              const SizedBox(height: 12),
              TextFormField(
                controller: _categoryController,
                decoration: const InputDecoration(labelText: 'Category'),
              ),
              const SizedBox(height: 12),
              TextFormField(
                controller: _brandController,
                decoration: const InputDecoration(labelText: 'Brand'),
              ),
              const SizedBox(height: 12),
              TextFormField(
                controller: _modelController,
                decoration: const InputDecoration(labelText: 'Model'),
              ),
              const SizedBox(height: 12),
              TextFormField(
                controller: _serialController,
                decoration: const InputDecoration(labelText: 'Serial number'),
              ),
              const SizedBox(height: 12),
              TextFormField(
                controller: _purchaseDateController,
                decoration: const InputDecoration(labelText: 'Purchase date'),
              ),
              const SizedBox(height: 12),
              TextFormField(
                controller: _purchaseCostController,
                decoration: const InputDecoration(labelText: 'Purchase cost'),
                keyboardType: const TextInputType.numberWithOptions(decimal: true),
              ),
              const SizedBox(height: 12),
              TextFormField(
                controller: _departmentController,
                decoration: const InputDecoration(labelText: 'Department'),
              ),
              const SizedBox(height: 12),
              TextFormField(
                controller: _locationController,
                decoration: const InputDecoration(labelText: 'Location'),
              ),
              const SizedBox(height: 12),
              DropdownButtonFormField<String>(
                initialValue: _status,
                decoration: const InputDecoration(labelText: 'Status'),
                items: const [
                  DropdownMenuItem(value: 'Active', child: Text('Active')),
                  DropdownMenuItem(value: 'Maintenance', child: Text('Maintenance')),
                  DropdownMenuItem(value: 'Retired', child: Text('Retired')),
                ],
                onChanged: (value) => setState(() {
                  if (value != null) _status = value;
                }),
              ),
              const SizedBox(height: 12),
              TextFormField(
                controller: _descriptionController,
                decoration: const InputDecoration(labelText: 'Description'),
                minLines: 2,
                maxLines: 4,
              ),
              const SizedBox(height: 24),
              ElevatedButton(
                onPressed: _save,
                child: const Text('Save Asset'),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

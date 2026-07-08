import React, { useState, useEffect } from 'react';
import { Asset, ASSET_CATEGORIES, DEPARTMENTS, LOCATIONS, AssetStatus } from '../types';
import { generateAssetCode } from '../lib/assetService';
import { X, ShieldAlert, Sparkles } from 'lucide-react';

interface AssetFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<Asset, 'id' | 'assetCode' | 'createdBy' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  editingAsset?: Asset;
}

export const AssetFormModal: React.FC<AssetFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  editingAsset
}) => {
  // Local form states
  const [assetName, setAssetName] = useState('');
  const [category, setCategory] = useState(ASSET_CATEGORIES[0]);
  const [brand, setBrand] = useState('');
  const [model, setModel] = useState('');
  const [serialNumber, setSerialNumber] = useState('');
  const [purchaseDate, setPurchaseDate] = useState(new Date().toISOString().split('T')[0]);
  const [purchaseCost, setPurchaseCost] = useState('');
  const [department, setDepartment] = useState(DEPARTMENTS[0]);
  const [location, setLocation] = useState(LOCATIONS[0]);
  const [status, setStatus] = useState<AssetStatus>('Active');
  const [description, setDescription] = useState('');

  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Sync state if editing an asset
  useEffect(() => {
    if (editingAsset) {
      setAssetName(editingAsset.assetName);
      setCategory(editingAsset.category);
      setBrand(editingAsset.brand);
      setModel(editingAsset.model);
      setSerialNumber(editingAsset.serialNumber);
      setPurchaseDate(editingAsset.purchaseDate);
      setPurchaseCost(String(editingAsset.purchaseCost));
      setDepartment(editingAsset.department);
      setLocation(editingAsset.location);
      setStatus(editingAsset.status);
      setDescription(editingAsset.description);
    } else {
      // Reset to defaults
      setAssetName('');
      setCategory(ASSET_CATEGORIES[0]);
      setBrand('');
      setModel('');
      setSerialNumber('');
      setPurchaseDate(new Date().toISOString().split('T')[0]);
      setPurchaseCost('');
      setDepartment(DEPARTMENTS[0]);
      setLocation(LOCATIONS[0]);
      setStatus('Active');
      setDescription('');
    }
    setErrorMsg(null);
  }, [editingAsset, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSaving(true);

    // Validation
    if (!assetName.trim()) {
      setErrorMsg("Asset Name is required.");
      setSaving(false);
      return;
    }
    if (isNaN(Number(purchaseCost)) || Number(purchaseCost) < 0) {
      setErrorMsg("Purchase Cost must be a positive number.");
      setSaving(false);
      return;
    }

    try {
      await onSubmit({
        assetName: assetName.trim(),
        category,
        brand: brand.trim(),
        model: model.trim(),
        serialNumber: serialNumber.trim(),
        purchaseDate,
        purchaseCost: Number(purchaseCost),
        department,
        location,
        status,
        description: description.trim()
      });
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to process asset registration.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-xl border border-slate-200 w-full max-w-3xl flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-slate-100">
          <div>
            <h2 className="text-md font-bold text-slate-800 tracking-tight">
              {editingAsset ? `Edit Asset: ${editingAsset.assetCode}` : "Register Company Asset"}
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              {editingAsset 
                ? "Modify technical and organizational specifications" 
                : "A new unique barcode will be generated automatically"}
            </p>
          </div>
          <button 
            onClick={onClose} 
            className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Container */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5">
          {errorMsg && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg flex items-start gap-3">
              <ShieldAlert className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
              <p className="text-xs text-red-700 font-bold">{errorMsg}</p>
            </div>
          )}

          {/* Core Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                Asset Name *
              </label>
              <input
                type="text"
                required
                value={assetName}
                id="form-asset-name"
                onChange={(e) => setAssetName(e.target.value)}
                placeholder="e.g. MacBook Pro 16'' (M3 Max)"
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 text-xs transition-all text-slate-800"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                Category *
              </label>
              <select
                value={category}
                id="form-category"
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 text-xs bg-white transition-all text-slate-800"
              >
                {ASSET_CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Brand, Model & Serial */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                Manufacturer / Brand
              </label>
              <input
                type="text"
                value={brand}
                id="form-brand"
                onChange={(e) => setBrand(e.target.value)}
                placeholder="e.g. Apple"
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 text-xs transition-all text-slate-800"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                Model Name / Number
              </label>
              <input
                type="text"
                value={model}
                id="form-model"
                onChange={(e) => setModel(e.target.value)}
                placeholder="e.g. A2991"
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 text-xs transition-all text-slate-800"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                Serial Number
              </label>
              <input
                type="text"
                value={serialNumber}
                id="form-serial"
                onChange={(e) => setSerialNumber(e.target.value)}
                placeholder="e.g. C02G789MMD6T"
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 text-xs transition-all text-slate-800"
              />
            </div>
          </div>

          {/* Financials & Dates */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                Purchase Date
              </label>
              <input
                type="date"
                value={purchaseDate}
                id="form-purchase-date"
                onChange={(e) => setPurchaseDate(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 text-xs transition-all text-slate-800"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                Purchase Cost ($ USD) *
              </label>
              <input
                type="number"
                step="0.01"
                required
                value={purchaseCost}
                id="form-cost"
                onChange={(e) => setPurchaseCost(e.target.value)}
                placeholder="e.g. 2499.00"
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 text-xs transition-all text-slate-800"
              />
            </div>
          </div>

          {/* Organization & Location */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                Responsible Department
              </label>
              <select
                value={department}
                id="form-department"
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 text-xs bg-white transition-all text-slate-800"
              >
                {DEPARTMENTS.map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                Physical Location
              </label>
              <select
                value={location}
                id="form-location"
                onChange={(e) => setLocation(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 text-xs bg-white transition-all text-slate-800"
              >
                {LOCATIONS.map(loc => (
                  <option key={loc} value={loc}>{loc}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                Asset Status *
              </label>
              <select
                value={status}
                id="form-status"
                onChange={(e) => setStatus(e.target.value as AssetStatus)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 text-xs bg-white transition-all text-slate-800"
              >
                <option value="Active">Active / In Use</option>
                <option value="Maintenance">In Maintenance</option>
                <option value="Retired">Retired / Out of Service</option>
              </select>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
              Detailed Description / Notes
            </label>
            <textarea
              value={description}
              id="form-description"
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter technical details, assigned employee details, or maintenance schedules..."
              rows={3}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 text-xs resize-none transition-all text-slate-800"
            />
          </div>

          {!editingAsset && (
            <div className="bg-indigo-50/50 px-4 py-3 rounded-lg border border-indigo-100/30 flex items-center gap-3">
              <Sparkles className="w-5 h-5 text-indigo-600 shrink-0" />
              <p className="text-xs text-slate-500 leading-relaxed">
                By registering this asset, the system will instantly encode a professional <strong className="text-indigo-600 font-bold">CODE-128 linear barcode</strong> matching the newly assigned asset number.
              </p>
            </div>
          )}
        </form>

        {/* Footer Actions */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-3 rounded-b-xl">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 border border-slate-200 hover:bg-slate-100 text-slate-600 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            onClick={handleSubmit}
            disabled={saving}
            id="form-submit-btn"
            className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors cursor-pointer"
          >
            {saving ? "Processing..." : editingAsset ? "Save Changes" : "Register Asset"}
          </button>
        </div>
      </div>
    </div>
  );
};

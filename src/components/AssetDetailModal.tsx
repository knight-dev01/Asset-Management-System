import React, { useState } from 'react';
import { Asset } from '../types';
import { BarcodeView } from './BarcodeView';
import { X, Calendar, DollarSign, Edit, Trash2, MapPin, Building, Info, AlertTriangle, ShieldCheck } from 'lucide-react';

interface AssetDetailModalProps {
  asset: Asset | null;
  isOpen: boolean;
  onClose: () => void;
  onEditClick: (asset: Asset) => void;
  onDeleteConfirm: (assetId: string) => Promise<void>;
}

export const AssetDetailModal: React.FC<AssetDetailModalProps> = ({
  asset,
  isOpen,
  onClose,
  onEditClick,
  onDeleteConfirm
}) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);

  if (!isOpen || !asset) return null;

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await onDeleteConfirm(asset.id);
      setShowDeleteConfirm(false);
      onClose();
    } catch (err) {
      console.error("Delete failed", err);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-xl border border-slate-200 w-full max-w-2xl flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-slate-100">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Asset Record Sheet</span>
            <h2 className="text-md font-bold text-slate-800 tracking-tight mt-0.5">{asset.assetName}</h2>
          </div>
          <button 
            onClick={onClose} 
            className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Sheet */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Main Quick-Stats & Barcode */}
          <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center justify-between bg-slate-50 p-4 rounded-xl border border-slate-100">
            <div className="space-y-2">
              <span className={`inline-block text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                asset.status === 'Active' 
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' 
                  : asset.status === 'Maintenance' 
                    ? 'bg-amber-50 text-amber-700 border border-amber-100' 
                    : 'bg-slate-100 text-slate-700 border border-slate-200'
              }`}>
                {asset.status}
              </span>
              <div>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Auto-Generated Asset ID</p>
                <h3 className="text-lg font-mono font-bold text-slate-800 mt-0.5">{asset.assetCode}</h3>
              </div>
            </div>
            
            {/* Native Printable Barcode View */}
            <BarcodeView 
              value={asset.assetCode} 
              assetName={asset.assetName} 
              category={asset.category}
              className="w-full sm:w-auto self-stretch shrink-0" 
            />
          </div>

          {/* Grid Information Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Category */}
            <div className="flex items-start gap-2.5">
              <div className="p-1.5 bg-slate-50 text-slate-600 rounded-md border border-slate-100">
                <Info className="w-4 h-4 text-indigo-500" />
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Category</span>
                <span className="text-xs font-semibold text-slate-800">{asset.category}</span>
              </div>
            </div>

            {/* Department */}
            <div className="flex items-start gap-2.5">
              <div className="p-1.5 bg-slate-50 text-slate-600 rounded-md border border-slate-100">
                <Building className="w-4 h-4 text-indigo-500" />
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Department</span>
                <span className="text-xs font-semibold text-slate-800">{asset.department}</span>
              </div>
            </div>

            {/* Location */}
            <div className="flex items-start gap-2.5">
              <div className="p-1.5 bg-slate-50 text-slate-600 rounded-md border border-slate-100">
                <MapPin className="w-4 h-4 text-indigo-500" />
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Location</span>
                <span className="text-xs font-semibold text-slate-800">{asset.location}</span>
              </div>
            </div>

            {/* Purchase Cost */}
            <div className="flex items-start gap-2.5">
              <div className="p-1.5 bg-slate-50 text-slate-600 rounded-md border border-slate-100">
                <DollarSign className="w-4 h-4 text-indigo-500" />
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Purchase Cost</span>
                <span className="text-xs font-mono font-bold text-slate-800">
                  ${asset.purchaseCost.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>
            </div>

            {/* Brand & Model */}
            <div className="flex items-start gap-2.5">
              <div className="p-1.5 bg-slate-50 text-slate-600 rounded-md border border-slate-100">
                <ShieldCheck className="w-4 h-4 text-indigo-500" />
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Brand & Model</span>
                <span className="text-xs font-semibold text-slate-800">
                  {asset.brand || '—'} {asset.model ? `(Model: ${asset.model})` : ''}
                </span>
              </div>
            </div>

            {/* Serial Number */}
            <div className="flex items-start gap-2.5">
              <div className="p-1.5 bg-slate-50 text-slate-600 rounded-md border border-slate-100">
                <span className="font-mono text-[10px] font-bold text-indigo-500">S/N</span>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Serial Number</span>
                <span className="text-xs font-mono font-bold text-slate-800">{asset.serialNumber || '—'}</span>
              </div>
            </div>

            {/* Purchase Date */}
            <div className="flex items-start gap-2.5">
              <div className="p-1.5 bg-slate-50 text-slate-600 rounded-md border border-slate-100">
                <Calendar className="w-4 h-4 text-indigo-500" />
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Purchase Date</span>
                <span className="text-xs font-semibold text-slate-800">{asset.purchaseDate || '—'}</span>
              </div>
            </div>

          </div>

          {/* Description Block */}
          {asset.description && (
            <div className="border-t border-slate-100 pt-4">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Description / Notes</span>
              <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-100 whitespace-pre-line">
                {asset.description}
              </p>
            </div>
          )}

          {/* Registration Log Details */}
          <div className="border-t border-slate-100 pt-4 flex flex-wrap justify-between gap-4 text-[10px] text-slate-400 font-bold uppercase tracking-wider">
            <span>Registered By: <strong className="text-slate-500">{asset.createdBy}</strong></span>
            <span>Created: <strong className="text-slate-500">{new Date(asset.createdAt).toLocaleString()}</strong></span>
            <span>Last Updated: <strong className="text-slate-500">{new Date(asset.updatedAt).toLocaleString()}</strong></span>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-3 rounded-b-xl">
          <button
            onClick={() => {
              onEditClick(asset);
              onClose();
            }}
            id="detail-edit-asset-btn"
            className="flex items-center gap-1.5 px-3 py-1.5 border border-slate-200 hover:bg-slate-100 text-slate-600 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
          >
            <Edit className="w-3.5 h-3.5" />
            Edit Info
          </button>

          <button
            onClick={() => setShowDeleteConfirm(true)}
            id="detail-delete-asset-btn"
            className="flex items-center gap-1.5 px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Delete Asset
          </button>
        </div>
      </div>

      {/* Delete Confirmation Overlay (Modal on Top of Modal) */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-xl shadow-xl border border-red-100 w-full max-w-md p-6 space-y-4">
            <div className="flex items-center gap-3 text-red-600">
              <div className="p-2 bg-red-50 rounded-lg">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <h3 className="text-md font-bold tracking-tight text-slate-800">Confirm Deletion</h3>
            </div>
            
            <p className="text-xs text-slate-500 leading-relaxed">
              Are you sure you want to delete <strong className="text-slate-700">{asset.assetName}</strong> ({asset.assetCode})? This action is permanent and cannot be undone.
            </p>

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-3 py-1.5 border border-slate-200 hover:bg-slate-100 text-slate-600 text-xs font-semibold rounded-lg cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                id="detail-confirm-delete-btn"
                className="px-3 py-1.5 bg-red-600 hover:bg-red-700 disabled:bg-red-300 text-white text-xs font-semibold rounded-lg shadow-sm cursor-pointer"
              >
                {deleting ? "Deleting..." : "Permanently Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

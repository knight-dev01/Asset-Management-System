import React from 'react';
import { Asset, ASSET_CATEGORIES } from '../types';
import { Layers, ShieldAlert, BadgeDollarSign, FolderHeart, Plus, Box, ArrowUpRight } from 'lucide-react';

interface DashboardStatsProps {
  assets: Asset[];
  onAddClick: () => void;
  onViewAsset: (asset: Asset) => void;
}

export const DashboardStats: React.FC<DashboardStatsProps> = ({ 
  assets, 
  onAddClick,
  onViewAsset 
}) => {
  // Statistics calculations
  const totalAssets = assets.length;
  
  // Unique categories count
  const uniqueCategories = Array.from(new Set(assets.map(a => a.category))).filter(Boolean);
  const totalCategoriesCount = uniqueCategories.length;

  // Active status counts
  const activeCount = assets.filter(a => a.status === 'Active').length;
  const maintenanceCount = assets.filter(a => a.status === 'Maintenance').length;
  const retiredCount = assets.filter(a => a.status === 'Retired').length;

  // Capital calculation
  const totalValuation = assets.reduce((sum, a) => sum + (Number(a.purchaseCost) || 0), 0);

  // Recently added assets (limit to 5)
  const recentlyAdded = [...assets]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  // Category breakdown counts
  const categoryStats = ASSET_CATEGORIES.map(category => {
    const count = assets.filter(a => a.category === category).length;
    const percentage = totalAssets > 0 ? Math.round((count / totalAssets) * 100) : 0;
    return { name: category, count, percentage };
  }).filter(stat => stat.count > 0);

  return (
    <div className="space-y-6 font-sans">
      {/* Upper Welcome Panel */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <div>
          <h1 className="text-xl font-bold text-slate-800 tracking-tight">Enterprise Asset Dashboard</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Real-time tracking, barcode verification, and lifecycle statistics.
          </p>
        </div>
        <button
          onClick={onAddClick}
          id="dashboard-register-asset-btn"
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold shadow-sm transition-colors cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          Register New Asset
        </button>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Stat 1: Total Assets */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-lg">
            <Box className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Assets</p>
            <h3 className="text-xl font-bold text-slate-800 mt-0.5">{totalAssets}</h3>
          </div>
        </div>

        {/* Stat 2: Active Categories */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-lg">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Active Categories</p>
            <h3 className="text-xl font-bold text-slate-800 mt-0.5">
              {totalCategoriesCount} <span className="text-[11px] text-slate-400 font-normal">/ {ASSET_CATEGORIES.length}</span>
            </h3>
          </div>
        </div>

        {/* Stat 3: Total Portfolio Value */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-lg">
            <BadgeDollarSign className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Valuation</p>
            <h3 className="text-xl font-bold text-slate-800 mt-0.5">
              ${totalValuation.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </h3>
          </div>
        </div>

        {/* Stat 4: Under Maintenance */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-2.5 bg-amber-50 text-amber-600 rounded-lg">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">In Maintenance</p>
            <h3 className="text-xl font-bold text-slate-800 mt-0.5">{maintenanceCount}</h3>
          </div>
        </div>
      </div>

      {/* Breakdown Grid: Category Chart + Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Category & Status Breakdown */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-5 lg:col-span-1">
          <div>
            <h3 className="text-sm font-bold text-slate-800 tracking-tight">Status Distribution</h3>
            <p className="text-[11px] text-slate-400">Current lifecycle states of company property</p>
          </div>

          <div className="space-y-3">
            {/* Active */}
            <div>
              <div className="flex justify-between text-[11px] font-semibold mb-1">
                <span className="text-slate-600 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 block"></span>
                  Active / In Use
                </span>
                <span className="text-slate-800">{activeCount} ({totalAssets > 0 ? Math.round((activeCount / totalAssets) * 100) : 0}%)</span>
              </div>
              <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                <div 
                  className="bg-emerald-500 h-full rounded-full transition-all duration-500" 
                  style={{ width: `${totalAssets > 0 ? (activeCount / totalAssets) * 100 : 0}%` }}
                ></div>
              </div>
            </div>

            {/* Maintenance */}
            <div>
              <div className="flex justify-between text-[11px] font-semibold mb-1">
                <span className="text-slate-600 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-500 block"></span>
                  Maintenance & Repair
                </span>
                <span className="text-slate-800">{maintenanceCount} ({totalAssets > 0 ? Math.round((maintenanceCount / totalAssets) * 100) : 0}%)</span>
              </div>
              <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                <div 
                  className="bg-amber-500 h-full rounded-full transition-all duration-500" 
                  style={{ width: `${totalAssets > 0 ? (maintenanceCount / totalAssets) * 100 : 0}%` }}
                ></div>
              </div>
            </div>

            {/* Retired */}
            <div>
              <div className="flex justify-between text-[11px] font-semibold mb-1">
                <span className="text-slate-600 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-slate-400 block"></span>
                  Retired / Disposed
                </span>
                <span className="text-slate-800">{retiredCount} ({totalAssets > 0 ? Math.round((retiredCount / totalAssets) * 100) : 0}%)</span>
              </div>
              <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                <div 
                  className="bg-slate-400 h-full rounded-full transition-all duration-500" 
                  style={{ width: `${totalAssets > 0 ? (retiredCount / totalAssets) * 100 : 0}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* Category Distribution list */}
          <div className="border-t border-slate-100 pt-4 space-y-3">
            <div>
              <h4 className="text-[10px] font-bold text-slate-400 tracking-wider uppercase">Portfolio by Category</h4>
            </div>
            {categoryStats.length === 0 ? (
              <p className="text-xs text-slate-400 italic text-center py-2">No categories registered yet</p>
            ) : (
              <div className="space-y-2 max-h-[160px] overflow-y-auto pr-1">
                {categoryStats.map(stat => (
                  <div key={stat.name} className="flex justify-between items-center text-xs">
                    <span className="text-slate-500 truncate max-w-[140px] font-medium">{stat.name}</span>
                    <span className="font-mono text-indigo-600 bg-indigo-50/50 border border-indigo-100/30 px-2 py-0.5 rounded text-[11px] font-bold shrink-0">
                      {stat.count} ({stat.percentage}%)
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Recently Added Assets Module */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm lg:col-span-2 flex flex-col">
          <div>
            <h3 className="text-sm font-bold text-slate-800 tracking-tight">Recently Added Assets</h3>
            <p className="text-[11px] text-slate-400">The last 5 catalogued assets in your tracking database</p>
          </div>

          <div className="mt-3 flex-1">
            {recentlyAdded.length === 0 ? (
              <div className="h-full min-h-[220px] flex flex-col items-center justify-center text-center p-6 border border-dashed border-slate-200 rounded-xl">
                <FolderHeart className="w-10 h-10 text-slate-300 mb-2" />
                <p className="text-xs font-semibold text-slate-500">Your asset log is empty</p>
                <p className="text-[11px] text-slate-400 max-w-xs mt-1">Register your first company laptop, vehicle or furniture item to populate this panel.</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {recentlyAdded.map(asset => (
                  <div 
                    key={asset.id} 
                    onClick={() => onViewAsset(asset)}
                    className="py-2.5 flex items-center justify-between hover:bg-slate-50 px-2 rounded-lg cursor-pointer transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="font-mono text-[11px] font-bold text-indigo-600 bg-indigo-50/50 px-2 py-0.5 rounded border border-indigo-100/30">
                        {asset.assetCode}
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-800 group-hover:text-indigo-600 truncate max-w-[160px] sm:max-w-[280px]">
                          {asset.assetName}
                        </p>
                        <p className="text-[10px] text-slate-400 mt-0.5 font-medium">
                          {asset.category} • {asset.location}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 shrink-0">
                      <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                        asset.status === 'Active' 
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' 
                          : asset.status === 'Maintenance' 
                            ? 'bg-amber-50 text-amber-700 border border-amber-100' 
                            : 'bg-slate-100 text-slate-600 border border-slate-200'
                      }`}>
                        {asset.status}
                      </span>
                      <ArrowUpRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-600 transition-colors" />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './components/AuthContext';
import { LoginScreen } from './components/LoginScreen';
import { DashboardStats } from './components/DashboardStats';
import { AssetFormModal } from './components/AssetFormModal';
import { AssetDetailModal } from './components/AssetDetailModal';
import { BarcodeView } from './components/BarcodeView';
import { assetService } from './lib/assetService';
import { Asset, AssetFilters, ASSET_CATEGORIES } from './types';
import { 
  Box, 
  Search, 
  Layers, 
  ShieldCheck, 
  LogOut, 
  SlidersHorizontal, 
  X, 
  FolderPlus, 
  Eye, 
  Edit, 
  Trash2,
  RefreshCw,
  LayoutDashboard,
  ClipboardList,
  Plus
} from 'lucide-react';

function MainAppContent() {
  const { user, logout, loading: authLoading } = useAuth();
  
  // Tab Navigation
  const [activeTab, setActiveTab] = useState<'dashboard' | 'assets'>('dashboard');

  // Asset States
  const [assets, setAssets] = useState<Asset[]>([]);
  const [dbLoading, setDbLoading] = useState<boolean>(true);
  const [dbError, setDbError] = useState<string | null>(null);

  // Modal / Drawer States
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const [editingAsset, setEditingAsset] = useState<Asset | null>(null);

  // Search & Filter States
  const [filters, setFilters] = useState<AssetFilters>({
    searchQuery: '',
    searchField: 'all',
    category: '',
    status: ''
  });
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // 1. Subscribe to Live Asset Stream
  useEffect(() => {
    if (!user) return;

    setDbLoading(true);
    setDbError(null);

    const unsubscribe = assetService.subscribe(
      user.uid,
      user.email,
      !!user.isLocal,
      (updatedAssets) => {
        setAssets(updatedAssets);
        setDbLoading(false);
      },
      (err) => {
        setDbError(err.message || "Failed to load assets from database.");
        setDbLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user]);

  // Handle asset form submission (Create or Update)
  const handleFormSubmit = async (
    data: Omit<Asset, 'id' | 'assetCode' | 'createdBy' | 'createdAt' | 'updatedAt'>
  ) => {
    if (!user) return;

    if (editingAsset) {
      // Edit mode
      await assetService.update(editingAsset.id, !!user.isLocal, data, editingAsset);
      setEditingAsset(null);
    } else {
      // Create mode
      await assetService.create(user.uid, user.email, !!user.isLocal, data);
    }
  };

  // Handle asset deletion
  const handleDeleteAsset = async (assetId: string) => {
    if (!user) return;
    await assetService.delete(assetId, !!user.isLocal);
    if (selectedAsset?.id === assetId) {
      setSelectedAsset(null);
    }
  };

  // Trigger registration modal
  const handleAddAssetClick = () => {
    setEditingAsset(null);
    setIsFormOpen(true);
  };

  // Trigger edit modal
  const handleEditAssetClick = (asset: Asset) => {
    setEditingAsset(asset);
    setIsFormOpen(true);
  };

  // Reset filters helper
  const handleResetFilters = () => {
    setFilters({
      searchQuery: '',
      searchField: 'all',
      category: '',
      status: ''
    });
  };

  // Filtering Logic (Client side for instant feedback)
  const filteredAssets = assets.filter(asset => {
    // 1. Category filter
    if (filters.category && asset.category !== filters.category) {
      return false;
    }

    // 2. Status filter
    if (filters.status && asset.status !== filters.status) {
      return false;
    }

    // 3. Search query filter
    if (filters.searchQuery.trim()) {
      const query = filters.searchQuery.toLowerCase().trim();
      const codeMatches = asset.assetCode.toLowerCase().includes(query);
      const nameMatches = asset.assetName.toLowerCase().includes(query);

      if (filters.searchField === 'code') {
        return codeMatches;
      } else if (filters.searchField === 'name') {
        return nameMatches;
      } else {
        return codeMatches || nameMatches;
      }
    }

    return true;
  });

  if (authLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-100 text-slate-500 font-sans">
        <RefreshCw className="w-8 h-8 animate-spin text-indigo-600 mb-2" />
        <span className="text-sm font-semibold tracking-wide">Securing Portal...</span>
      </div>
    );
  }

  if (!user) {
    return <LoginScreen />;
  }

  return (
    <div className="flex h-screen w-full bg-slate-100 font-sans overflow-hidden text-slate-900">
      
      {/* Sidebar Navigation */}
      <aside className="w-60 bg-slate-900 text-white flex flex-col border-r border-slate-800 shrink-0 hidden md:flex">
        <div className="p-4 border-b border-slate-800 flex items-center gap-3 bg-indigo-600 shrink-0">
          <div className="w-8 h-8 bg-white rounded flex items-center justify-center text-indigo-600">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <span className="font-bold tracking-tight text-lg">ASSETPRO</span>
        </div>

        {/* Sidebar Nav Items */}
        <nav className="flex-1 p-3 space-y-1 text-sm font-medium">
          <button
            onClick={() => setActiveTab('dashboard')}
            id="nav-dashboard-tab"
            className={`w-full flex items-center px-4 py-2.5 rounded-md transition-colors text-left cursor-pointer ${
              activeTab === 'dashboard'
                ? 'bg-slate-800 text-white font-bold'
                : 'text-slate-400 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <LayoutDashboard className="w-4 h-4 mr-3" />
            <span>Dashboard</span>
          </button>
          
          <button
            onClick={() => setActiveTab('assets')}
            id="nav-assets-tab"
            className={`w-full flex items-center px-4 py-2.5 rounded-md transition-colors text-left cursor-pointer ${
              activeTab === 'assets'
                ? 'bg-slate-800 text-white font-bold'
                : 'text-slate-400 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <ClipboardList className="w-4 h-4 mr-3" />
            <span>Inventory Registry</span>
          </button>
        </nav>

        {/* Sidebar Footer User Card */}
        <div className="p-4 border-t border-slate-800 shrink-0">
          <div className="flex items-center gap-3 mb-3">
            {user.photoURL ? (
              <img 
                src={user.photoURL} 
                alt={user.displayName} 
                referrerPolicy="no-referrer"
                className="w-8 h-8 rounded-full border border-slate-700 shadow-sm"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-indigo-500/20 border border-indigo-500/50 flex items-center justify-center text-xs font-bold font-mono text-indigo-300 select-none">
                {user.displayName ? user.displayName.charAt(0).toUpperCase() : 'U'}
              </div>
            )}
            <div className="flex-1 overflow-hidden">
              <p className="text-xs font-semibold text-slate-200 truncate">{user.displayName}</p>
              <p className="text-[9px] text-slate-400 truncate uppercase tracking-widest">
                {user.isLocal ? "Local Personnel" : "Cloud Admin"}
              </p>
            </div>
          </div>
          <button
            onClick={logout}
            id="sidebar-logout-btn"
            className="w-full flex items-center justify-center gap-2 py-1.5 px-3 bg-slate-800 hover:bg-red-950 hover:text-red-200 rounded text-xs font-bold text-slate-300 transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col overflow-hidden pb-16 md:pb-0">
        
        {/* Top Header */}
        <header className="h-14 bg-white border-b border-slate-200 flex items-center justify-between px-6 shrink-0 z-10">
          {/* Logo / Mobile Title */}
          <div className="flex items-center gap-3">
            <div className="p-1.5 bg-indigo-600 rounded text-white md:hidden">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <span className="font-bold tracking-tight text-sm text-slate-900 md:hidden">ASSETPRO</span>
            
            {/* Desktop breadcrumb */}
            <span className="hidden md:block text-xs font-bold text-slate-400 uppercase tracking-widest">
              SYSTEM / {activeTab === 'dashboard' ? 'OVERVIEW' : 'REGISTRY'}
            </span>
          </div>

          {/* Search bar inside header context */}
          <div className="flex-1 hidden md:flex items-center relative mr-6 max-w-md ml-6">
            <Search className="w-4 h-4 absolute left-3 text-slate-400" />
            <input
              type="text"
              placeholder="Search by asset code, serial, or tag..."
              value={filters.searchQuery}
              id="header-search-query-input"
              onChange={(e) => setFilters(prev => ({ ...prev, searchQuery: e.target.value }))}
              className="w-full pl-10 pr-4 py-1.5 bg-slate-100 border-transparent rounded-lg text-xs focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all outline-none text-slate-800"
            />
          </div>

          {/* Header Actions */}
          <div className="flex items-center gap-4">
            <button
              onClick={handleAddAssetClick}
              id="header-add-asset-btn"
              className="hidden md:block bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-1.5 rounded-lg text-xs font-semibold shadow-sm transition-colors cursor-pointer"
            >
              + Add Asset
            </button>

            {/* User Profile / Logout for Mobile view */}
            <div className="md:hidden flex items-center gap-2">
              <button
                onClick={logout}
                className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer"
                title="Sign Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </header>

        {/* Content sheet container */}
        <div className="flex-1 overflow-y-auto bg-slate-100">
          
          {dbError && (
            <div className="m-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-xl flex items-start gap-3 shadow-xs">
              <X className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm text-red-800 font-bold">Database Out of Sync</p>
                <p className="text-xs text-red-600 mt-0.5">{dbError}</p>
              </div>
            </div>
          )}

          {activeTab === 'dashboard' ? (
            <div className="p-6 max-w-7xl mx-auto w-full">
              {dbLoading ? (
                <div className="min-h-[400px] flex flex-col items-center justify-center text-slate-400">
                  <RefreshCw className="w-6 h-6 animate-spin mb-1 text-indigo-600" />
                  <span className="text-xs font-semibold">Aggregating Statistics...</span>
                </div>
              ) : (
                <DashboardStats 
                  assets={assets} 
                  onAddClick={handleAddAssetClick} 
                  onViewAsset={(asset) => {
                    setSelectedAsset(asset);
                    setActiveTab('assets');
                    if (window.innerWidth < 1024) {
                      setIsDetailOpen(true);
                    }
                  }}
                />
              )}
            </div>
          ) : (
            /* Catalog tab layout with split screen view on desktop! */
            <div className="p-6 max-w-7xl mx-auto w-full">
              <div className="grid grid-cols-12 gap-6 items-start">
                
                {/* Left Side: Asset Table list */}
                <div className={`${selectedAsset ? 'col-span-12 lg:col-span-8' : 'col-span-12'} transition-all duration-300 space-y-6`}>
                  
                  {/* Registry filters */}
                  <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-bold text-slate-800">Inventory Registry</h4>
                        {(filters.category || filters.status || filters.searchQuery) && (
                          <span className="bg-indigo-100 text-indigo-700 text-[10px] px-2 py-0.5 rounded-full font-bold">
                            Active
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setShowMobileFilters(!showMobileFilters)}
                          className="sm:hidden px-2.5 py-1 border border-slate-200 rounded text-[10px] text-slate-600 hover:bg-slate-50 font-bold cursor-pointer transition-colors"
                        >
                          {showMobileFilters ? "Hide Filters" : "Show Filters"}
                        </button>
                        <button
                          onClick={handleResetFilters}
                          id="filter-reset-btn"
                          className="px-2.5 py-1 border border-slate-200 rounded text-[10px] text-slate-600 hover:bg-slate-50 font-bold cursor-pointer transition-colors"
                        >
                          Reset Filters
                        </button>
                      </div>
                    </div>

                    <div className={`${showMobileFilters ? 'block space-y-3' : 'hidden sm:grid'} grid grid-cols-1 sm:grid-cols-3 gap-3 transition-all duration-200`}>
                      {/* Integrated Mobile search term */}
                      <div className="md:hidden relative col-span-1 sm:col-span-3">
                        <Search className="absolute left-2.5 inset-y-0 my-auto text-slate-400 w-3.5 h-3.5" />
                        <input
                          type="text"
                          value={filters.searchQuery}
                          id="search-query-input"
                          onChange={(e) => setFilters(prev => ({ ...prev, searchQuery: e.target.value }))}
                          placeholder="Search barcode or asset name..."
                          className="pl-8 w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs outline-none focus:bg-white focus:ring-1 focus:ring-indigo-500 text-slate-800"
                        />
                      </div>

                      {/* Category field */}
                      <div>
                        <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">Category</label>
                        <select
                          value={filters.category}
                          id="filter-category-select"
                          onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
                          className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg text-xs bg-white text-slate-800"
                        >
                          <option value="">All Categories</option>
                          {ASSET_CATEGORIES.map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                          ))}
                        </select>
                      </div>

                      {/* Status field */}
                      <div>
                        <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">Lifecycle Status</label>
                        <select
                          value={filters.status}
                          id="filter-status-select"
                          onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                          className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg text-xs bg-white text-slate-800"
                        >
                          <option value="">All Statuses</option>
                          <option value="Active">Active / In Use</option>
                          <option value="Maintenance">In Maintenance</option>
                          <option value="Retired">Retired</option>
                        </select>
                      </div>

                      {/* Scope selection */}
                      <div className="hidden md:block">
                        <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">Filter Search Fields</label>
                        <select
                          value={filters.searchField}
                          id="search-field-select"
                          onChange={(e) => setFilters(prev => ({ ...prev, searchField: e.target.value as any }))}
                          className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg text-xs bg-white text-slate-800"
                        >
                          <option value="all">Search Code & Name</option>
                          <option value="code">Search Code Only</option>
                          <option value="name">Search Name Only</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* High Density Registry Table */}
                  <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
                    {dbLoading ? (
                      <div className="min-h-[300px] flex flex-col items-center justify-center text-slate-400 py-12">
                        <RefreshCw className="w-6 h-6 animate-spin mb-1 text-indigo-600" />
                        <span className="text-xs font-semibold">Retrieving assets...</span>
                      </div>
                    ) : filteredAssets.length === 0 ? (
                      <div className="min-h-[260px] flex flex-col items-center justify-center text-center p-8 bg-white py-16">
                        <Box className="w-10 h-10 text-slate-300 mb-2" />
                        <p className="text-sm font-semibold text-slate-500">No assets matching these filter filters</p>
                        <p className="text-xs text-slate-400 mt-1 max-w-sm">
                          Register a new company asset or clear filter parameters to populate results.
                        </p>
                      </div>
                    ) : (
                      <>
                        {/* Mobile Grid/Card List */}
                        <div className="block sm:hidden divide-y divide-slate-100 max-h-[60vh] overflow-y-auto">
                          {filteredAssets.map(asset => {
                            const isSelected = selectedAsset?.id === asset.id;
                            return (
                              <div
                                key={asset.id}
                                onClick={() => {
                                  setSelectedAsset(asset);
                                  setIsDetailOpen(true);
                                }}
                                className={`p-4 active:bg-slate-100 transition-colors cursor-pointer ${
                                  isSelected ? 'bg-indigo-50/40' : ''
                                }`}
                              >
                                <div className="flex justify-between items-start mb-1.5">
                                  <div>
                                    <h5 className="font-bold text-slate-800 text-xs leading-tight">{asset.assetName}</h5>
                                    <p className="text-[9px] font-mono text-indigo-600 font-semibold mt-0.5">{asset.assetCode}</p>
                                  </div>
                                  <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${
                                    asset.status === 'Active' 
                                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' 
                                      : asset.status === 'Maintenance' 
                                        ? 'bg-amber-50 text-amber-700 border border-amber-100' 
                                        : 'bg-slate-100 text-slate-700 border border-slate-200'
                                  }`}>
                                    {asset.status}
                                  </span>
                                </div>
                                
                                <div className="flex justify-between items-center text-[10px] text-slate-500 font-semibold">
                                  <span>{asset.category} • {asset.location}</span>
                                  <span className="font-mono font-bold text-slate-800">
                                    ${asset.purchaseCost.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                  </span>
                                </div>
                              </div>
                            );
                          })}
                        </div>

                        {/* High Density Desktop Table */}
                        <div className="hidden sm:block overflow-x-auto">
                          <table className="w-full text-left">
                            <thead className="bg-slate-50 sticky top-0 border-b border-slate-100">
                              <tr className="text-[10px] uppercase text-slate-500 font-bold">
                                <th className="px-4 py-3">Asset Code</th>
                                <th className="px-4 py-3">Asset Name</th>
                                <th className="px-4 py-3">Category</th>
                                <th className="px-4 py-3">Status</th>
                                <th className="px-4 py-3">Location</th>
                                <th className="px-4 py-3 text-right">Cost</th>
                              </tr>
                            </thead>
                            <tbody className="text-xs divide-y divide-slate-100">
                              {filteredAssets.map(asset => {
                                const isSelected = selectedAsset?.id === asset.id;
                                return (
                                  <tr 
                                    key={asset.id} 
                                    onClick={() => {
                                      setSelectedAsset(asset);
                                      if (window.innerWidth < 1024) {
                                        setIsDetailOpen(true);
                                      }
                                    }}
                                    className={`border-b border-slate-50 hover:bg-slate-50 transition-colors cursor-pointer group ${
                                      isSelected ? 'bg-indigo-50/50 hover:bg-indigo-50 font-medium' : ''
                                    }`}
                                  >
                                    <td className="px-4 py-3 font-mono text-indigo-600 font-semibold">{asset.assetCode}</td>
                                    <td className="px-4 py-3 font-medium text-slate-800 truncate max-w-[150px]">{asset.assetName}</td>
                                    <td className="px-4 py-3 text-slate-500">{asset.category}</td>
                                    <td className="px-4 py-3">
                                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                                        asset.status === 'Active' 
                                          ? 'bg-emerald-100 text-emerald-700' 
                                          : asset.status === 'Maintenance' 
                                            ? 'bg-amber-100 text-amber-700' 
                                            : 'bg-slate-200 text-slate-700'
                                      }`}>
                                        {asset.status}
                                      </span>
                                    </td>
                                    <td className="px-4 py-3 text-slate-500 truncate max-w-[120px]">{asset.location}</td>
                                    <td className="px-4 py-3 text-right font-mono font-semibold text-slate-800">
                                      ${asset.purchaseCost.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                    </td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>

                        {/* Bottom Total Summary bar */}
                        <div className="bg-slate-50 px-4 py-3 border-t border-slate-100 flex justify-between items-center text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                          <span>Displaying {filteredAssets.length} of {assets.length} Assets</span>
                          <span className="text-slate-900">Filtered Valuation: ${
                            filteredAssets.reduce((sum, a) => sum + (Number(a.purchaseCost) || 0), 0).toLocaleString(undefined, { minimumFractionDigits: 2 })
                          }</span>
                        </div>
                      </>
                    )}
                  </div>

                </div>

                {/* Right Side: Selected Asset Card (High Density Split View) */}
                {selectedAsset && (
                  <div className="col-span-12 lg:col-span-4 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col self-start">
                    
                    {/* Header Block */}
                    <div className="bg-indigo-50 p-5 flex flex-col items-center border-b border-indigo-100 relative">
                      <button
                        onClick={() => setSelectedAsset(null)}
                        className="absolute top-4 right-4 p-1 text-indigo-600 hover:bg-indigo-100 rounded-full transition-colors cursor-pointer"
                        title="Close Detail Pane"
                      >
                        <X className="w-4 h-4" />
                      </button>

                      <div className="w-full flex justify-between items-center mb-3">
                        <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest">Selected Asset Card</span>
                      </div>

                      {/* Scaled Barcode View inside high-density box */}
                      <BarcodeView 
                        value={selectedAsset.assetCode} 
                        assetName={selectedAsset.assetName} 
                        category={selectedAsset.category}
                        className="w-full bg-white rounded shadow-sm border border-slate-100" 
                        showText={true}
                      />
                    </div>

                    {/* Metadata details list */}
                    <div className="p-5 flex-1 overflow-auto text-xs space-y-3.5">
                      <div>
                        <p className="text-slate-400 font-semibold uppercase text-[9px] tracking-wider mb-0.5">Asset Name</p>
                        <p className="text-slate-800 font-bold text-sm leading-tight">{selectedAsset.assetName}</p>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-slate-400 font-semibold uppercase text-[9px] tracking-wider mb-0.5">Manufacturer</p>
                          <p className="text-slate-800 font-bold">{selectedAsset.brand || '—'}</p>
                        </div>
                        <div>
                          <p className="text-slate-400 font-semibold uppercase text-[9px] tracking-wider mb-0.5">Serial Number</p>
                          <p className="text-slate-800 font-bold font-mono truncate">{selectedAsset.serialNumber || '—'}</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 pt-3 border-t border-slate-100">
                        <div>
                          <p className="text-slate-400 font-semibold uppercase text-[9px] tracking-wider mb-0.5">Purchase Cost</p>
                          <p className="text-slate-800 font-bold">
                            ${selectedAsset.purchaseCost.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </p>
                        </div>
                        <div>
                          <p className="text-slate-400 font-semibold uppercase text-[9px] tracking-wider mb-0.5">Department</p>
                          <p className="text-slate-800 font-bold">{selectedAsset.department}</p>
                        </div>
                      </div>

                      <div className="pt-3 border-t border-slate-100">
                        <p className="text-slate-400 font-semibold uppercase text-[9px] tracking-wider mb-0.5">Physical Location</p>
                        <p className="text-slate-800 font-bold">{selectedAsset.location}</p>
                      </div>

                      <div className="pt-3 border-t border-slate-100">
                        <p className="text-slate-400 font-semibold uppercase text-[9px] tracking-wider mb-0.5">Technical Specs & Notes</p>
                        <p className="text-slate-600 italic leading-relaxed">
                          {selectedAsset.description || "No supplementary specifications or logs filed for this asset registry sheet."}
                        </p>
                      </div>

                      {/* Actions */}
                      <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
                        <button
                          onClick={() => handleDeleteAsset(selectedAsset.id)}
                          className="text-rose-600 font-bold px-3 py-1.5 hover:bg-rose-50 text-xs transition-colors rounded cursor-pointer"
                        >
                          Delete
                        </button>
                        <button
                          onClick={() => handleEditAssetClick(selectedAsset)}
                          className="bg-slate-100 text-slate-800 hover:bg-slate-200 font-bold px-3 py-1.5 rounded text-xs transition-colors cursor-pointer"
                        >
                          Edit Details
                        </button>
                      </div>
                    </div>
                  </div>
                )}

              </div>
            </div>
          )}

        </div>

        {/* Footer / Status Bar */}
        <footer className="h-6 bg-slate-50 border-t border-slate-200 px-4 flex items-center justify-between shrink-0 hidden md:flex">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
              <span className="text-[9px] text-slate-500 font-medium uppercase tracking-tight">System Online</span>
            </div>
            <div className="h-3 w-[1px] bg-slate-300"></div>
            <span className="text-[9px] text-slate-500 font-medium uppercase tracking-tight">
              Database: {user.isLocal ? "Postgres-Local" : "Postgres-Live"}
            </span>
          </div>
          <span className="text-[9px] text-slate-400">v2.4.1-Stable | &copy; 2026 Enterprise Asset Solutions</span>
        </footer>

      </main>

      {/* Floating Action Button (FAB) on Mobile */}
      <button
        onClick={handleAddAssetClick}
        title="Register New Asset"
        className="md:hidden fixed bottom-20 right-4 z-20 w-12 h-12 bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white rounded-full shadow-lg flex items-center justify-center cursor-pointer transition-all duration-200"
      >
        <Plus className="w-5 h-5" />
      </button>

      {/* Mobile Bottom Navigation Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-white border-t border-slate-200 flex items-center justify-around px-4 z-20 shadow-lg">
        <button
          onClick={() => {
            setActiveTab('dashboard');
            setSelectedAsset(null);
          }}
          className={`flex flex-col items-center justify-center flex-1 py-1 transition-all cursor-pointer ${
            activeTab === 'dashboard' ? 'text-indigo-600' : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          <LayoutDashboard className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] font-bold tracking-tight">Dashboard</span>
        </button>

        <button
          onClick={() => {
            setActiveTab('assets');
          }}
          className={`flex flex-col items-center justify-center flex-1 py-1 transition-all cursor-pointer ${
            activeTab === 'assets' ? 'text-indigo-600' : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          <ClipboardList className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] font-bold tracking-tight">Inventory</span>
        </button>
        
        {/* Mobile profile card/icon */}
        <div className="flex flex-col items-center justify-center flex-1 py-1">
          {user.photoURL ? (
            <img 
              src={user.photoURL} 
              alt={user.displayName || 'User'} 
              referrerPolicy="no-referrer"
              className="w-5 h-5 rounded-full border border-slate-200"
            />
          ) : (
            <div className="w-5 h-5 rounded-full bg-indigo-100 flex items-center justify-center text-[9px] font-bold text-indigo-700">
              {user.displayName ? user.displayName.charAt(0).toUpperCase() : 'U'}
            </div>
          )}
          <span className="text-[9px] text-slate-400 font-semibold truncate max-w-[60px]">{user.displayName?.split(' ')[0] || 'User'}</span>
        </div>
      </nav>

      {/* Shared Modals */}
      <AssetFormModal
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingAsset(null);
        }}
        onSubmit={handleFormSubmit}
        editingAsset={editingAsset || undefined}
      />

      <AssetDetailModal
        asset={selectedAsset}
        isOpen={isDetailOpen}
        onClose={() => {
          setIsDetailOpen(false);
          setSelectedAsset(null);
        }}
        onEditClick={(asset) => {
          handleEditAssetClick(asset);
        }}
        onDeleteConfirm={handleDeleteAsset}
      />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainAppContent />
    </AuthProvider>
  );
}

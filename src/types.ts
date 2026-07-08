export interface UserSession {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  isLocal?: boolean; // True if logged in via local credentials rather than Google
}

export type AssetStatus = 'Active' | 'Maintenance' | 'Retired';

export interface Asset {
  id: string; // Firestore document ID
  assetCode: string; // Auto-generated unique code
  assetName: string;
  category: string;
  brand: string;
  model: string;
  serialNumber: string;
  purchaseDate: string;
  purchaseCost: number;
  department: string;
  location: string;
  status: AssetStatus;
  description: string;
  createdBy: string; // User email or uid
  createdAt: string; // ISO date-time string
  updatedAt: string; // ISO date-time string
}

export interface AssetFilters {
  searchQuery: string;
  searchField: 'all' | 'code' | 'name';
  category: string;
  status: string;
}

export const ASSET_CATEGORIES = [
  'IT Equipment',
  'Furniture & Fixtures',
  'Vehicles',
  'Machinery & Tools',
  'Office Supplies',
  'Facilities & Security',
  'Software Licenses',
  'Other'
];

export const DEPARTMENTS = [
  'Information Technology',
  'Human Resources',
  'Finance & Accounting',
  'Operations',
  'Marketing & Sales',
  'Research & Development',
  'Legal & Compliance',
  'Administration'
];

export const LOCATIONS = [
  'Headquarters - Main Server Room',
  'Headquarters - Floor 1',
  'Headquarters - Floor 2',
  'Branch Office - West',
  'Branch Office - East',
  'Warehouse A',
  'Warehouse B',
  'Remote Office',
  'In Transit'
];

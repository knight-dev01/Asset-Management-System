import { 
  collection, 
  doc, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  onSnapshot, 
  query, 
  where, 
  serverTimestamp, 
  getDocs,
  Timestamp
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from './firebase';
import { Asset, AssetFilters, AssetStatus } from '../types';

// Helper to map category to professional prefix
export function getCategoryPrefix(category: string): string {
  const map: Record<string, string> = {
    'IT Equipment': 'IT',
    'Furniture & Fixtures': 'FF',
    'Vehicles': 'VH',
    'Machinery & Tools': 'MT',
    'Office Supplies': 'OS',
    'Facilities & Security': 'FS',
    'Software Licenses': 'SL',
    'Other': 'OT'
  };
  return map[category] || 'GEN';
}

// Helper to auto-generate a highly realistic Asset Code
export function generateAssetCode(category: string): string {
  const prefix = getCategoryPrefix(category);
  const year = new Date().getFullYear();
  const randomNum = Math.floor(1000 + Math.random() * 9000); // 4-digit random number
  return `AST-${prefix}-${year}-${randomNum}`;
}

// -------------------------------------------------------------
// Local Storage Persistence (for Local Credentials Users)
// -------------------------------------------------------------
const LOCAL_ASSETS_KEY = 'asset_mgmt_local_assets';

function getLocalAssets(): Asset[] {
  const assetsStr = localStorage.getItem(LOCAL_ASSETS_KEY);
  if (!assetsStr) return [];
  try {
    return JSON.parse(assetsStr);
  } catch (err) {
    console.error("Failed to parse local assets", err);
    return [];
  }
}

function saveLocalAssets(assets: Asset[]) {
  localStorage.setItem(LOCAL_ASSETS_KEY, JSON.stringify(assets));
}

// -------------------------------------------------------------
// Unified Service layer (Durable Cloud + Fast Local Fallback)
// -------------------------------------------------------------
export const assetService = {
  // 1. Create Asset
  async create(
    userUid: string, 
    userEmail: string,
    isLocal: boolean,
    data: Omit<Asset, 'id' | 'assetCode' | 'createdBy' | 'createdAt' | 'updatedAt'>
  ): Promise<string> {
    const assetCode = generateAssetCode(data.category);
    const nowStr = new Date().toISOString();

    if (isLocal) {
      // Local Database Flow
      const localAssets = getLocalAssets();
      const newId = `local_asset_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`;
      const newAsset: Asset = {
        ...data,
        id: newId,
        assetCode,
        createdBy: userEmail,
        createdAt: nowStr,
        updatedAt: nowStr
      };
      localAssets.unshift(newAsset);
      saveLocalAssets(localAssets);
      return newId;
    } else {
      // Cloud Firestore Flow (Native Auth)
      const assetsCollection = 'assets';
      const newDocRef = doc(collection(db, assetsCollection));
      const assetId = newDocRef.id;

      const payload = {
        assetCode,
        assetName: data.assetName,
        category: data.category,
        brand: data.brand,
        model: data.model,
        serialNumber: data.serialNumber,
        purchaseDate: data.purchaseDate,
        purchaseCost: Number(data.purchaseCost),
        department: data.department,
        location: data.location,
        status: data.status,
        description: data.description,
        createdBy: userUid,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };

      try {
        await setDoc(newDocRef, payload);
        return assetId;
      } catch (err) {
        handleFirestoreError(err, OperationType.CREATE, `${assetsCollection}/${assetId}`);
      }
    }
  },

  // 2. Update Asset
  async update(
    assetId: string,
    isLocal: boolean,
    data: Omit<Asset, 'id' | 'assetCode' | 'createdBy' | 'createdAt' | 'updatedAt'>,
    originalAsset: Asset
  ): Promise<void> {
    const nowStr = new Date().toISOString();

    if (isLocal) {
      // Local Database Flow
      const localAssets = getLocalAssets();
      const updatedAssets = localAssets.map(asset => {
        if (asset.id === assetId) {
          return {
            ...asset,
            ...data,
            updatedAt: nowStr
          };
        }
        return asset;
      });
      saveLocalAssets(updatedAssets);
    } else {
      // Cloud Firestore Flow
      const assetsCollection = 'assets';
      const docRef = doc(db, assetsCollection, assetId);

      const payload = {
        assetCode: originalAsset.assetCode, // Immutable
        assetName: data.assetName,
        category: data.category,
        brand: data.brand,
        model: data.model,
        serialNumber: data.serialNumber,
        purchaseDate: data.purchaseDate,
        purchaseCost: Number(data.purchaseCost),
        department: data.department,
        location: data.location,
        status: data.status,
        description: data.description,
        createdBy: originalAsset.createdBy, // Immutable
        createdAt: originalAsset.createdAt ? Timestamp.fromDate(new Date(originalAsset.createdAt)) : serverTimestamp(), // Immutable
        updatedAt: serverTimestamp()
      };

      try {
        await setDoc(docRef, payload);
      } catch (err) {
        handleFirestoreError(err, OperationType.UPDATE, `${assetsCollection}/${assetId}`);
      }
    }
  },

  // 3. Delete Asset
  async delete(assetId: string, isLocal: boolean): Promise<void> {
    if (isLocal) {
      // Local Database Flow
      const localAssets = getLocalAssets();
      const filtered = localAssets.filter(asset => asset.id !== assetId);
      saveLocalAssets(filtered);
    } else {
      // Cloud Firestore Flow
      const assetsCollection = 'assets';
      const docRef = doc(db, assetsCollection, assetId);

      try {
        await deleteDoc(docRef);
      } catch (err) {
        handleFirestoreError(err, OperationType.DELETE, `${assetsCollection}/${assetId}`);
      }
    }
  },

  // 4. Read Assets (Subscription or Query)
  subscribe(
    userUid: string, 
    userEmail: string,
    isLocal: boolean, 
    onUpdate: (assets: Asset[]) => void,
    onError?: (error: Error) => void
  ): () => void {
    if (isLocal) {
      // Return local assets initial sync and simulate a reactive change handler
      const syncLocal = () => {
        const assets = getLocalAssets();
        // Filter local assets so users only see their own local assets
        const filtered = assets.filter(a => a.createdBy === userEmail);
        onUpdate(filtered);
      };
      
      syncLocal();

      // Listen to window storage events to update reactively if changed in another tab/component
      const handleStorageChange = (e: StorageEvent) => {
        if (e.key === LOCAL_ASSETS_KEY) {
          syncLocal();
        }
      };

      window.addEventListener('storage', handleStorageChange);
      
      // Return unsubscribe cleanup function
      return () => {
        window.removeEventListener('storage', handleStorageChange);
      };
    } else {
      // Subscribe to live Firestore assets collection
      const assetsCollection = 'assets';
      
      // Enforce security context - only fetch assets belonging to this logged-in user
      const q = query(
        collection(db, assetsCollection),
        where('createdBy', '==', userUid)
      );

      const unsubscribe = onSnapshot(q, (snapshot) => {
        const assetsList: Asset[] = [];
        snapshot.forEach((docSnap) => {
          const data = docSnap.data();
          
          // Map Firestore timestamp objects back to ISO strings for application state
          let createdAtISO = new Date().toISOString();
          let updatedAtISO = new Date().toISOString();

          if (data.createdAt && typeof data.createdAt.toDate === 'function') {
            createdAtISO = data.createdAt.toDate().toISOString();
          } else if (data.createdAt?.seconds) {
            createdAtISO = new Date(data.createdAt.seconds * 1000).toISOString();
          }

          if (data.updatedAt && typeof data.updatedAt.toDate === 'function') {
            updatedAtISO = data.updatedAt.toDate().toISOString();
          } else if (data.updatedAt?.seconds) {
            updatedAtISO = new Date(data.updatedAt.seconds * 1000).toISOString();
          }

          assetsList.push({
            id: docSnap.id,
            assetCode: data.assetCode || '',
            assetName: data.assetName || '',
            category: data.category || '',
            brand: data.brand || '',
            model: data.model || '',
            serialNumber: data.serialNumber || '',
            purchaseDate: data.purchaseDate || '',
            purchaseCost: Number(data.purchaseCost || 0),
            department: data.department || '',
            location: data.location || '',
            status: data.status || 'Active',
            description: data.description || '',
            createdBy: data.createdBy || '',
            createdAt: createdAtISO,
            updatedAt: updatedAtISO
          });
        });

        // Stagger sorting: sort newly added at the top
        assetsList.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        onUpdate(assetsList);
      }, (err) => {
        console.error("Firestore onSnapshot error", err);
        if (onError) {
          try {
            handleFirestoreError(err, OperationType.LIST, assetsCollection);
          } catch (mappedErr: any) {
            onError(mappedErr);
          }
        }
      });

      return unsubscribe;
    }
  }
};

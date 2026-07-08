import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  signInWithPopup, 
  GoogleAuthProvider, 
  signOut, 
  onAuthStateChanged,
  User as FirebaseUser
} from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db, hashPassword, handleFirestoreError, OperationType } from '../lib/firebase';
import { UserSession } from '../types';

interface AuthContextType {
  user: UserSession | null;
  loading: boolean;
  loginWithGoogle: () => Promise<void>;
  loginWithEmail: (email: string, password: string) => Promise<void>;
  registerWithEmail: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  error: string | null;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserSession | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Sync session with LocalStorage or Firebase
  useEffect(() => {
    // 1. Check if there is a local custom credentials session
    const savedSession = localStorage.getItem('asset_mgmt_session');
    if (savedSession) {
      try {
        const sessionData = JSON.parse(savedSession) as UserSession;
        setUser(sessionData);
        setLoading(false);
        return;
      } catch (err) {
        localStorage.removeItem('asset_mgmt_session');
      }
    }

    // 2. Otherwise, listen to Firebase Auth State (Google Sign-In)
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
      if (firebaseUser) {
        const userSession: UserSession = {
          uid: firebaseUser.uid,
          email: firebaseUser.email || '',
          displayName: firebaseUser.displayName || 'Google User',
          photoURL: firebaseUser.photoURL || undefined,
          isLocal: false
        };

        // Save/Sync Google User profile to Firestore `/users/{uid}`
        try {
          const userDocRef = doc(db, 'users', firebaseUser.uid);
          const userDoc = await getDoc(userDocRef);
          if (!userDoc.exists()) {
            await setDoc(userDocRef, {
              email: userSession.email,
              name: userSession.displayName,
              createdAt: serverTimestamp()
            });
          }
        } catch (err) {
          console.warn("Could not sync Google profile to Firestore users collection", err);
          // Non-blocking for the UI, continue session
        }

        setUser(userSession);
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const loginWithGoogle = async () => {
    setLoading(true);
    setError(null);
    try {
      const provider = new GoogleAuthProvider();
      // Force pop-up login as requested for preview environments
      await signInWithPopup(auth, provider);
    } catch (err: any) {
      console.error("Google sign in error: ", err);
      setError(err.message || "Failed to sign in with Google.");
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const registerWithEmail = async (name: string, email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      const cleanEmail = email.trim().toLowerCase();
      
      // Check if email already registered in local database
      const usersKey = 'asset_mgmt_local_users';
      const localUsersStr = localStorage.getItem(usersKey) || '[]';
      const localUsers = JSON.parse(localUsersStr) as Array<{ name: string; email: string; passwordHash: string }>;
      
      if (localUsers.some(u => u.email === cleanEmail)) {
        throw new Error("An account with this email already exists.");
      }

      // Hash password using browser-side SHA-256 as required
      const passwordHash = await hashPassword(password);

      // Save user to local storage mock database
      const newUserRecord = { name, email: cleanEmail, passwordHash };
      localUsers.push(newUserRecord);
      localStorage.setItem(usersKey, JSON.stringify(localUsers));

      // Auto login after registration
      const session: UserSession = {
        uid: `local_${cleanEmail.replace(/[^a-zA-Z0-9]/g, '_')}`,
        email: cleanEmail,
        displayName: name,
        isLocal: true
      };

      localStorage.setItem('asset_mgmt_session', JSON.stringify(session));
      setUser(session);
    } catch (err: any) {
      console.error("Register error: ", err);
      setError(err.message || "Registration failed.");
    } finally {
      setLoading(false);
    }
  };

  const loginWithEmail = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      const cleanEmail = email.trim().toLowerCase();
      
      const usersKey = 'asset_mgmt_local_users';
      const localUsersStr = localStorage.getItem(usersKey) || '[]';
      const localUsers = JSON.parse(localUsersStr) as Array<{ name: string; email: string; passwordHash: string }>;

      const targetUser = localUsers.find(u => u.email === cleanEmail);
      if (!targetUser) {
        throw new Error("Invalid email or password.");
      }

      // Hashing the input password to compare with the stored SHA-256 hash
      const inputHash = await hashPassword(password);
      if (targetUser.passwordHash !== inputHash) {
        throw new Error("Invalid email or password.");
      }

      // Set custom session
      const session: UserSession = {
        uid: `local_${cleanEmail.replace(/[^a-zA-Z0-9]/g, '_')}`,
        email: cleanEmail,
        displayName: targetUser.name,
        isLocal: true
      };

      localStorage.setItem('asset_mgmt_session', JSON.stringify(session));
      setUser(session);
    } catch (err: any) {
      console.error("Login error: ", err);
      setError(err.message || "Login failed.");
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      if (user && !user.isLocal) {
        await signOut(auth);
      } else {
        localStorage.removeItem('asset_mgmt_session');
      }
      setUser(null);
    } catch (err: any) {
      console.error("Logout error: ", err);
      setError("Failed to sign out correctly.");
    } finally {
      setLoading(false);
    }
  };

  const clearError = () => setError(null);

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      loginWithGoogle,
      loginWithEmail,
      registerWithEmail,
      logout,
      error,
      clearError
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

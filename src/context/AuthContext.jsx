import React, { createContext, useState, useContext, useEffect } from 'react';
import { 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  getIdTokenResult,
} from 'firebase/auth';
import { auth } from '../utils/firebase';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAdminClaim, setIsAdminClaim] = useState(false);
  const ADMIN_ALLOWLIST = (import.meta.env.VITE_ADMIN_ALLOWLIST || '').split(',').map(s => s.trim()).filter(Boolean);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      if (user) {
        try {
          const tokenRes = await getIdTokenResult(user, false);
          setIsAdminClaim(Boolean(tokenRes.claims?.admin));
        } catch (err) {
          console.error('getIdTokenResult error', err);
          setIsAdminClaim(false);
        }
      } else {
        setIsAdminClaim(false);
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const login = async (email, password) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      const signedEmail = auth.currentUser?.email || auth.currentUser?.providerData?.[0]?.email;
      console.log('login: success', signedEmail);
      // enforce allowlist if configured
      if (ADMIN_ALLOWLIST.length > 0 && !ADMIN_ALLOWLIST.includes(signedEmail)) {
        await signOut(auth);
        toast.error('This account is not authorized to access the dashboard');
        console.warn('Unauthorized login attempt:', signedEmail);
        return false;
      }
      toast.success('Login successful');
      return true;
    } catch (error) {
      console.error('login error', error);
      toast.error(error.message || error.code || 'Login failed');
      return false;
    }
  };

  const googleProvider = new GoogleAuthProvider();

  const loginWithGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      const signedEmail = auth.currentUser?.email || auth.currentUser?.providerData?.[0]?.email;
      console.log('loginWithGoogle: success', signedEmail);
      if (ADMIN_ALLOWLIST.length > 0 && !ADMIN_ALLOWLIST.includes(signedEmail)) {
        await signOut(auth);
        toast.error('This Google account is not authorized to access the dashboard');
        console.warn('Unauthorized Google login attempt:', signedEmail);
        return false;
      }
      toast.success('Login successful');
      return true;
    } catch (error) {
      console.error('loginWithGoogle error', error);
      toast.error(error.message || error.code || 'Google sign-in failed');
      return false;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      toast.success('Logged out');
    } catch (error) {
      toast.error(error.message);
    }
  };

  const value = {
    user,
    login,
    loginWithGoogle,
    // client-side allowlist helper (keeps backward compatibility)
    isAdmin: (allowedEmails = []) => {
      if (!auth.currentUser) return false;
      const email = auth.currentUser.email || auth.currentUser.providerData?.[0]?.email;
      return allowedEmails.includes(email);
    },
    // server-side admin claim (set via Firebase Admin SDK)
    isAdminClaim,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
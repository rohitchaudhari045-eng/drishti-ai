import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut as firebaseSignOut, 
  onAuthStateChanged,
  updateProfile
} from 'firebase/auth';
import { auth, db, isFirebaseConfigured } from '../lib/firebase';
import { createUserProfileIfMissing } from '../lib/firestoreService';

const AuthContext = createContext(null);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// Convert Firebase auth error codes into friendly user messages
export function formatAuthError(error) {
  if (!error) return '';
  const code = error.code || '';
  
  switch (code) {
    case 'auth/email-already-in-use':
      return 'An account with this email already exists. Please sign in instead.';
    case 'auth/invalid-email':
      return 'Please enter a valid email address.';
    case 'auth/weak-password':
      return 'Password is too weak. Please choose at least 6 characters.';
    case 'auth/user-not-found':
      return 'No account found with this email. Please sign up.';
    case 'auth/wrong-password':
    case 'auth/invalid-credential':
      return 'Invalid email or password. Please verify your credentials and try again.';
    case 'auth/user-disabled':
      return 'This user account has been disabled. Please contact support.';
    case 'auth/too-many-requests':
      return 'Access to this account has been temporarily disabled due to many failed login attempts. You can try again later.';
    case 'auth/network-request-failed':
      return 'Network connection failed. Please check your internet connection.';
    case 'auth/operation-not-allowed':
      return 'Email/Password sign-in is not enabled in Firebase Console. Please enable it under Authentication > Sign-in method.';
    case 'auth/invalid-api-key':
      return 'Firebase API key is invalid or missing in .env. Please check your configuration.';
    default:
      if (error.message && error.message.includes('Firebase Auth is not initialized')) {
        return 'Firebase is not yet configured. Please add your Firebase credentials to the .env file and restart the dev server.';
      }
      return error.message || 'An unexpected authentication error occurred. Please try again.';
  }
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const isConfigured = isFirebaseConfigured();

  useEffect(() => {
    if (!auth) {
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      setLoading(false);

      if (user && db) {
        try {
          await createUserProfileIfMissing(user.uid, {
            email: user.email,
            displayName: user.displayName || user.email?.split('@')[0]
          });
        } catch (err) {
          console.warn('[DRISHTI AI] Profile sync notice:', err?.message || err);
        }
      }
    }, (error) => {
      console.error('[DRISHTI AI] Auth state change error:', error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signUp = async (email, password, displayName = '') => {
    if (!auth) throw new Error('Firebase Auth is not initialized. Please configure your .env file.');
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    if (displayName && userCredential.user) {
      try {
        await updateProfile(userCredential.user, { displayName });
        // Refresh local user state
        setCurrentUser({ ...userCredential.user, displayName });
      } catch (profileErr) {
        console.warn('Profile name update skipped:', profileErr);
      }
    }

    if (userCredential.user && db) {
      try {
        await createUserProfileIfMissing(userCredential.user.uid, {
          email,
          displayName
        });
      } catch (profileErr) {
        console.warn('Firestore initial profile creation notice:', profileErr);
      }
    }

    return userCredential.user;
  };

  const signIn = async (email, password) => {
    if (!auth) throw new Error('Firebase Auth is not initialized. Please configure your .env file.');
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  };

  const logOut = async () => {
    if (!auth) return;
    await firebaseSignOut(auth);
  };

  const value = {
    currentUser,
    loading,
    isConfigured,
    signUp,
    signIn,
    logOut
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

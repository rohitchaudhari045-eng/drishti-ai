import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || '',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || '',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || '',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '',
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || ''
};

// Helper to check if Firebase is configured with actual credentials
export const isFirebaseConfigured = () => {
  return Boolean(
    firebaseConfig.apiKey &&
    firebaseConfig.apiKey.trim() !== '' &&
    firebaseConfig.apiKey !== 'your_firebase_api_key_here' &&
    firebaseConfig.projectId &&
    firebaseConfig.projectId.trim() !== '' &&
    firebaseConfig.projectId !== 'your_project_id'
  );
};

// Initialize Firebase App singleton safely
let app = null;
let auth = null;
let db = null;

if (isFirebaseConfigured()) {
  try {
    if (getApps().length === 0) {
      app = initializeApp(firebaseConfig);
    } else {
      app = getApp();
    }
    auth = getAuth(app);
    db = getFirestore(app);
  } catch (error) {
    console.warn('[DRISHTI AI] Firebase initialization warning:', error?.message || error);
    auth = null;
    db = null;
  }
}

export { app, auth, db, firebaseConfig };
export default auth;

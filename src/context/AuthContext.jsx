import { createContext, useState, useEffect, useCallback } from 'react';
import {
  signInWithEmail,
  registerWithEmail,
  signInWithGoogle,
  signOutUser,
  resetPassword as fbResetPassword,
  onAuthChange,
} from '@/firebase/auth';
import { getUserProfile, createUserProfile } from '@/firebase/users';

export const AuthContext = createContext(null);

/**
 * AuthProvider wraps the app and provides authentication state + actions.
 * Persists sessions via Firebase onAuthStateChanged.
 * Automatically creates a Firestore user profile on first login.
 */
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthChange(async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        try {
          let profile = await getUserProfile(firebaseUser.uid);
          if (!profile) {
            // First-time login: create Firestore profile
            const newProfile = {
              uid: firebaseUser.uid,
              name: firebaseUser.displayName || 'User',
              email: firebaseUser.email,
              photo: firebaseUser.photoURL || '',
              favorites: [],
              role: 'user',
            };
            await createUserProfile(newProfile);
            profile = newProfile;
          }
          setUserProfile(profile);
        } catch (error) {
          console.error('Error loading user profile:', error);
        }
      } else {
        setUser(null);
        setUserProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = useCallback(
    (email, password) => signInWithEmail(email, password),
    []
  );

  const register = useCallback(
    (email, password, name) => registerWithEmail(email, password, name),
    []
  );

  const loginWithGoogle = useCallback(() => signInWithGoogle(), []);

  const logout = useCallback(async () => {
    await signOutUser();
    setUser(null);
    setUserProfile(null);
  }, []);

  const resetPassword = useCallback(
    (email) => fbResetPassword(email),
    []
  );

  const isAdmin = userProfile?.role === 'admin';

  const value = {
    user,
    userProfile,
    loading,
    isAdmin,
    login,
    register,
    loginWithGoogle,
    logout,
    resetPassword,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

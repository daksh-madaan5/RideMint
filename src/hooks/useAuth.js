import { useContext } from 'react';
import { AuthContext } from '@/context/AuthContext';

/**
 * Convenience hook for accessing auth context.
 * @returns {{ user, userProfile, loading, isAdmin, login, register, loginWithGoogle, logout, resetPassword }}
 */
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

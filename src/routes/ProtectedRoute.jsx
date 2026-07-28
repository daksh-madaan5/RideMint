import { useContext } from 'react';
import { Navigate, useLocation } from 'react-router';
import { AuthContext } from '@/context/AuthContext';
import Spinner from '@/components/ui/Spinner';

/**
 * Protects routes that require authentication.
 * Redirects to login if user is not authenticated.
 */
export default function ProtectedRoute({ children }) {
  const { user, loading } = useContext(AuthContext);
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface-950">
        <Spinner size="lg" label="Loading..." />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}

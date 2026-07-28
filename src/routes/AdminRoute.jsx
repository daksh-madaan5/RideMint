import { useContext } from 'react';
import { Navigate } from 'react-router';
import { AuthContext } from '@/context/AuthContext';
import Spinner from '@/components/ui/Spinner';

/**
 * Protects admin-only routes.
 * Redirects to home if user is not an admin.
 */
export default function AdminRoute({ children }) {
  const { user, userProfile, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface-950">
        <Spinner size="lg" label="Verifying access..." />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (userProfile?.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  return children;
}

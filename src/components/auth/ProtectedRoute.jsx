import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export function ProtectedRoute({ children, allowedRole }) {
  const { user, isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <div role="status" className="flex min-h-screen items-center justify-center text-sm text-text-secondary">Checking your session...</div>;
  }

  // Not logged in → go to login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Logged in but wrong role → redirect to the correct dashboard
  if (allowedRole && user.role !== allowedRole) {
    const redirectPath = user.role === 'doctor' ? '/doctor' : '/patient';
    return <Navigate to={redirectPath} replace />;
  }

  return children;
}

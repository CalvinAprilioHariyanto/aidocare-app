import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export function ProtectedRoute({ children, allowedRole }) {
  const { user, isAuthenticated } = useAuth();

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

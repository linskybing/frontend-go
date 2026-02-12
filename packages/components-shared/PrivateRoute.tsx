import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '@/core/context/useAuth';

const PrivateRoute = () => {
  const location = useLocation();
  const { isAuthenticated, loading } = useAuth();
  if (loading) {
    return null; // or a spinner
  }
  return isAuthenticated ? (
    <Outlet />
  ) : (
    <Navigate to="/signin" state={{ from: location }} replace />
  );
};

export default PrivateRoute;

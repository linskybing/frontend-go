import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '@/core/context/useAuth';

const PrivateRoute = () => {
  const location = useLocation();
  const { isAuthenticated, loading } = useAuth();
  if (loading) {
    console.log('PrivateRoute loading', { loading, isAuthenticated });
    return null; // or a spinner
  }
  console.log('PrivateRoute state', { loading, isAuthenticated, pathname: location.pathname });
  return isAuthenticated ? (
    <Outlet />
  ) : (
    <Navigate to="/signin" state={{ from: location }} replace />
  );
};

export default PrivateRoute;

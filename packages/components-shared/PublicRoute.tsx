import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/core/context/useAuth';

const PublicRoute = () => {
  const { isAuthenticated, loading } = useAuth();
  // While auth state is being determined, still allow rendering the public route
  // so unauthenticated users can access signin/signup without a blank screen.
  if (loading) {
    console.log('PublicRoute loading', { loading, isAuthenticated });
    return <Outlet />;
  }

  console.log('PublicRoute state', { loading, isAuthenticated });

  return isAuthenticated ? <Navigate to="/" replace /> : <Outlet />;
};

export default PublicRoute;

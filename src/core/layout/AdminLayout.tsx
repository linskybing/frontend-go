import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import { SidebarProvider } from '../context/SidebarContext';
import { useSidebar } from '../context/hooks/useSidebar';
import AppHeader from './AppHeader';
import Backdrop from './Backdrop';
import AppSidebar from './AppSidebar';
import { WebSocketProvider } from '../context/WebSocketContext';
import { NotificationProvider } from '../context/NotificationProvider';

const AdminLayoutContent: React.FC = () => {
  const { isExpanded, isHovered, isMobileOpen } = useSidebar();
  const { switchViewMode } = useAuth();

  // Force admin view mode when on admin routes
  useEffect(() => {
    switchViewMode('admin', true);

    // Optionally reset to user mode when leaving admin routes
    // However, we might want to keep admin mode until explicitly switched back
    return () => {
      // Uncomment to reset to user mode when leaving admin layout
      // switchViewMode('user', true);
    };
  }, [switchViewMode]);

  return (
    <div className="min-h-screen xl:flex">
      <div>
        <AppSidebar />
        <Backdrop />
      </div>
      <div
        className={`flex-1 transition-all duration-300 ease-in-out ${
          isExpanded || isHovered ? 'lg:ml-[290px]' : 'lg:ml-[90px]'
        } ${isMobileOpen ? 'ml-0' : ''}`}
      >
        <AppHeader />
        <div className="p-4 mx-auto max-w-(--breakpoint-2xl) md:p-6">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

const AdminLayout: React.FC = () => {
  return (
    <SidebarProvider>
      <WebSocketProvider>
        <NotificationProvider>
          <AdminLayoutContent />
        </NotificationProvider>
      </WebSocketProvider>
    </SidebarProvider>
  );
};

export default AdminLayout;

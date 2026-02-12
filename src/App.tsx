import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
// React import not needed with automatic JSX runtime

// Auth Pages
import { SignIn, SignUp, ForgotPassword } from './features/auth/pages';

// Admin Pages
import {
  AdminDashboard,
  AdminFormDashboard,
  AdminAuditLogs,
  ManageProjects,
  ManageGroups,
  ManageImageRequests,
  ManageImages,
} from './features/admin/pages';
// Groups Pages
import { Groups } from './features/groups/pages';
import GroupDetail from './features/groups/components/GroupDetail';

// Projects Pages
import { Projects, ProjectDetail, UserImageRequests } from './features/projects/pages';

// Forms Pages
import { UserFormDashboard } from './features/forms/pages';

// Storage Pages
import { StoragePage, BrowserPage, TerminalWrapper } from './features/storage/pages';

// Monitoring Pages
import { PodTables, JobsLivePage } from './features/monitoring/pages';
import ProfileSettingsPage from './features/settings/pages/ProfileSettingsPage';

// Dashboard
import DashboardOverview from './features/dashboard/pages/DashboardOverview';

// Shared Components from packages
import { NotFound, ScrollToTop } from '@nthucscc/ui';
import { PrivateRoute, PublicRoute } from '@nthucscc/components-shared';

// Core
import AppLayout from './core/layout/AppLayout';
import AdminLayout from './core/layout/AdminLayout';
import { AuthProvider } from './core/context/AuthContext';
import { WebSocketProvider } from './core/context/WebSocketContext';
import ErrorBoundary from './core/components/ErrorBoundary';

export default function App() {
  // Load theme from localStorage on app startup
  useEffect(() => {
    const loadTheme = () => {
      try {
        // Try to get user ID from localStorage
        const userData = localStorage.getItem('userData');
        if (userData) {
          const { user_id } = JSON.parse(userData);
          const settingsKey = `userSettings_${user_id}`;
          const savedSettings = localStorage.getItem(settingsKey);

          if (savedSettings) {
            const settings = JSON.parse(savedSettings);
            const root = document.documentElement;

            if (settings.theme === 'dark') {
              root.classList.add('dark');
            } else {
              root.classList.remove('dark');
            }
          }
        }
      } catch (error) {
        console.error('Failed to load theme:', error);
      }
    };

    loadTheme();
  }, []);

  return (
    <ErrorBoundary>
      <AuthProvider>
        <WebSocketProvider>
          <Router>
            <ScrollToTop />
            <Routes>
              {/* Public Routes */}
              <Route element={<PublicRoute />}>
                <Route path="/signin" element={<SignIn />} />
                <Route path="/signup" element={<SignUp />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
              </Route>

              {/* Protected Routes */}
              <Route element={<PrivateRoute />}>
                {/* User Routes */}
                <Route element={<AppLayout />}>
                  <Route index path="/" element={<DashboardOverview />} />
                  <Route path="/groups" element={<Groups />} />
                  <Route path="/groups/:id" element={<GroupDetail />} />
                  <Route path="/projects" element={<Projects />} />
                  <Route path="/projects/:id" element={<ProjectDetail />} />
                  <Route path="/projects/:id/jobs" element={<Navigate to="/jobs" replace />} />
                  <Route path="/image-requests" element={<UserImageRequests />} />
                  <Route path="/jobs" element={<JobsLivePage />} />
                  <Route path="/my-forms" element={<UserFormDashboard />} />
                  <Route path="/pod-tables" element={<PodTables />} />
                  <Route path="/settings" element={<ProfileSettingsPage />} />
                  <Route path="/profile" element={<ProfileSettingsPage />} />
                  {/* pod logs use modal, no separate route needed */}
                  <Route path="/terminal" element={<TerminalWrapper />} />
                  <Route path="/file-browser" element={<BrowserPage />} />
                </Route>

                {/* Admin Routes - Use AdminLayout to force admin view mode */}
                <Route element={<AdminLayout />}>
                  <Route path="/admin" element={<AdminDashboard />} />
                  <Route path="/admin/audit-logs" element={<AdminAuditLogs />} />
                  <Route path="/admin/manage-projects" element={<ManageProjects />} />
                  <Route path="/admin/manage-groups" element={<ManageGroups />} />
                  <Route path="/admin/forms" element={<AdminFormDashboard />} />
                  <Route path="/admin/image-requests" element={<ManageImageRequests />} />
                  <Route path="/admin/manage-images" element={<ManageImages />} />
                  <Route path="/admin/storage-management" element={<StoragePage />} />
                </Route>
              </Route>

              {/* Not Found */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Router>
        </WebSocketProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}

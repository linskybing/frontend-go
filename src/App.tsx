import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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
import ProjectJobs from './features/projects/pages/ProjectJobs';

// Forms Pages
import { UserFormDashboard } from './features/forms/pages';

// Storage Pages
import { StoragePage, BrowserPage, TerminalWrapper } from './features/storage/pages';

// Monitoring Pages
import { PodTables, JobsLivePage } from './features/monitoring/pages';

// Dashboard
import DashboardOverview from './features/dashboard/pages/DashboardOverview';

// Shared Components from packages
import { NotFound, ScrollToTop } from '@nthucscc/ui';
import { PrivateRoute, PublicRoute } from '@nthucscc/components-shared';

// Core
import AppLayout from './core/layout/AppLayout';
import { AuthProvider } from './core/context/AuthContext';
import { WebSocketProvider } from './core/context/WebSocketContext';
import ErrorBoundary from './core/components/ErrorBoundary';

export default function App() {
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
                <Route element={<AppLayout />}>
                  <Route index path="/" element={<DashboardOverview />} />
                  <Route path="/groups" element={<Groups />} />
                  <Route path="/groups/:id" element={<GroupDetail />} />
                  <Route path="/projects" element={<Projects />} />
                  <Route path="/projects/:id" element={<ProjectDetail />} />
                  <Route path="/projects/:id/jobs" element={<ProjectJobs />} />
                  <Route path="/image-requests" element={<UserImageRequests />} />
                  <Route path="/jobs" element={<JobsLivePage />} />
                  <Route path="/admin" element={<AdminDashboard />} />
                  <Route path="/admin/audit-logs" element={<AdminAuditLogs />} />
                  <Route path="/admin/manage-projects" element={<ManageProjects />} />
                  <Route path="/admin/manage-groups" element={<ManageGroups />} />
                  <Route path="/admin/forms" element={<AdminFormDashboard />} />
                  <Route path="/admin/image-requests" element={<ManageImageRequests />} />
                  <Route path="/admin/manage-images" element={<ManageImages />} />
                  <Route path="/admin/storage-management" element={<StoragePage />} />
                  <Route path="/my-forms" element={<UserFormDashboard />} />
                  <Route path="/pod-tables" element={<PodTables />} />
                  {/* pod logs use modal, no separate route needed */}
                  <Route path="/terminal" element={<TerminalWrapper />} />
                  <Route path="/file-browser" element={<BrowserPage />} />
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

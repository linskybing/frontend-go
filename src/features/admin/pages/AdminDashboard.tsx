import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { PageLayout } from '@nthucscc/ui';
import { useTranslation } from '@nthucscc/utils';
import {
  FolderIcon,
  UserGroupIcon,
  DocumentTextIcon,
  PhotoIcon,
  ClipboardDocumentListIcon,
  ArrowPathIcon,
  CircleStackIcon,
} from '@heroicons/react/24/outline';
import { getProjects } from '@/core/services/projectService';
import { getGroups } from '@/core/services/groupService';
import { getAllForms } from '@/core/services/formService';
import { getAuditLogs } from '@/core/services/auditService';
import { AuditLog } from '@/core/interfaces/audit';
import { FormStatus } from '@/core/interfaces/form';

interface AdminStats {
  projectCount: number;
  groupCount: number;
  pendingForms: number;
  auditLogs: AuditLog[];
}

const navLinks = [
  { key: 'page.admin.manageProjects', path: '/admin/manage-projects', icon: FolderIcon },
  { key: 'page.admin.manageGroups', path: '/admin/manage-groups', icon: UserGroupIcon },
  { key: 'page.admin.forms', path: '/admin/forms', icon: DocumentTextIcon },
  { key: 'page.admin.auditLogs.title', path: '/admin/audit-logs', icon: ClipboardDocumentListIcon },
  {
    key: 'admin.storageManagement.title',
    path: '/admin/storage-management',
    icon: CircleStackIcon,
  },
  { key: 'sidebar.manageImages', path: '/admin/manage-images', icon: PhotoIcon },
  { key: 'sidebar.imageRequests', path: '/admin/image-requests', icon: ArrowPathIcon },
] as const;

export default function AdminDashboard() {
  const { t } = useTranslation();
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      getProjects().catch(() => []),
      getGroups().catch(() => []),
      getAllForms().catch(() => []),
      getAuditLogs({ limit: 10 }).catch(() => []),
    ])
      .then(([projects, groups, forms, logs]) => {
        const pending = forms.filter((f) => f.status === FormStatus.Pending);
        setStats({
          projectCount: projects.length,
          groupCount: Array.isArray(groups) ? groups.length : 0,
          pendingForms: pending.length,
          auditLogs: logs,
        });
      })
      .finally(() => setLoading(false));
  }, []);

  const formatTime = (iso: string) => {
    try {
      return new Date(iso).toLocaleString(undefined, {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return iso;
    }
  };

  return (
    <PageLayout
      title={t('page.admin.title') || 'Admin'}
      description={t('page.admin.description') || ''}
      breadcrumb={t('admin.dashboard') || 'Admin Dashboard'}
    >
      {loading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-20 animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700" />
          ))}
        </div>
      ) : (
        <>
          {/* Stat Bar */}
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            {[
              {
                label: t('page.admin.dashboard.totalProjects'),
                value: stats?.projectCount ?? 0,
                icon: <FolderIcon className="h-5 w-5" />,
              },
              {
                label: t('page.admin.dashboard.totalGroups'),
                value: stats?.groupCount ?? 0,
                icon: <UserGroupIcon className="h-5 w-5" />,
              },
              {
                label: t('page.admin.dashboard.pendingForms'),
                value: stats?.pendingForms ?? 0,
                icon: <DocumentTextIcon className="h-5 w-5" />,
              },
              {
                label: t('page.admin.dashboard.recentAuditLogs'),
                value: stats?.auditLogs.length ?? 0,
                icon: <ClipboardDocumentListIcon className="h-5 w-5" />,
              },
            ].map(({ label, value, icon }) => (
              <div
                key={label}
                className="flex items-center gap-3 rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-slate-900"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-amber-500/10 text-amber-500">
                  {icon}
                </div>
                <div>
                  <p className="text-xl font-bold font-mono text-gray-900 dark:text-white">
                    {value}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{label}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Two-column: Audit Logs + Quick Navigation */}
          <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Recent Audit Logs */}
            <div className="rounded-lg border border-gray-200 bg-white dark:border-gray-800 dark:bg-slate-900">
              <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3 dark:border-gray-800">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                  {t('page.admin.dashboard.recentAuditLogs')}
                </h3>
                <Link
                  to="/admin/audit-logs"
                  className="text-xs font-medium text-amber-600 hover:text-amber-700 dark:text-amber-400"
                >
                  View all &rarr;
                </Link>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-gray-100 dark:border-gray-800">
                      <th className="px-4 py-2 text-xs font-medium text-gray-500">Action</th>
                      <th className="px-4 py-2 text-xs font-medium text-gray-500">Resource</th>
                      <th className="px-4 py-2 text-xs font-medium text-gray-500">Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(stats?.auditLogs ?? []).length === 0 ? (
                      <tr>
                        <td colSpan={3} className="px-4 py-6 text-center text-sm text-gray-400">
                          No recent logs
                        </td>
                      </tr>
                    ) : (
                      (stats?.auditLogs ?? []).map((log) => (
                        <tr
                          key={log.ID || log.id}
                          className="border-b border-gray-50 last:border-0 dark:border-gray-800/50"
                        >
                          <td className="px-4 py-2 font-mono text-xs text-gray-700 dark:text-gray-300">
                            {log.action}
                          </td>
                          <td className="px-4 py-2 font-mono text-xs text-gray-500 dark:text-gray-400">
                            {log.resource_type}
                          </td>
                          <td className="px-4 py-2 text-xs text-gray-400">
                            {formatTime(log.created_at)}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Quick Navigation */}
            <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-slate-900">
              <h3 className="mb-4 text-sm font-semibold text-gray-900 dark:text-white">
                {t('page.admin.dashboard.quickNavigation')}
              </h3>
              <div className="space-y-1">
                {navLinks.map(({ key, path, icon: Icon }) => (
                  <Link
                    key={path}
                    to={path}
                    className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-amber-500/10 hover:text-amber-600 dark:text-gray-300 dark:hover:bg-amber-500/10 dark:hover:text-amber-400"
                  >
                    <Icon className="h-5 w-5 text-gray-400" />
                    {t(key)}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </PageLayout>
  );
}

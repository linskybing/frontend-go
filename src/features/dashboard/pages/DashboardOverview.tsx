import { useEffect, useState } from 'react';
import { useTranslation } from '@nthucscc/utils';
import { PageLayout } from '@nthucscc/ui';
import { FolderIcon, UserGroupIcon, DocumentTextIcon, BoltIcon } from '@heroicons/react/24/outline';
import { getDashboardSummary, DashboardSummary } from '../services/dashboardService';
import StatCard from '../components/StatCard';
import QuickActions from '../components/QuickActions';
import RecentActivity from '../components/RecentActivity';

export default function DashboardOverview() {
  const { t } = useTranslation();
  const [data, setData] = useState<DashboardSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState('');

  useEffect(() => {
    const storedName = localStorage.getItem('username') || '';
    setUsername(storedName);

    const userData = localStorage.getItem('userData');
    if (userData) {
      const { user_id } = JSON.parse(userData);
      getDashboardSummary(user_id)
        .then(setData)
        .catch(() => {})
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  return (
    <PageLayout title={t('page.dashboard.overview')} breadcrumb={t('sidebar.overview')}>
      {/* Welcome */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          {username
            ? t('page.dashboard.welcomeBack').replace('{name}', username)
            : t('page.dashboard.overview')}
        </h1>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-24 animate-pulse rounded-xl bg-gray-200 dark:bg-gray-700" />
          ))}
        </div>
      ) : (
        <>
          {/* Stat Cards */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard
              icon={<FolderIcon className="h-5 w-5" />}
              label={t('page.dashboard.projects')}
              value={data?.projects.length ?? 0}
            />
            <StatCard
              icon={<UserGroupIcon className="h-5 w-5" />}
              label={t('page.dashboard.groups')}
              value={data?.groupCount ?? 0}
            />
            <StatCard
              icon={<BoltIcon className="h-5 w-5" />}
              label={t('page.dashboard.activeJobs')}
              value="-"
            />
            <StatCard
              icon={<DocumentTextIcon className="h-5 w-5" />}
              label={t('page.dashboard.forms')}
              value={data?.formCount ?? 0}
            />
          </div>

          {/* Two-column: Recent Projects + Quick Actions */}
          <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
            <RecentActivity projects={data?.projects ?? []} />
            <QuickActions />
          </div>
        </>
      )}
    </PageLayout>
  );
}

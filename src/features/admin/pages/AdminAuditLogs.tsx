import { useEffect, useMemo, useState } from 'react';
import { PageLayout } from '@nthucscc/ui';
import { useTranslation } from '@nthucscc/utils';
// Assuming these are your existing domain icons
import { getAuditLogs } from '@/core/services/auditService';
import { AuditLog } from '@/core/interfaces/audit';
import LogList from './AdminAuditLogs.list';
import {
  UserIcon,
  SearchIcon,
  CalendarIcon,
  LayersIcon,
  RefreshIcon,
} from './AdminAuditLogs.icons';

// --- Main Component ---

export default function AdminAuditLogs() {
  const { t, lang } = useTranslation();

  // Safe access to current language, defaults to English
  const currentLang = typeof lang === 'string' ? lang : 'en-US';

  const translate = (key: string, fallback: string) => {
    const translator = t as unknown as (k: string) => string | undefined;
    return translator(key) || fallback;
  };

  // State Management
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Collapsible state for each log entry
  const [expandedIds, setExpandedIds] = useState<Set<number | string>>(new Set());

  // Filter States
  const [filters, setFilters] = useState({
    userId: '',
    resourceType: '',
    action: '',
    startTime: '',
    endTime: '',
    limit: '50',
  });

  const totalLogs = useMemo(() => logs.length, [logs]);

  // Handle filter changes
  const handleFilterChange = (key: keyof typeof filters, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const loadLogs = async () => {
    setLoading(true);
    setError(null);
    try {
      const query: Record<string, string | number> = {};
      if (filters.userId.trim()) query.user_id = Number(filters.userId);
      if (filters.resourceType.trim()) query.resource_type = filters.resourceType.trim();
      if (filters.action.trim()) query.action = filters.action.trim();
      if (filters.startTime) query.start_time = new Date(filters.startTime).toISOString();
      if (filters.endTime) query.end_time = new Date(filters.endTime).toISOString();
      if (filters.limit) query.limit = Number(filters.limit);

      const fetched = await getAuditLogs(query);
      setLogs(fetched);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to retrieve logs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLogs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toggleExpand = (id: number | string) => {
    const next = new Set(expandedIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setExpandedIds(next);
  };

  const resetFilters = () => {
    setFilters({
      userId: '',
      resourceType: '',
      action: '',
      startTime: '',
      endTime: '',
      limit: '50',
    });
    // Optional: auto-reload after reset or let user click search
  };

  return (
    <PageLayout
      title={translate('page.admin.auditLogs.title', 'Audit Logs')}
      description={translate(
        'page.admin.auditLogs.description',
        'System security and change tracking',
      )}
      breadcrumb={translate('page.admin.auditLogs.breadcrumb', 'Audit Logs')}
    >
      <div className="space-y-8">
        {/* Hero / Header Section */}
        <div className="flex flex-col justify-between gap-4 border-b border-gray-200 pb-6 dark:border-gray-800 md:flex-row md:items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
              {translate('page.admin.auditLogs.heading', 'Audit Trails')}
            </h1>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              {translate(
                'page.admin.auditLogs.subHeading',
                'Monitor and analyze administrative actions and resource changes.',
              )}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 rounded-full bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
              </span>
              {translate('common.live', 'Live')}
            </div>
          </div>
        </div>

        {/* Control Panel (Filters) */}
        <div className="rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <div className="border-b border-gray-100 px-6 py-4 dark:border-gray-800">
            <h2 className="text-sm font-semibold text-gray-900 dark:text-white">
              {translate('filter.title', 'Filter Criteria')}
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-5 p-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {/* User ID Input Group */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-gray-500 dark:text-gray-400">
                {translate('filter.userId', 'User ID')}
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <UserIcon className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="number"
                  value={filters.userId}
                  onChange={(e) => handleFilterChange('userId', e.target.value)}
                  placeholder={translate('filter.placeholder.userId', 'Search by ID...')}
                  className="block w-full rounded-lg border border-gray-200 bg-gray-50 py-2.5 pl-10 pr-3 text-sm text-gray-900 placeholder-gray-400 focus:border-accent-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-accent-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:focus:bg-gray-900"
                />
              </div>
            </div>

            {/* Resource Type Input Group */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-gray-500 dark:text-gray-400">
                {translate('filter.resource', 'Resource')}
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <LayersIcon className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={filters.resourceType}
                  onChange={(e) => handleFilterChange('resourceType', e.target.value)}
                  placeholder={translate('filter.placeholder.resource', 'e.g. project, user')}
                  className="block w-full rounded-lg border border-gray-200 bg-gray-50 py-2.5 pl-10 pr-3 text-sm text-gray-900 placeholder-gray-400 focus:border-accent-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-accent-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:focus:bg-gray-900"
                />
              </div>
            </div>

            {/* Action Input Group */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-gray-500 dark:text-gray-400">
                {translate('filter.action', 'Action')}
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <SearchIcon className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={filters.action}
                  onChange={(e) => handleFilterChange('action', e.target.value)}
                  placeholder={translate('filter.placeholder.action', 'e.g. create, update')}
                  className="block w-full rounded-lg border border-gray-200 bg-gray-50 py-2.5 pl-10 pr-3 text-sm text-gray-900 placeholder-gray-400 focus:border-accent-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-accent-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:focus:bg-gray-900"
                />
              </div>
            </div>

            {/* Limit Input Group */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-gray-500 dark:text-gray-400">
                {translate('filter.limit', 'Rows')}
              </label>
              <div className="relative">
                <select
                  value={filters.limit}
                  onChange={(e) => handleFilterChange('limit', e.target.value)}
                  className="block w-full appearance-none rounded-lg border border-gray-200 bg-gray-50 py-2.5 pl-3 pr-8 text-sm text-gray-900 focus:border-accent-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-accent-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:focus:bg-gray-900"
                >
                  <option value="25">25</option>
                  <option value="50">50</option>
                  <option value="100">100</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
                  <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20">
                    <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Date Range Inputs */}
            <div className="space-y-1.5 xl:col-span-2">
              <label className="text-xs font-medium text-gray-500 dark:text-gray-400">
                {translate('filter.dateRange', 'Time Range')}
              </label>
              <div className="flex flex-col gap-2 sm:flex-row">
                <div className="relative flex-1">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <CalendarIcon className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    type="datetime-local"
                    value={filters.startTime}
                    onChange={(e) => handleFilterChange('startTime', e.target.value)}
                    className="block w-full rounded-lg border border-gray-200 bg-gray-50 py-2.5 pl-10 pr-3 text-sm text-gray-900 placeholder-gray-400 focus:border-accent-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-accent-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:[color-scheme:dark]"
                  />
                </div>
                <span className="hidden self-center text-gray-400 sm:block">→</span>
                <div className="relative flex-1">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <CalendarIcon className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    type="datetime-local"
                    value={filters.endTime}
                    onChange={(e) => handleFilterChange('endTime', e.target.value)}
                    className="block w-full rounded-lg border border-gray-200 bg-gray-50 py-2.5 pl-10 pr-3 text-sm text-gray-900 placeholder-gray-400 focus:border-accent-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-accent-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:[color-scheme:dark]"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between border-t border-gray-100 bg-gray-50 px-6 py-3 dark:border-gray-800 dark:bg-gray-900/50">
            <div className="text-xs text-gray-500 dark:text-gray-400">
              {totalLogs > 0 &&
                translate('page.admin.auditLogs.count', `Showing latest ${totalLogs} records`)}
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  resetFilters();
                  loadLogs();
                }}
                className="rounded-lg px-4 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white"
              >
                {translate('common.reset', 'Reset')}
              </button>
              <button
                onClick={loadLogs}
                disabled={loading}
                className="flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition-all hover:bg-slate-800 hover:shadow-lg disabled:opacity-70 dark:bg-white dark:text-slate-900 dark:hover:bg-gray-100"
              >
                {loading && <RefreshIcon className="h-4 w-4" spin />}
                {translate('common.apply', 'Apply Filters')}
              </button>
            </div>
          </div>
        </div>

        {error && (
          <div className="flex items-center gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-red-800 dark:border-red-900/50 dark:bg-red-900/20 dark:text-red-300">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span className="text-sm font-medium">{error}</span>
          </div>
        )}

        {/* Timeline List */}
        <LogList
          logs={logs}
          expandedIds={expandedIds}
          toggleExpand={toggleExpand}
          translate={translate}
          currentLang={currentLang}
        />
      </div>
    </PageLayout>
  );
}

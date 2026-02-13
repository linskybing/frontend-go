import React, { useMemo, useState } from 'react';
import { PageLayout } from '@nthucscc/ui';
import { Link } from 'react-router-dom';
import { useTranslation } from '@nthucscc/utils';
import { listWorkflows, Workflow } from '@/core/services/system/workflowService';
import { useWorkflowPolling } from '../hooks/useWorkflowPolling';
import WorkflowStatusBadge from '../components/WorkflowStatusBadge';

const WorkflowListPage: React.FC = () => {
  const { t } = useTranslation();
  const [search, setSearch] = useState('');

  const { data, loading, error, refresh } = useWorkflowPolling<Workflow[]>(
    () => listWorkflows(),
    [],
    5000,
  );

  const workflows = data || [];
  const filtered = useMemo(() => {
    const needle = search.trim().toLowerCase();
    if (!needle) return workflows;
    return workflows.filter((wf) => wf.metadata?.name?.toLowerCase().includes(needle));
  }, [search, workflows]);

  return (
    <PageLayout title={t('page.workflows.title')} breadcrumb={t('page.workflows.breadcrumb')}>
      <div className="space-y-6">
        <section className="rounded-2xl border border-slate-200 bg-gradient-to-br from-white via-slate-50 to-slate-100 p-5 shadow-sm">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
                {t('page.workflows.subtitle')}
              </p>
              <h1 className="mt-2 text-2xl font-bold text-slate-900">
                {t('page.workflows.title')}
              </h1>
              <p className="mt-1 text-sm text-slate-500">
                {t('page.workflows.description')}
              </p>
            </div>
            <div className="flex w-full flex-col gap-2 sm:flex-row sm:items-center lg:w-auto">
              <input
                className="w-full rounded-full border border-slate-200 bg-white px-4 py-2 text-sm text-slate-700 shadow-sm focus:border-slate-400 focus:outline-none"
                placeholder={t('page.workflows.searchPlaceholder')}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <button
                type="button"
                onClick={refresh}
                className="rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-600 shadow-sm transition hover:border-slate-300"
              >
                {t('page.workflows.refresh')}
              </button>
            </div>
          </div>
        </section>

        {error && (
          <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-600">
            {error}
          </div>
        )}

        <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-100 px-5 py-4">
            <div className="grid grid-cols-3 gap-4 text-xs uppercase tracking-[0.2em] text-slate-400">
              <span>{t('page.workflows.columns.name')}</span>
              <span>{t('page.workflows.columns.status')}</span>
              <span>{t('page.workflows.columns.updated')}</span>
            </div>
          </div>
          <div className="divide-y divide-slate-100">
            {loading && (
              <div className="px-5 py-6 text-sm text-slate-400">
                {t('page.workflows.loading')}
              </div>
            )}
            {!loading && filtered.length === 0 && (
              <div className="px-5 py-6 text-sm text-slate-400">
                {t('page.workflows.empty')}
              </div>
            )}
            {filtered.map((workflow) => {
              const status = workflow.status?.phase || 'Unknown';
              const updated = workflow.status?.finishedAt || workflow.status?.startedAt;
              return (
                <Link
                  to={`/workflows/${workflow.metadata.name}`}
                  key={workflow.metadata.name}
                  className="grid grid-cols-3 items-center gap-4 px-5 py-4 text-sm transition hover:bg-slate-50"
                >
                  <div>
                    <div className="font-semibold text-slate-900">{workflow.metadata.name}</div>
                    <div className="text-xs text-slate-500">
                      {workflow.metadata.namespace || 'default'}
                    </div>
                  </div>
                  <div>
                    <WorkflowStatusBadge status={status} size="sm" />
                  </div>
                  <div className="text-xs text-slate-500">
                    {updated ? new Date(updated).toLocaleString() : t('page.workflows.noTime')}
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      </div>
    </PageLayout>
  );
};

export default WorkflowListPage;

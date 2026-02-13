import React, { useMemo, useState } from 'react';
import { PageLayout } from '@nthucscc/ui';
import { useParams } from 'react-router-dom';
import { useTranslation } from '@nthucscc/utils';
import {
  deleteWorkflow,
  getWorkflow,
  resumeWorkflow,
  suspendWorkflow,
  terminateWorkflow,
  Workflow,
} from '@/core/services/system/workflowService';
import { useWorkflowPolling } from '../hooks/useWorkflowPolling';
import WorkflowStatusBadge from '../components/WorkflowStatusBadge';
import WorkflowGraph from '../components/WorkflowGraph';

const WorkflowDetailPage: React.FC = () => {
  const { name = '' } = useParams();
  const { t } = useTranslation();
  const [actionError, setActionError] = useState<string | null>(null);

  const { data, loading, error, refresh } = useWorkflowPolling<Workflow>(
    () => getWorkflow(name),
    [name],
    4000,
  );

  const workflow = data;
  const status = workflow?.status?.phase || 'Unknown';

  const nodes = useMemo(() => {
    const map = workflow?.status?.nodes || {};
    return Object.values(map).slice(0, 8);
  }, [workflow]);

  const runAction = async (action: () => Promise<void>) => {
    setActionError(null);
    try {
      await action();
      await refresh();
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'Action failed.');
    }
  };

  return (
    <PageLayout title={t('page.workflowDetail.title')} breadcrumb={t('page.workflowDetail.breadcrumb')}>
      <div className="space-y-6">
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-400">
                {t('page.workflowDetail.subtitle')}
              </p>
              <h1 className="mt-2 text-2xl font-bold text-slate-900">{name}</h1>
              <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-slate-500">
                <span>{workflow?.metadata.namespace || 'default'}</span>
                <span>•</span>
                <span>
                  {workflow?.metadata.creationTimestamp
                    ? new Date(workflow.metadata.creationTimestamp).toLocaleString()
                    : t('page.workflowDetail.noTime')}
                </span>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <WorkflowStatusBadge status={status} />
              <button
                type="button"
                onClick={() => runAction(() => suspendWorkflow(name))}
                className="rounded-full border border-slate-200 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-600 hover:border-slate-300"
              >
                {t('page.workflowDetail.actions.suspend')}
              </button>
              <button
                type="button"
                onClick={() => runAction(() => resumeWorkflow(name))}
                className="rounded-full border border-slate-200 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-600 hover:border-slate-300"
              >
                {t('page.workflowDetail.actions.resume')}
              </button>
              <button
                type="button"
                onClick={() => runAction(() => terminateWorkflow(name))}
                className="rounded-full border border-rose-200 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-rose-600 hover:border-rose-300"
              >
                {t('page.workflowDetail.actions.terminate')}
              </button>
              <button
                type="button"
                onClick={() => runAction(() => deleteWorkflow(name))}
                className="rounded-full border border-slate-200 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-600 hover:border-slate-300"
              >
                {t('page.workflowDetail.actions.delete')}
              </button>
            </div>
          </div>
          {actionError && (
            <div className="mt-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-600">
              {actionError}
            </div>
          )}
          {error && (
            <div className="mt-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-600">
              {error}
            </div>
          )}
          {loading && !workflow && (
            <div className="mt-4 text-sm text-slate-400">{t('page.workflowDetail.loading')}</div>
          )}
        </section>

        <section className="grid grid-cols-1 gap-6 lg:grid-cols-[1.6fr_1fr]">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
              {t('page.workflowDetail.graphTitle')}
            </h2>
            <div className="mt-4">
              <WorkflowGraph workflow={workflow || null} />
            </div>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
              {t('page.workflowDetail.nodeTitle')}
            </h2>
            <div className="mt-4 space-y-3">
              {nodes.length === 0 && (
                <div className="text-sm text-slate-400">{t('page.workflowDetail.noNodes')}</div>
              )}
              {nodes.map((node) => (
                <div
                  key={node.id || node.name}
                  className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2"
                >
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-semibold text-slate-800">
                      {node.displayName || node.name || node.id}
                    </div>
                    <WorkflowStatusBadge status={node.phase} size="sm" />
                  </div>
                  {node.message && (
                    <div className="mt-1 text-xs text-slate-500 line-clamp-2">
                      {node.message}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </PageLayout>
  );
};

export default WorkflowDetailPage;

import { useMemo, useState } from 'react';
import { useTranslation } from '@nthucscc/utils';
import type { ResourceMessage } from '@/core/interfaces/resource';
import { ArchiveBoxIcon, CubeIcon } from '@heroicons/react/24/outline'; // Icons for distinction
import { SYSTEM_POD_PREFIXES } from '@/core/config/constants';
import {
  calculateAge,
  isJobPod,
  renderDetails,
  renderLabels,
  availableColumns,
  ColumnKey,
} from './MonitoringPanel.helpers';
import { StatusBadge } from './MonitoringPanel.widgets';

// --- Main Component ---

const MonitoringPanel = ({ messages }: { messages: ResourceMessage[] }) => {
  const { t } = useTranslation();

  // 1. Column Selection State
  // Default visible columns (Max 5 recommended for layout)
  const [visibleColumns, setVisibleColumns] = useState<Set<ColumnKey>>(
    new Set(['kind', 'name', 'details', 'status', 'age']),
  );

  // 2. Data Aggregation & Filtering Logic (Optimized for WebSocket stream)
  const currentResources = useMemo(() => {
    const safeMessages = Array.isArray(messages) ? messages : [];
    const resourceMap = new Map<string, ResourceMessage>();
    // Keep terminating/deleted resources visible for a short grace period so users can see
    // that a resource is terminating instead of disappearing immediately.
    const GRACE_MS = 30 * 1000; // 30 seconds

    safeMessages.forEach((msg) => {
      // Filter out system pods (noisy data)
      if (SYSTEM_POD_PREFIXES.some((prefix) => msg.name.startsWith(prefix))) {
        return;
      }

      const key = `${msg.kind}/${msg.name}`;

      if (msg.type === 'DELETED') {
        // If we already know this resource, mark it terminating and set an expiry
        const existing = resourceMap.get(key);
        if (existing) {
          existing.metadata = existing.metadata || {};
          existing.metadata.deletionTimestamp =
            msg.metadata?.deletionTimestamp || new Date().toISOString();
          existing.status = 'Terminating';
          // store a private expire marker (not part of public interface)
          (existing as any).__expireAt = Date.now() + GRACE_MS;
          resourceMap.set(key, existing);
        } else {
          // If we haven't seen it yet, create a terminating placeholder so user still sees it
          const placeholder: ResourceMessage = {
            type: 'DELETED',
            name: msg.name,
            ns: msg.ns,
            kind: msg.kind,
            status: 'Terminating',
            metadata: {
              deletionTimestamp: msg.metadata?.deletionTimestamp || new Date().toISOString(),
              creationTimestamp: msg.metadata?.creationTimestamp,
            },
          } as ResourceMessage;
          (placeholder as any).__expireAt = Date.now() + GRACE_MS;
          resourceMap.set(key, placeholder);
        }
      } else {
        // Upsert: newer messages overwrite older ones. Also clear any expire marker when updated.
        const m = { ...msg } as any;
        if ((m as any).__expireAt) delete (m as any).__expireAt;
        resourceMap.set(key, m as ResourceMessage);
      }
    });

    // Remove any items that have expired past their grace window
    const now = Date.now();
    for (const [k, v] of resourceMap.entries()) {
      const exp = (v as any).__expireAt;
      if (exp && exp < now) resourceMap.delete(k);
    }

    return Array.from(resourceMap.values()).sort((a, b) => {
      // Sort priority: Kind -> IsJob -> CreationTime -> Name
      if (a.kind !== b.kind) return (a.kind || '').localeCompare(b.kind || '');

      // Keep Jobs grouped together if desired, or just sort by time
      if (a.metadata?.creationTimestamp && b.metadata?.creationTimestamp) {
        return b.metadata.creationTimestamp.localeCompare(a.metadata.creationTimestamp);
      }
      return a.name.localeCompare(b.name);
    });
  }, [messages]);

  // Toggle column visibility with MAX limit
  const toggleColumn = (col: ColumnKey) => {
    const newSet = new Set(visibleColumns);
    if (newSet.has(col)) {
      newSet.delete(col);
    } else {
      // Constraint: Allow max 5 columns selected at once
      if (newSet.size >= 5) {
        // Optionally trigger a toast here: toast.error("Max 5 columns allowed");
        return;
      }
      newSet.add(col);
    }
    setVisibleColumns(newSet);
  };

  // availableColumns imported from helpers

  return (
    <div className="mt-4 flow-root">
      {/* --- Column Selector Toolbar --- */}
      <div className="mb-4 flex flex-wrap gap-2 items-center text-sm">
        <span className="text-gray-500 font-medium mr-2">Columns (Max 5):</span>
        {availableColumns.map((col) => {
          const isSelected = visibleColumns.has(col);
          const isMaxReached = visibleColumns.size >= 5;
          const isDisabled = !isSelected && isMaxReached;

          return (
            <button
              key={col}
              onClick={() => toggleColumn(col)}
              disabled={isDisabled}
              className={`px-3 py-1 rounded-full border transition-all text-xs font-medium 
                ${
                  isSelected
                    ? 'bg-accent-100 border-accent-200 text-accent-700 dark:bg-accent-900/40 dark:border-accent-700 dark:text-accent-300'
                    : 'bg-white border-gray-200 text-gray-500 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400'
                }
                ${isDisabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50 dark:hover:bg-gray-700'}
              `}
            >
              {t(`monitor.col.${col}`) || col.charAt(0).toUpperCase() + col.slice(1)}
            </button>
          );
        })}
      </div>

      {/* --- Data Table --- */}
      <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-800">
            <tr>
              {visibleColumns.has('kind') && (
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-32">
                  {t('monitor.table.kind')}
                </th>
              )}
              {visibleColumns.has('name') && (
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('monitor.table.name')}
                </th>
              )}
              {visibleColumns.has('details') && (
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('monitor.table.details')}
                </th>
              )}
              {visibleColumns.has('images') && (
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('monitor.table.images')}
                </th>
              )}
              {visibleColumns.has('labels') && (
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('monitor.table.labels')}
                </th>
              )}
              {visibleColumns.has('restarts') && (
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-24">
                  {t('monitor.table.restarts')}
                </th>
              )}
              {visibleColumns.has('age') && (
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-24">
                  {t('monitor.table.age')}
                </th>
              )}
              {visibleColumns.has('status') && (
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider w-32">
                  {t('monitor.table.status')}
                </th>
              )}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-900 dark:divide-gray-800">
            {currentResources.length > 0 ? (
              currentResources.map((res) => {
                const isTerminating = !!res.metadata?.deletionTimestamp;
                const age = calculateAge(res.metadata?.creationTimestamp);
                const displayStatus =
                  (res.status as string) || (res as { Status?: string }).Status || undefined;

                const isJob = isJobPod(res);

                return (
                  <tr
                    key={`${res.kind}-${res.name}`}
                    className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                  >
                    {/* Kind */}
                    {visibleColumns.has('kind') && (
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                        <div className="flex items-center gap-2">
                          {isJob ? (
                            <span className="inline-flex items-center gap-1 text-gray-500 dark:text-gray-400">
                              <ArchiveBoxIcon className="w-3.5 h-3.5" />
                              Job Pod
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-gray-500 dark:text-gray-400">
                              <CubeIcon className="w-3.5 h-3.5" />
                              {res.kind}
                            </span>
                          )}
                        </div>
                      </td>
                    )}

                    {/* Name */}
                    {visibleColumns.has('name') && (
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 font-mono">
                        {res.name}
                      </td>
                    )}

                    {/* Network Details */}
                    {visibleColumns.has('details') && (
                      <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                        {renderDetails(res)}
                      </td>
                    )}

                    {/* Images */}
                    {visibleColumns.has('images') && (
                      <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                        {res.images?.map((img, i) => (
                          <div
                            key={i}
                            className="truncate max-w-[180px] text-xs font-mono"
                            title={img}
                          >
                            {img.split('/').pop()}
                          </div>
                        ))}
                      </td>
                    )}

                    {/* Labels (Filtered) */}
                    {visibleColumns.has('labels') && (
                      <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                        {renderLabels(res.metadata?.labels)}
                      </td>
                    )}

                    {/* Restarts */}
                    {visibleColumns.has('restarts') && (
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 text-center font-mono">
                        {res.kind === 'Pod' ? res.restartCount || 0 : '-'}
                      </td>
                    )}

                    {/* Age */}
                    {visibleColumns.has('age') && (
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {age}
                      </td>
                    )}

                    {/* Status */}
                    {visibleColumns.has('status') && (
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                        <StatusBadge status={displayStatus} isTerminating={isTerminating} />
                      </td>
                    )}
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={visibleColumns.size} className="px-6 py-12 text-center text-gray-500">
                  <div className="flex flex-col items-center">
                    <p className="font-medium">{t('monitor.waiting')}</p>
                    <p className="text-xs mt-1 text-gray-400">Waiting for resources...</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MonitoringPanel;

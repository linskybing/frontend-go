import type { ResourceMessage } from '@/core/interfaces/resource';

export type ColumnKey =
  | 'kind'
  | 'name'
  | 'details'
  | 'age'
  | 'status'
  | 'images'
  | 'restarts'
  | 'labels';

export const IGNORED_LABELS = [
  'pod-template-hash',
  'controller-revision-hash',
  'pod-template-generation',
  'service.kubernetes.io/headless',
  'statefulset.kubernetes.io/pod-name',
  'job-name',
  'controller-uid',
];

export const calculateAge = (creationTimestamp?: string) => {
  if (!creationTimestamp) return '-';
  const diff = Date.now() - new Date(creationTimestamp).getTime();
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) return `${days}d`;
  if (hours > 0) return `${hours}h`;
  if (minutes > 0) return `${minutes}m`;
  return `${seconds}s`;
};

export const isJobPod = (res: ResourceMessage) => {
  if (res.kind !== 'Pod') return false;

  const labels = res.metadata?.labels || {};
  if (labels['job-name']) return true;

  const owners = res.metadata?.ownerReferences || [];
  return owners.some((owner) => owner.kind === 'Job');
};

export const renderDetails = (res: ResourceMessage) => {
  if (res.kind === 'Service') {
    return (
      <div className="flex flex-col gap-1.5 text-xs">
        {res.nodePorts && res.nodePorts.length > 0 && (
          <div className="flex flex-wrap items-center gap-1">
            <span className="font-semibold text-gray-500">Node:</span>
            {res.nodePorts.map((port) => (
              <span
                key={port}
                className="font-mono bg-accent-50 text-accent-700 px-1.5 py-0.5 rounded border border-accent-200 dark:bg-accent-900/30 dark:text-accent-300 dark:border-accent-800"
              >
                {port}
              </span>
            ))}
          </div>
        )}
        {res.ports && res.ports.length > 0 && (
          <div className="flex flex-wrap items-center gap-1">
            <span className="font-semibold text-gray-500">Port:</span>
            {res.ports.map((port) => (
              <span
                key={port}
                className="font-mono text-gray-700 dark:text-gray-300 bg-gray-100 px-1.5 py-0.5 rounded dark:bg-gray-700 border border-gray-200 dark:border-gray-600"
              >
                {port}
              </span>
            ))}
          </div>
        )}
        {res.externalIPs && res.externalIPs.length > 0 && (
          <div className="flex gap-1 items-center">
            <span className="font-semibold text-gray-500">Ext:</span>
            <span className="font-mono text-gray-700 dark:text-gray-300">
              {res.externalIPs.join(', ')}
            </span>
          </div>
        )}
        {res.clusterIP && res.clusterIP !== 'None' && (
          <div className="flex gap-1 items-center text-gray-400">
            <span>IP:</span>
            <span className="font-mono">{res.clusterIP}</span>
          </div>
        )}
      </div>
    );
  }
  if (res.kind === 'Pod' && res.clusterIP) {
    return <span className="text-xs font-mono text-gray-500">{res.clusterIP}</span>;
  }
  return <span className="text-gray-400">-</span>;
};

export const renderLabels = (labels?: Record<string, string>) => {
  if (!labels) return <span className="text-gray-400">-</span>;

  const filteredLabels = Object.entries(labels).filter(([key]) => !IGNORED_LABELS.includes(key));
  if (filteredLabels.length === 0) return <span className="text-gray-400">-</span>;

  return (
    <div className="flex flex-wrap gap-1 max-w-[200px]">
      {filteredLabels.slice(0, 3).map(([k, v]) => (
        <span
          key={k}
          className="px-1.5 py-0.5 text-[10px] bg-gray-100 rounded border dark:bg-gray-800 dark:border-gray-700 truncate max-w-full"
          title={`${k}=${v}`}
        >
          {k}={v}
        </span>
      ))}
      {filteredLabels.length > 3 && (
        <span className="text-[10px] text-gray-400">+{filteredLabels.length - 3}</span>
      )}
    </div>
  );
};

export const availableColumns: ColumnKey[] = [
  'kind',
  'name',
  'details',
  'status',
  'age',
  'images',
  'restarts',
  'labels',
];

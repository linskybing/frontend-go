export type JobStatusMeta = {
  label: string;
  className: string;
};

const STATUS_META: Record<string, JobStatusMeta> = {
  queued: { label: 'Queued', className: 'bg-accent-100 text-accent-800' },
  scheduling: { label: 'Scheduling', className: 'bg-indigo-100 text-indigo-800' },
  pending: { label: 'Pending', className: 'bg-gray-100 text-gray-800' },
  running: { label: 'Running', className: 'bg-yellow-100 text-yellow-800' },
  completed: { label: 'Completed', className: 'bg-green-100 text-green-800' },
  succeeded: { label: 'Completed', className: 'bg-green-100 text-green-800' },
  failed: { label: 'Failed', className: 'bg-red-100 text-red-800' },
  cancelled: { label: 'Cancelled', className: 'bg-orange-100 text-orange-800' },
  preempted: { label: 'Preempted', className: 'bg-orange-100 text-orange-800' },
};

export const getJobStatusMeta = (rawStatus?: string): JobStatusMeta => {
  const key = (rawStatus || '').toLowerCase();
  return (
    STATUS_META[key] ?? { label: rawStatus || 'Unknown', className: 'bg-gray-100 text-gray-800' }
  );
};

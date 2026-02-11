export const StatusBadge = ({
  status,
  isTerminating,
}: {
  status: string | undefined;
  isTerminating?: boolean;
}) => {
  if (isTerminating) {
    return (
      <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300 animate-pulse border border-gray-300 dark:border-gray-600">
        Terminating
      </span>
    );
  }

  const safeStatus = status?.toLowerCase() || 'unknown';
  let colorClasses = 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';

  switch (safeStatus) {
    case 'running':
    case 'active':
    case 'bound':
    case 'succeeded':
    case 'ready':
      colorClasses =
        'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300 border border-green-200 dark:border-green-800';
      break;
    case 'pending':
    case 'containercreating':
      colorClasses =
        'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300 border border-yellow-200 dark:border-yellow-800';
      break;
    case 'failed':
    case 'error':
    case 'crashloopbackoff':
    case 'errimagepull':
    case 'imagepullbackoff':
      colorClasses =
        'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300 border border-red-200 dark:border-red-800';
      break;
  }

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors ${colorClasses}`}
    >
      {status || 'Unknown'}
    </span>
  );
};

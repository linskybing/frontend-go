// PodStatusBadge.tsx
import React from 'react';

const getStatusStyle = (status: string) => {
  const normalized = status.toLowerCase().replace(/[^a-z0-9]/g, '');

  const styles: Record<string, string> = {
    running:
      'bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800',
    succeeded:
      'bg-accent-100 text-accent-700 border-accent-200 dark:bg-accent-900/30 dark:text-accent-400 dark:border-accent-800',
    completed:
      'bg-accent-100 text-accent-700 border-accent-200 dark:bg-accent-900/30 dark:text-accent-400 dark:border-accent-800',
    pending:
      'bg-yellow-100 text-yellow-700 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400 dark:border-yellow-800',
    containercreating:
      'bg-yellow-100 text-yellow-700 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400 dark:border-yellow-800',
    terminating:
      'bg-gray-100 text-gray-700 border-gray-200 animate-pulse dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600',
    failed:
      'bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800',
    crashloopbackoff:
      'bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800',
    error:
      'bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800',
  };

  return (
    styles[normalized] ||
    'bg-gray-100 text-gray-600 border-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700'
  );
};

export const PodStatusBadge: React.FC<{ status: string }> = ({ status }) => {
  const safeStatus = status || 'Unknown';
  const className = getStatusStyle(safeStatus);
  const normalized = safeStatus.toLowerCase();

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${className}`}
    >
      <span className="relative flex h-2 w-2">
        {['running', 'containercreating'].includes(normalized) && (
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 bg-current"></span>
        )}
        <span className="relative inline-flex rounded-full h-2 w-2 bg-current"></span>
      </span>
      {safeStatus}
    </span>
  );
};

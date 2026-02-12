import React from 'react';
import {
  CheckCircleIcon,
  ExclamationCircleIcon,
} from '@heroicons/react/24/outline';

interface StatusMessageProps {
  type: 'idle' | 'loading' | 'success' | 'error';
  message: string;
}

const StatusMessage: React.FC<StatusMessageProps> = ({ type, message }) => {
  if (type === 'idle') return null;

  return (
    <div
      className={`mx-8 mt-6 p-4 rounded-lg flex items-start gap-3 animate-in fade-in slide-in-from-top-2 ${
        type === 'success'
          ? 'bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800'
          : type === 'error'
          ? 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800'
          : 'bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800'
      }`}
    >
      {type === 'success' ? (
        <CheckCircleIcon className="w-5 h-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5" />
      ) : type === 'error' ? (
        <ExclamationCircleIcon className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
      ) : (
        <div className="w-5 h-5 bg-blue-600 dark:bg-blue-400 rounded-full flex-shrink-0 mt-0.5 animate-spin" />
      )}
      <p
        className={
          type === 'success'
            ? 'text-emerald-800 dark:text-emerald-200'
            : type === 'error'
            ? 'text-red-800 dark:text-red-200'
            : 'text-blue-800 dark:text-blue-200'
        }
      >
        {message}
      </p>
    </div>
  );
};

export default StatusMessage;

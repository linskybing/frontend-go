import React from 'react';
import { Job } from '@/core/services/jobService';

interface JobCardProps {
  job: Job;
  onViewLog: (job: Job) => void;
}

const statusColor = (status: string) => {
  if (status === 'Succeeded') return 'bg-green-100 text-green-800';
  if (status === 'Failed') return 'bg-red-100 text-red-800';
  if (status === 'Running') return 'bg-yellow-100 text-yellow-800';
  return 'bg-gray-100 text-gray-800';
};

const JobCard: React.FC<JobCardProps> = ({ job, onViewLog }) => (
  <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800 flex flex-col gap-2">
    <div className="flex items-center gap-2 mb-2">
      <span
        className={`inline-block w-2 h-2 rounded-full ${
          job.Status === 'Succeeded'
            ? 'bg-green-500'
            : job.Status === 'Failed'
              ? 'bg-red-500'
              : job.Status === 'Running'
                ? 'bg-yellow-400'
                : 'bg-gray-400'
        }`}
      />
      <span
        className={`inline-block rounded-full px-2 py-0.5 text-xs font-semibold ${statusColor(job.Status)} dark:bg-opacity-20`}
      >
        {job.Status}
      </span>
    </div>
    <div className="font-bold text-lg text-gray-800 dark:text-white line-clamp-1">Job {job.ID}</div>
    <div className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
      Template: {job.ConfigFileID}
    </div>
    <div className="flex flex-wrap gap-2 mt-2 text-xs text-gray-400 dark:text-gray-500">
      <span>Namespace: {job.Namespace}</span>
      <span>Priority: {job.Priority}</span>
      <span>Submitted: {new Date(job.SubmittedAt).toLocaleDateString()}</span>
    </div>
    <button
      className="mt-2 px-3 py-1 text-xs rounded bg-accent-600 text-white hover:bg-violet-700"
      onClick={() => onViewLog(job)}
    >
      View Log
    </button>
  </div>
);

export default JobCard;

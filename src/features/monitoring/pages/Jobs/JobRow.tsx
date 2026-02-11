// src/pages/Jobs/JobRow.tsx
import React, { useState } from 'react';
import { LuChevronDown, LuServer } from 'react-icons/lu';
import { InferredJob, JobPod } from './types';
import { JobStatusBadge } from './JobStatusBadge';
import { JobPodsList } from './JobPodsList';

interface JobRowProps {
  job: InferredJob;
  pods: JobPod[];
  onViewPodLog: (namespace: string, pod: string, container: string) => void;
}

export const JobRow: React.FC<JobRowProps> = ({ job, pods, onViewPodLog }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <>
      <tr
        onClick={() => setIsExpanded(!isExpanded)}
        className={`group cursor-pointer transition-colors duration-200 border-b border-gray-100 dark:border-gray-700/50 
          ${isExpanded ? 'bg-accent-50/30 dark:bg-accent-900/10' : 'hover:bg-gray-50 dark:hover:bg-gray-800/60'}`}
      >
        <td className="px-6 py-4 whitespace-nowrap">
          <div className="flex items-center gap-3">
            <div
              className={`p-1 rounded-md transition-transform duration-200 ${isExpanded ? 'bg-accent-100 text-accent-600 rotate-180 dark:bg-accent-900 dark:text-accent-400' : 'text-gray-400 group-hover:text-gray-600'}`}
            >
              <LuChevronDown className="w-4 h-4" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-medium text-gray-900 dark:text-white group-hover:text-accent-600 dark:group-hover:text-accent-400 transition-colors">
                {job.name}
              </span>
              <span
                className="text-xs text-gray-400 dark:text-gray-500 font-mono truncate max-w-[200px]"
                title={job.image}
              >
                {job.image || 'Unknown Image'}
              </span>
            </div>
          </div>
        </td>
        <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">{job.namespace}</td>
        <td className="px-6 py-4">
          <JobStatusBadge status={job.status} />
        </td>
        <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
          {job.createdAt ? new Date(job.createdAt).toLocaleDateString() : '-'}
        </td>
        <td className="px-6 py-4 text-right">
          {!isExpanded && (
            <span className="text-xs text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-end gap-1">
              <LuServer className="w-3 h-3" />
              {job.podCount} Pods
            </span>
          )}
        </td>
      </tr>

      {/* Expanded Area */}
      {isExpanded && (
        <JobPodsList
          pods={pods}
          onViewPodLog={(pod, container) => onViewPodLog(job.namespace, pod, container)}
        />
      )}
    </>
  );
};

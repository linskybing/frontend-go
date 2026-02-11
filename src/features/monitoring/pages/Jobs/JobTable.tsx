// src/pages/Jobs/JobTable.tsx
import React from 'react';
import { Pagination } from '@nthucscc/components-shared';
import { LuActivity } from 'react-icons/lu';
import { InferredJob, JobPodMap } from './types';
import { JobRow } from './JobRow';

interface JobTableProps {
  jobs: InferredJob[];
  jobPodMap: JobPodMap;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onViewPodLog: (ns: string, pod: string, container: string) => void;
}

export const JobTable: React.FC<JobTableProps> = ({
  jobs,
  jobPodMap,
  currentPage,
  totalPages,
  onPageChange,
  onViewPodLog,
}) => {
  return (
    <div className="w-full bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-700 text-xs uppercase text-gray-500 bg-gray-50/50 dark:bg-gray-800/50 dark:text-gray-400">
              <th className="px-6 py-3 font-semibold w-2/6">Job Name / Image</th>
              <th className="px-6 py-3 font-semibold w-1/6">Namespace</th>
              <th className="px-6 py-3 font-semibold w-1/6">Live Status</th>
              <th className="px-6 py-3 font-semibold w-1/6">Detected At</th>
              <th className="px-6 py-3 font-semibold w-1/6 text-right">Pods</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-800 bg-white dark:bg-gray-900">
            {jobs.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-20 text-center">
                  <div className="flex flex-col items-center justify-center text-gray-400 dark:text-gray-500">
                    <LuActivity className="w-12 h-12 mb-3 opacity-20" />
                    <p>Waiting for Job Pods...</p>
                  </div>
                </td>
              </tr>
            ) : (
              jobs.map((job) => (
                <JobRow
                  key={`${job.namespace}-${job.name}`}
                  job={job}
                  pods={jobPodMap[job.name] || []}
                  onViewPodLog={onViewPodLog}
                />
              ))
            )}
          </tbody>
        </table>
      </div>
      {totalPages > 1 && (
        <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50/30 dark:bg-gray-800/30">
          <Pagination current={currentPage} total={totalPages} onPageChange={onPageChange} />
        </div>
      )}
    </div>
  );
};

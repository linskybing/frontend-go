import React from 'react';
import { LuBox, LuFileText } from 'react-icons/lu';
import { JobPod } from './types';

interface JobPodsListProps {
  pods: JobPod[];
  onViewPodLog: (pod: string, container: string) => void;
}

export const JobPodsList: React.FC<JobPodsListProps> = ({ pods, onViewPodLog }) => {
  if (pods.length === 0) {
    return (
      <tr className="bg-gray-50/50 dark:bg-gray-800/30">
        <td colSpan={6} className="px-6 py-3 text-xs text-center text-gray-500 italic">
          No active pods found for this job history.
        </td>
      </tr>
    );
  }

  return (
    <>
      {pods.map((pod) => (
        <React.Fragment key={pod.name}>
          {pod.containers.length > 0 ? (
            pod.containers.map((container) => (
              <tr
                key={`${pod.name}-${container}`}
                className="bg-gray-50/80 dark:bg-gray-800/50 border-b border-gray-100 dark:border-gray-700/50"
              >
                <td className="pl-12 pr-6 py-2 text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2">
                  <LuBox className="w-3.5 h-3.5 text-gray-400" />
                  <span className="font-mono text-xs">{pod.name}</span>
                  <span className="text-xs text-gray-400">/ {container}</span>
                </td>
                <td className="px-6 py-2 text-xs text-gray-500">{pod.namespace}</td>
                <td className="px-6 py-2 text-xs text-gray-500">{pod.status}</td>
                <td className="px-6 py-2 text-xs text-gray-500 text-right">-</td>
                <td className="px-6 py-2 text-right">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onViewPodLog(pod.name, container);
                    }}
                    className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium text-white bg-gray-600 rounded hover:bg-gray-700 transition-colors shadow-sm"
                  >
                    <LuFileText className="w-3 h-3" />
                    Pod Logs
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr className="bg-gray-50/80 dark:bg-gray-800/50">
              <td className="pl-12 pr-6 py-2 text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2">
                <LuBox className="w-3.5 h-3.5 text-gray-400" />
                <span className="font-mono text-xs">{pod.name}</span>
              </td>
              <td className="px-6 py-2 text-xs text-gray-500">{pod.namespace}</td>
              <td className="px-6 py-2 text-xs text-gray-500">{pod.status}</td>
              <td colSpan={2}></td>
            </tr>
          )}
        </React.Fragment>
      ))}
    </>
  );
};

// PodRow.tsx
import React, { useState } from 'react';
import { LuChevronDown } from 'react-icons/lu';
import { Pod, TranslateFn } from './types';
import { PodStatusBadge } from './PodStatusBadge';
import { ContainerRow } from './ContainerRow';

interface PodRowProps {
  pod: Pod;
  namespace: string;
  fetchPodLogs: (pod: string, container: string) => void;
  t: TranslateFn;
}

export const PodRow: React.FC<PodRowProps> = ({ pod, namespace, fetchPodLogs, t }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleConnect = (container: string) => {
    const url = `/terminal?namespace=${encodeURIComponent(namespace)}&pod=${encodeURIComponent(pod.name)}&container=${container}&command=/bin/bash&tty=true`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

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
                {pod.name}
              </span>
              <span className="text-xs text-gray-400 dark:text-gray-500 font-mono">
                {pod.containers.length} containers
              </span>
            </div>
          </div>
        </td>
        <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">{namespace}</td>
        <td className="px-6 py-4">
          <PodStatusBadge status={pod.status} />
        </td>
        <td className="px-6 py-4 text-right text-xs text-gray-400">
          {isExpanded ? (
            ''
          ) : (
            <span className="opacity-0 group-hover:opacity-100 transition-opacity">
              Click to view containers
            </span>
          )}
        </td>
      </tr>

      {isExpanded &&
        pod.containers.map((container) => (
          <ContainerRow
            key={`${pod.name}-${container}`}
            podName={pod.name}
            containerName={container}
            namespace={namespace}
            t={t}
            onConnect={() => handleConnect(container)}
            onLogs={() => fetchPodLogs(pod.name, container)}
          />
        ))}
    </>
  );
};

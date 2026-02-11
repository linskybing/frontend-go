// PodList.tsx
import React, { useEffect, useState, useMemo } from 'react';
import { useTranslation } from '@nthucscc/utils';
import { Pagination } from '@nthucscc/components-shared';
import { LuBox } from 'react-icons/lu';
import { Pod } from './types';
import { PodRow } from './PodRow';

interface PodListProps {
  namespace: string;
  pods: Pod[];
  fetchPodLogs: (podName: string, container: string) => void;
}

export const PodList: React.FC<PodListProps> = ({ namespace, pods, fetchPodLogs }) => {
  const { t } = useTranslation();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => setCurrentPage(1), [pods]);

  const totalPages = Math.ceil(pods.length / itemsPerPage);
  const paginatedPods = useMemo(() => {
    return pods.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  }, [pods, currentPage]);

  return (
    <div className="w-full">
      <div className="overflow-x-auto">
        <table className="min-w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-700 text-xs uppercase text-gray-500 bg-gray-50/50 dark:bg-gray-800/50 dark:text-gray-400">
              <th className="px-6 py-3 font-semibold w-2/5">{t('monitor.table.podName')}</th>
              <th className="px-6 py-3 font-semibold w-1/5">{t('monitor.table.namespace')}</th>
              <th className="px-6 py-3 font-semibold w-1/5">{t('monitor.table.status')}</th>
              <th className="px-6 py-3 font-semibold w-1/5 text-right">
                {t('monitor.table.actions')}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-800 bg-white dark:bg-gray-900">
            {paginatedPods.length === 0 ? (
              <tr>
                <td colSpan={4} className="py-12 text-center">
                  <div className="flex flex-col items-center justify-center text-gray-400 dark:text-gray-500">
                    <LuBox className="w-10 h-10 mb-2 opacity-20" />
                    <p>{t('monitor.empty.noPods')}</p>
                  </div>
                </td>
              </tr>
            ) : (
              paginatedPods.map((pod) => (
                <PodRow
                  key={`${namespace}-${pod.name}`}
                  pod={pod}
                  namespace={namespace}
                  fetchPodLogs={fetchPodLogs}
                  t={t}
                />
              ))
            )}
          </tbody>
        </table>
      </div>
      {totalPages > 1 && (
        <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50/30 dark:bg-gray-800/30">
          <Pagination current={currentPage} total={totalPages} onPageChange={setCurrentPage} />
        </div>
      )}
    </div>
  );
};

import React from 'react';
import { ResourceMessage } from './types';
import { useTranslation } from '@nthucscc/utils';

interface ResourceTableProps {
  resources: ResourceMessage[];
  visibleColumns: Set<string>;
}

export const ResourceTable: React.FC<ResourceTableProps> = ({ resources, visibleColumns }) => {
  const { t } = useTranslation();

  if (resources.length === 0) {
    return (
      <div className="p-8 text-center text-gray-500 dark:text-gray-400">{t('monitor.waiting')}</div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border-collapse">
        <thead className="bg-gray-100 dark:bg-gray-700">
          <tr>
            {visibleColumns.has('kind') && (
              <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
                {t('monitor.table.kind')}
              </th>
            )}
            {visibleColumns.has('name') && (
              <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
                {t('monitor.table.name')}
              </th>
            )}
            {visibleColumns.has('status') && (
              <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
                {t('monitor.table.status')}
              </th>
            )}
            {visibleColumns.has('age') && (
              <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
                {t('monitor.table.age')}
              </th>
            )}
          </tr>
        </thead>
        <tbody>
          {resources.map((resource, idx) => (
            <tr
              key={`${resource.kind}-${resource.name}-${idx}`}
              className="hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              {visibleColumns.has('kind') && (
                <td className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-sm">
                  {resource.kind}
                </td>
              )}
              {visibleColumns.has('name') && (
                <td className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-sm font-mono">
                  {resource.name}
                </td>
              )}
              {visibleColumns.has('status') && (
                <td className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-sm">
                  {resource.status}
                </td>
              )}
              {visibleColumns.has('age') && (
                <td className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-sm text-gray-600 dark:text-gray-400">
                  {resource.age}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ResourceTable;

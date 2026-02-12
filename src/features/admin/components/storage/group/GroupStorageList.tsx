import { useState, Fragment } from 'react';
import { TrashIcon, ChevronDownIcon } from '@heroicons/react/24/outline';
import GroupStoragePermissions from '@/features/groups/components/storage/GroupStoragePermissions';

interface GroupStorageListProps {
  storages: any[];
  loading: boolean;
  onDelete: (groupId: string, pvcId: string) => void;
  canManageForGroup: (groupId: string) => boolean;
}

export default function GroupStorageList({
  storages,
  loading,
  onDelete,
  canManageForGroup,
}: GroupStorageListProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  if (storages.length === 0) {
    return (
      <div className="bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-gray-700 p-8 text-center">
        <p className="text-gray-600 dark:text-gray-400">
          No group storages found. Create one to get started.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 dark:bg-slate-700/50 border-b border-gray-200 dark:border-gray-700">
            <tr>
              <th className="px-6 py-3 text-left font-semibold text-gray-900 dark:text-gray-100">
                Name
              </th>
              <th className="px-6 py-3 text-left font-semibold text-gray-900 dark:text-gray-100">
                Capacity
              </th>
              <th className="px-6 py-3 text-left font-semibold text-gray-900 dark:text-gray-100">
                Status
              </th>
              <th className="px-6 py-3 text-right font-semibold text-gray-900 dark:text-gray-100">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {storages.map((storage) => {
              const pvcId = storage.id || storage.pvcId;
              const rowKey = `${storage.groupId}-${pvcId}`;
              const isExpanded = expandedId === rowKey;

              return (
                <Fragment key={rowKey}>
                  <tr className="hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors">
                    <td className="px-6 py-4 text-gray-900 dark:text-gray-100">
                      {storage.pvcName || storage.name || 'N/A'}
                    </td>
                    <td className="px-6 py-4 text-gray-600 dark:text-gray-400">
                      {storage.capacity || storage.size || 'N/A'}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          storage.status === 'Ready' || storage.status === 'Bound'
                            ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400'
                            : 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400'
                        }`}
                      >
                        {storage.status || 'Pending'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="inline-flex items-center gap-2">
                        <button
                          onClick={() => setExpandedId(isExpanded ? null : rowKey)}
                          className="inline-flex items-center gap-2 px-3 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                        >
                          <ChevronDownIcon
                            className={`w-4 h-4 transition-transform ${
                              isExpanded ? 'rotate-180' : ''
                            }`}
                          />
                          Permissions
                        </button>
                        <button
                          onClick={() => onDelete(storage.groupId, pvcId)}
                          disabled={loading}
                          className="inline-flex items-center gap-2 px-3 py-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors disabled:opacity-50"
                        >
                          <TrashIcon className="w-4 h-4" />
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                  {isExpanded && pvcId && (
                    <tr>
                      <td colSpan={4} className="px-6 pb-6">
                        <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-slate-800/50 p-6">
                          <GroupStoragePermissions
                            groupId={storage.groupId}
                            pvcId={pvcId}
                            pvcName={storage.pvcName || storage.name || 'Storage'}
                            canManage={canManageForGroup(storage.groupId)}
                          />
                        </div>
                      </td>
                    </tr>
                  )}
                </Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

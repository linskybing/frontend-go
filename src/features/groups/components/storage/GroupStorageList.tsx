import { useEffect, useState, useCallback } from 'react';
import { useTranslation } from '@nthucscc/utils';
import { GroupPVC } from '@/core/interfaces/groupStorage';
import { groupStorageService } from '@/core/services/resource/groupStorageService';
import GroupStoragePermissions from './GroupStoragePermissions';
import { CubeIcon } from '@heroicons/react/24/outline';

interface GroupStorageListProps {
  groupId: string;
  canManage: boolean;
}

export default function GroupStorageList({ groupId, canManage }: GroupStorageListProps) {
  const { t } = useTranslation();
  const [storages, setStorages] = useState<GroupPVC[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedStorage, setExpandedStorage] = useState<string | null>(null);

  const fetchStorages = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await groupStorageService.getGroupStorages(groupId);
      setStorages(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : t('storage.loadFailed'));
    } finally {
      setLoading(false);
    }
  }, [groupId, t]);

  useEffect(() => {
    fetchStorages();
  }, [fetchStorages]);

  if (loading) {
    return (
      <div className="p-10 text-center text-gray-500 dark:text-gray-400">{t('common.loading')}</div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 dark:bg-red-900/30 rounded-lg border border-red-200 dark:border-red-800">
        <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
      </div>
    );
  }

  if (storages.length === 0) {
    return (
      <div className="text-center py-10">
        <CubeIcon className="h-12 w-12 text-gray-400 mx-auto mb-3" />
        <p className="text-gray-600 dark:text-gray-400">{t('storage.noGroupStorage')}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {storages.map((storage) => (
        <div
          key={storage.id}
          className="rounded-xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800 overflow-hidden"
        >
          <button
            onClick={() => setExpandedStorage(expandedStorage === storage.id ? null : storage.id)}
            className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
          >
            <div className="flex items-center gap-4">
              <CubeIcon className="h-6 w-6 text-gray-400 dark:text-gray-500" />
              <div className="text-left">
                <p className="font-medium text-gray-900 dark:text-white">{storage.pvcName}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                  {storage.size} - {storage.storageClass}
                </p>
              </div>
            </div>
            <span className="text-gray-400 dark:text-gray-500">
              {expandedStorage === storage.id ? '▼' : '▶'}
            </span>
          </button>

          {expandedStorage === storage.id && (
            <div className="border-t border-gray-200 dark:border-gray-700 p-6 bg-gray-50 dark:bg-gray-800/50">
              <GroupStoragePermissions
                groupId={groupId}
                pvcId={storage.id}
                pvcName={storage.pvcName}
                canManage={canManage}
              />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

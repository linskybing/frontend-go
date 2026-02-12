import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from '@nthucscc/utils';
import { StoragePermissionInfo, StoragePermission } from '@/core/interfaces/groupStorage';
import { groupStorageService } from '@/core/services/resource/groupStorageService';
import PermissionToggle from './PermissionToggle';

interface PermissionControlProps {
  groupId: string;
  pvcId: string;
  pvcName: string;
  canManage: boolean;
}

export default function PermissionControl({
  groupId,
  pvcId,
  pvcName,
  canManage,
}: PermissionControlProps) {
  const { t } = useTranslation();
  const [permissions, setPermissions] = useState<StoragePermissionInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPermissions = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await groupStorageService.listPVCPermissions(groupId, pvcId);
      setPermissions(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : t('storage.permissionError'));
    } finally {
      setLoading(false);
    }
  }, [groupId, pvcId, t]);

  useEffect(() => {
    fetchPermissions();
  }, [fetchPermissions]);

  const handlePermissionChange = async (userId: string, permission: StoragePermission) => {
    try {
      await groupStorageService.setStoragePermission({
        groupId,
        pvcId,
        userId,
        permission,
      });
      await fetchPermissions();
    } catch (err) {
      setError(err instanceof Error ? err.message : t('storage.updatePermissionFailed'));
    }
  };

  if (loading) {
    return (
      <div className="p-10 text-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">{t('common.loading')}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{pvcName}</h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {t('storage.permissionCount', { count: permissions.length })}
          </p>
        </div>
        <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
          <span className="flex items-center gap-1.5">
            <code className="font-mono text-green-600 dark:text-green-400">[rw-]</code>
            {t('storage.readWrite')}
          </span>
          <span className="flex items-center gap-1.5">
            <code className="font-mono text-blue-600 dark:text-blue-400">[r--]</code>
            {t('storage.readOnly')}
          </span>
          <span className="flex items-center gap-1.5">
            <code className="font-mono text-gray-400">[---]</code>
            No access
          </span>
        </div>
      </div>

      {error && (
        <div className="rounded-lg bg-red-50 p-4 dark:bg-red-900/30">
          <p className="text-sm text-red-700 dark:text-red-400">{error}</p>
        </div>
      )}

      {permissions.length > 0 ? (
        <div className="space-y-2">
          {permissions.map((perm) => (
            <PermissionToggle
              key={perm.userId}
              userId={perm.userId}
              username={perm.username}
              initialPermission={perm.permission}
              onPermissionChange={handlePermissionChange}
              disabled={!canManage}
            />
          ))}
        </div>
      ) : (
        <div className="rounded-lg border border-dashed border-gray-300 dark:border-gray-600 p-10 text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">{t('storage.noPermissions')}</p>
        </div>
      )}
    </div>
  );
}

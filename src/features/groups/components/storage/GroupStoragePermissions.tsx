import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from '@nthucscc/utils';
import { Button } from '@nthucscc/ui';
import { PlusIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import { StoragePermissionInfo } from '@/core/interfaces/groupStorage';
import { groupStorageService } from '@/core/services/resource/groupStorageService';
import PermissionRow from '@/features/groups/components/storage/PermissionRow';
import SetPermissionModal from '@/features/groups/components/storage/SetPermissionModal';

interface GroupStoragePermissionsProps {
  groupId: string;
  pvcId: string;
  pvcName: string;
  canManage: boolean;
}

export default function GroupStoragePermissions({
  groupId,
  pvcId,
  pvcName,
  canManage,
}: GroupStoragePermissionsProps) {
  const { t } = useTranslation();
  const [permissions, setPermissions] = useState<StoragePermissionInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isActionLoading, setIsActionLoading] = useState(false);

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

  const handleSetPermission = async (userId: string, permission: 'none' | 'read' | 'write') => {
    try {
      setIsActionLoading(true);
      await groupStorageService.setStoragePermission({
        groupId,
        pvcId,
        userId,
        permission,
      });
      await fetchPermissions();
      setIsModalOpen(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : t('storage.updatePermissionFailed'));
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleRevokePermission = async (userId: string) => {
    if (!window.confirm(t('storage.confirmRevoke'))) return;
    try {
      setIsActionLoading(true);
      await groupStorageService.setStoragePermission({
        groupId,
        pvcId,
        userId,
        permission: 'none',
      });
      await fetchPermissions();
    } catch (err) {
      setError(err instanceof Error ? err.message : t('storage.revokePermissionFailed'));
    } finally {
      setIsActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-10 text-center text-gray-500 dark:text-gray-400">{t('common.loading')}</div>
    );
  }

  return (
    <div className="space-y-6">
      {error && (
        <div className="rounded-lg bg-red-50 p-4 dark:bg-red-900/30">
          <div className="flex items-start gap-3">
            <ExclamationTriangleIcon className="h-5 w-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-red-800 dark:text-red-300">{t('common.error')}</h3>
              <p className="mt-1 text-sm text-red-700 dark:text-red-400">{error}</p>
            </div>
          </div>
        </div>
      )}

      {canManage && (
        <div className="flex justify-end">
          <Button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-2"
            disabled={isActionLoading}
          >
            <PlusIcon className="h-5 w-5" />
            {t('storage.grantPermission')}
          </Button>
        </div>
      )}

      <div className="rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800 overflow-hidden">
        <div className="border-b border-gray-200 p-4 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50">
          <h3 className="font-semibold text-gray-900 dark:text-white">{pvcName}</h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {t('storage.permissionCount', { count: permissions.length })}
          </p>
        </div>

        {permissions.length > 0 ? (
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {permissions.map((perm) => (
              <PermissionRow
                key={`${perm.userId}`}
                permission={perm}
                canManage={canManage}
                isLoading={isActionLoading}
                onRevoke={() => handleRevokePermission(perm.userId)}
              />
            ))}
          </div>
        ) : (
          <div className="p-10 text-center text-gray-500 dark:text-gray-400">
            {t('storage.noPermissions')}
          </div>
        )}
      </div>

      <SetPermissionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSet={handleSetPermission}
        isLoading={isActionLoading}
        currentPermissions={permissions}
        pvcName={pvcName}
      />
    </div>
  );
}

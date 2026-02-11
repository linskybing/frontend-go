import { useState } from 'react';
import { useTranslation } from '@nthucscc/utils';
import { Button } from '@nthucscc/ui';
import { StoragePermissionInfo } from '@/core/interfaces/groupStorage';
import { XMarkIcon } from '@heroicons/react/24/outline';

interface SetPermissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSet: (userid: string, permission: 'none' | 'read' | 'write') => Promise<void>;
  isLoading: boolean;
  currentPermissions: StoragePermissionInfo[];
  pvcName: string;
}

export default function SetPermissionModal({
  isOpen,
  onClose,
  onSet,
  isLoading,
  currentPermissions,
  pvcName,
}: SetPermissionModalProps) {
  const { t } = useTranslation();
  const [userId, setUserId] = useState('');
  const [permission, setPermission] = useState<'read' | 'write'>('read');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!userId.trim()) {
      setError(t('storage.userIdRequired'));
      return;
    }

    const userIdNum = parseInt(userId);
    if (isNaN(userIdNum) || userIdNum <= 0) {
      setError(t('storage.invalidUserId'));
      return;
    }

    if (currentPermissions.some((p) => p.userId === userIdNum)) {
      setError(t('storage.userAlreadyHasPermission'));
      return;
    }

    try {
      await onSet(userIdNum, permission);
      setUserId('');
      setPermission('read');
    } catch (err) {
      setError(err instanceof Error ? err.message : t('common.error'));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg max-w-md w-full mx-4 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            {t('storage.grantPermission')}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>

        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{pvcName}</p>

        {error && (
          <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/30 rounded-lg border border-red-200 dark:border-red-800">
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {t('storage.userId')}
            </label>
            <input
              type="number"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              placeholder={t('storage.userIdPlaceholder')}
              disabled={isLoading}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-accent-500 focus:border-accent-500 disabled:opacity-50"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t('storage.permissionLabel')}
            </label>
            <div className="space-y-2">
              {(['read', 'write'] as const).map((perm) => (
                <label key={perm} className="flex items-center">
                  <input
                    type="radio"
                    name="permission"
                    value={perm}
                    checked={permission === perm}
                    onChange={(e) => setPermission(e.target.value as 'read' | 'write')}
                    disabled={isLoading}
                    className="h-4 w-4 cursor-pointer disabled:opacity-50"
                  />
                  <span className="ml-2 text-sm text-gray-700 dark:text-gray-300 cursor-pointer capitalize">
                    {perm === 'read' && t('storage.read')}
                    {perm === 'write' && t('storage.write')}
                  </span>
                </label>
              ))}
            </div>
          </div>

          <div className="flex gap-2 pt-4">
            <Button variant="outline" onClick={onClose} disabled={isLoading} className="flex-1">
              {t('common.cancel')}
            </Button>
            <Button type="submit" disabled={isLoading} className="flex-1">
              {isLoading ? 'Saving...' : 'Set'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

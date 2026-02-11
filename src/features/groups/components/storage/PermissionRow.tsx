import { useTranslation } from '@nthucscc/utils';
import { StoragePermissionInfo } from '@/core/interfaces/groupStorage';
import { TrashIcon } from '@heroicons/react/24/outline';

interface PermissionRowProps {
  permission: StoragePermissionInfo;
  canManage: boolean;
  isLoading: boolean;
  onRevoke: () => void;
}

const getPermissionColor = (permission: string) => {
  switch (permission) {
    case 'write':
      return 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300';
    case 'read':
      return 'bg-accent-100 text-accent-800 dark:bg-accent-900/50 dark:text-accent-300';
    case 'none':
      return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const getPermissionLabel = (permission: string) => {
  switch (permission) {
    case 'write':
      return 'Write';
    case 'read':
      return 'Read';
    case 'none':
      return 'None';
    default:
      return 'Unknown';
  }
};

export default function PermissionRow({
  permission,
  canManage,
  isLoading,
  onRevoke,
}: PermissionRowProps) {
  const { t } = useTranslation();

  return (
    <div className="flex items-center justify-between px-6 py-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
      <div className="flex items-center gap-4">
        <div className="flex-shrink-0 h-8 w-8 rounded-full bg-accent-100 text-accent-600 font-bold flex items-center justify-center dark:bg-accent-900/30 dark:text-accent-400">
          {permission.username?.charAt(0).toUpperCase() || String(permission.userId).charAt(0)}
        </div>
        <div>
          <p className="text-sm font-medium text-gray-900 dark:text-white">
            {permission.username || t('storage.userId') + ': ' + permission.userId}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
            {t('common.createdAt')}: {new Date(permission.grantedAt).toLocaleString()}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <span
          className={`inline-flex items-center rounded-md px-2.5 py-0.5 text-xs font-medium ${getPermissionColor(
            permission.permission,
          )}`}
        >
          {getPermissionLabel(permission.permission)}
        </span>

        {canManage && (
          <button
            onClick={onRevoke}
            disabled={isLoading}
            className="p-2 text-gray-400 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/30 dark:hover:text-red-400 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            title={t('common.remove')}
          >
            <TrashIcon className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
}

import { useState, useEffect } from 'react';
import { useTranslation } from '@nthucscc/utils';
import { StoragePermission } from '@/core/interfaces/groupStorage';

interface PermissionToggleProps {
  userId: string;
  username: string;
  initialPermission: StoragePermission;
  onPermissionChange: (userId: string, permission: StoragePermission) => Promise<void>;
  disabled?: boolean;
}

export default function PermissionToggle({
  userId,
  username,
  initialPermission,
  onPermissionChange,
  disabled = false,
}: PermissionToggleProps) {
  const { t } = useTranslation();
  const [canRead, setCanRead] = useState(initialPermission !== 'none');
  const [canWrite, setCanWrite] = useState(initialPermission === 'write');
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    setCanRead(initialPermission !== 'none');
    setCanWrite(initialPermission === 'write');
  }, [initialPermission]);

  const handleReadToggle = async (checked: boolean) => {
    if (isUpdating) return;

    setIsUpdating(true);
    try {
      if (!checked) {
        // Disabling read also disables write
        setCanRead(false);
        setCanWrite(false);
        await onPermissionChange(userId, 'none');
      } else {
        setCanRead(true);
        await onPermissionChange(userId, canWrite ? 'write' : 'read');
      }
    } finally {
      setIsUpdating(false);
    }
  };

  const handleWriteToggle = async (checked: boolean) => {
    if (isUpdating) return;

    setIsUpdating(true);
    try {
      if (checked) {
        // Enabling write auto-enables read
        setCanRead(true);
        setCanWrite(true);
        await onPermissionChange(userId, 'write');
      } else {
        setCanWrite(false);
        await onPermissionChange(userId, 'read');
      }
    } finally {
      setIsUpdating(false);
    }
  };

  // Linux-style permission badge
  const getPermissionBadge = () => {
    if (!canRead && !canWrite) return '[---]';
    if (canRead && !canWrite) return '[r--]';
    if (canRead && canWrite) return '[rw-]';
    return '[---]';
  };

  const getBadgeColor = () => {
    if (canWrite) return 'text-green-600 dark:text-green-400';
    if (canRead) return 'text-blue-600 dark:text-blue-400';
    return 'text-gray-400 dark:text-gray-500';
  };

  return (
    <div className="flex items-center justify-between p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
      <div className="flex items-center gap-3">
        <code
          className={`font-mono text-sm font-bold ${getBadgeColor()}`}
          title="Linux permissions"
        >
          {getPermissionBadge()}
        </code>
        <span className="text-sm font-medium text-gray-900 dark:text-white">{username}</span>
      </div>

      <div className="flex items-center gap-4">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={canRead}
            onChange={(e) => handleReadToggle(e.target.checked)}
            disabled={disabled || isUpdating}
            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 disabled:opacity-50"
          />
          <span className="text-sm text-gray-700 dark:text-gray-300">{t('storage.read')}</span>
        </label>

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={canWrite}
            onChange={(e) => handleWriteToggle(e.target.checked)}
            disabled={disabled || isUpdating || !canRead}
            className="rounded border-gray-300 text-green-600 focus:ring-green-500 disabled:opacity-50"
          />
          <span className="text-sm text-gray-700 dark:text-gray-300">{t('storage.write')}</span>
        </label>
      </div>
    </div>
  );
}

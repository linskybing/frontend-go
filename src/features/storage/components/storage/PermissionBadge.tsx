import React from 'react';
import { useTranslation } from '@nthucscc/utils';
import { LockClosedIcon, LockOpenIcon, EyeIcon } from '@heroicons/react/24/outline';

interface PermissionBadgeProps {
  permission: 'none' | 'read' | 'write';
}

/**
 * PermissionBadge - Displays user's permission level for storage
 */
export const PermissionBadge: React.FC<PermissionBadgeProps> = ({ permission }) => {
  const { t } = useTranslation();

  const getStyle = () => {
    switch (permission) {
      case 'write':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'read':
        return 'bg-accent-100 text-accent-800 dark:bg-accent-900 dark:text-accent-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getIcon = () => {
    if (permission === 'write') return <LockOpenIcon className="h-4 w-4" />;
    if (permission === 'read') return <EyeIcon className="h-4 w-4" />;
    return <LockClosedIcon className="h-4 w-4" />;
  };

  const getText = () => {
    switch (permission) {
      case 'write':
        return t('storage.permission.write') || 'Read & Write';
      case 'read':
        return t('storage.permission.read') || 'Read Only';
      default:
        return t('storage.permission.none') || 'No Access';
    }
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${getStyle()}`}
    >
      {getIcon()}
      {getText()}
    </span>
  );
};

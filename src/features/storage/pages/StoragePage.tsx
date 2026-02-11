import React from 'react';
import { useTranslation } from '@nthucscc/utils';
import { ServerStackIcon, UserCircleIcon } from '@heroicons/react/24/outline';
import UserStorageManagement from '@/features/admin/components/storage/user/UserStorageManagement';

/**
 * StoragePage - Admin storage management interface
 * Manages user storage hubs
 */
const StoragePage: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Page Header */}
      <div className="mb-8 flex items-center space-x-3">
        <div className="p-2 bg-accent-100 dark:bg-accent-900/30 rounded-lg">
          <ServerStackIcon className="w-8 h-8 text-accent-600 dark:text-accent-400" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">
            {t('admin.storage.title') || 'Storage Administration'}
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Manage user personal storage hubs.
          </p>
        </div>
      </div>

      {/* Tab Header */}
      <div className="mb-6 flex items-center gap-2">
        <UserCircleIcon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          {t('admin.storage.tab.user') || 'User Storage Hubs'}
        </h2>
      </div>

      {/* Content */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 sm:p-8">
        <UserStorageManagement />
      </div>
    </div>
  );
};

export default StoragePage;

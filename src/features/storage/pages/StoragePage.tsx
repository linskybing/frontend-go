import React, { useState } from 'react';
import { useTranslation } from '@nthucscc/utils';
import { ServerStackIcon, UserCircleIcon } from '@heroicons/react/24/outline';
import UserStorageManagement from '@/features/admin/components/storage/user/UserStorageManagement';
import GroupStorageManagement from '@/features/admin/components/storage/group/GroupStorageManagement';

/**
 * StoragePage - Admin storage management interface
 * Manages both user storage hubs and group storage
 */
const StoragePage: React.FC = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<'user' | 'group'>('user');

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
            Manage user personal storage hubs and group storage.
          </p>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="mb-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex gap-8">
          <button
            onClick={() => setActiveTab('user')}
            className={`py-3 px-2 font-semibold border-b-2 transition-colors ${
              activeTab === 'user'
                ? 'border-accent-600 text-accent-600 dark:text-accent-400'
                : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-300'
            }`}
          >
            <div className="flex items-center gap-2">
              <UserCircleIcon className="w-5 h-5" />
              User Storage Hubs
            </div>
          </button>
          <button
            onClick={() => setActiveTab('group')}
            className={`py-3 px-2 font-semibold border-b-2 transition-colors ${
              activeTab === 'group'
                ? 'border-accent-600 text-accent-600 dark:text-accent-400'
                : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-300'
            }`}
          >
            <div className="flex items-center gap-2">
              <ServerStackIcon className="w-5 h-5" />
              Group Storage
            </div>
          </button>
        </div>
      </div>

      {/* Tab Content */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 sm:p-8">
        {activeTab === 'user' && <UserStorageManagement />}
        {activeTab === 'group' && <GroupStorageManagement />}
      </div>
    </div>
  );
};

export default StoragePage;

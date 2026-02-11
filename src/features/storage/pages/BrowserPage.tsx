import { useState } from 'react';
import { useTranslation } from '@nthucscc/utils';
import { PageLayout } from '@nthucscc/ui';
import { UserCircleIcon, UserGroupIcon } from '@heroicons/react/24/outline';

import { PersonalHub } from '../components/storage/PersonalHub';
import { GroupStorageManager } from '@/features/storage/components/storage/GroupStorageManager';

/**
 * BrowserPage - Main storage management interface
 * Provides unified access to Personal Hub and Group Storage
 */
function BrowserPage() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<'personal' | 'group'>('personal');

  return (
    <PageLayout
      title={`${t('storage.pageTitle')} | Platform`}
      breadcrumb={t('storage.breadcrumb')}
      noPadding
    >
      <div className="space-y-6 max-w-7xl mx-auto">
        {/* Tab Navigation */}
        <div className="bg-white dark:bg-gray-800 p-1.5 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 inline-flex">
          <button
            onClick={() => setActiveTab('personal')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-bold transition-all ${
              activeTab === 'personal'
                ? 'bg-accent-50 text-accent-600 dark:bg-gray-700 dark:text-white shadow-sm ring-1 ring-black/5'
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50'
            }`}
          >
            <UserCircleIcon className="h-5 w-5" /> {t('storage.tab.personal')}
          </button>
          <button
            onClick={() => setActiveTab('group')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-bold transition-all ${
              activeTab === 'group'
                ? 'bg-accent-50 text-accent-600 dark:bg-gray-700 dark:text-white shadow-sm ring-1 ring-black/5'
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50'
            }`}
          >
            <UserGroupIcon className="h-5 w-5" /> {t('storage.tab.group')}
          </button>
        </div>

        {/* Content Area */}
        <div className="min-h-[500px] animate-in fade-in slide-in-from-bottom-2 duration-300">
          {activeTab === 'personal' && <PersonalHub />}
          {activeTab === 'group' && <GroupStorageManager />}
        </div>
      </div>
    </PageLayout>
  );
}

export default BrowserPage;

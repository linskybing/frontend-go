import React, { useState } from 'react';
import { useTranslation } from '@nthucscc/utils';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { useGroupStorage } from './useGroupStorage';
import { StorageCard } from './StorageCard';

/**
 * GroupStorageManager - Main group storage management component
 * Displays user's accessible group storages with permission controls
 */
export const GroupStorageManager: React.FC = () => {
  const { t } = useTranslation();
  const { storages, loading, isActionLoading, handleAction, handleOpen, getFileBrowserStatus } =
    useGroupStorage();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredStorages = storages.filter(
    (s) =>
      (s.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (s.pvcName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (s.namespace || '').toLowerCase().includes(searchTerm.toLowerCase()),
  );

  if (loading) {
    return (
      <div className="p-10 text-center text-gray-400 animate-pulse">{t('storage.scanning')}</div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Search Toolbar */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm">
        <div className="relative w-full sm:w-72">
          <MagnifyingGlassIcon className="absolute inset-y-0 left-3 h-5 w-5 text-gray-400" />
          <input
            type="text"
            className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-accent-500"
            placeholder={t('search.groupStoragePlaceholder') || 'Search group storages...'}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="text-sm text-gray-500 dark:text-gray-400">
          {filteredStorages.length} {t('storage.groupStoragesAvailable')}
        </div>
      </div>

      {/* Storage Cards */}
      {filteredStorages.length > 0 ? (
        <div className="grid gap-4">
          {filteredStorages.map((storage) => (
            <StorageCard
              key={storage.id}
              storage={storage}
              isOnline={getFileBrowserStatus(storage.namespace) === 'online'}
              isLoading={isActionLoading[storage.id]}
              onStart={() => handleAction(storage, 'start')}
              onStop={() => handleAction(storage, 'stop')}
              onOpen={() => handleOpen(storage)}
            />
          ))}
        </div>
      ) : (
        <div className="py-20 text-center border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-2xl">
          <p className="text-gray-500 dark:text-gray-400">
            {searchTerm ? t('storage.noResultsFilter') : t('storage.noGroupStorages')}
          </p>
        </div>
      )}
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { useTranslation } from '@nthucscc/utils';
import {
  UserIcon,
  PlayCircleIcon,
  TrashIcon,
  ArrowsPointingOutIcon,
  MagnifyingGlassIcon, // Icon for "Check"
  CheckCircleIcon,
  ExclamationTriangleIcon,
  QuestionMarkCircleIcon,
} from '@heroicons/react/24/outline';

// Services
import {
  initUserStorage,
  expandUserStorage,
  deleteUserStorage,
  checkUserStorageStatus,
} from '@/core/services/storageService';
import { Button } from '@nthucscc/ui';

// Define possible states for the storage hub
type StorageStatus = 'unknown' | 'exists' | 'missing';

const UserStorageManagement: React.FC = () => {
  const { t } = useTranslation();

  // State
  const [targetUser, setTargetUser] = useState('');
  const [storageStatus, setStorageStatus] = useState<StorageStatus>('unknown');
  const [expandSize, setExpandSize] = useState('1Ti');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Effect: Reset status to 'unknown' whenever the username input changes.
  // This prevents performing actions on the wrong user.
  useEffect(() => {
    setStorageStatus('unknown');
    setMessage(null);
  }, [targetUser]);

  // Handler: Check if storage exists
  const handleCheckStatus = async () => {
    if (!targetUser) return;
    setLoading(true);
    try {
      const exists = await checkUserStorageStatus(targetUser);
      setStorageStatus(exists ? 'exists' : 'missing');
      setMessage(null); // Clear previous messages
    } catch (_error: unknown) {
      setStorageStatus('unknown');
    } finally {
      setLoading(false);
    }
  };

  // Handler: Dispatch actions (Init / Delete / Expand)
  const handleAction = async (action: 'init' | 'delete' | 'expand') => {
    if (!targetUser) return;
    setLoading(true);
    setMessage(null);
    try {
      if (action === 'init') {
        await initUserStorage(targetUser);
        setMessage({
          type: 'success',
          text: t('admin.storage.user.successInit'),
        });
        setStorageStatus('exists'); // Update state locally on success
      } else if (action === 'delete') {
        // Double confirmation for deletion
        if (!window.confirm(t('admin.storage.user.confirmDelete'))) {
          setLoading(false);
          return;
        }
        await deleteUserStorage(targetUser);
        setMessage({
          type: 'success',
          text: t('admin.storage.user.successDelete'),
        });
        setStorageStatus('missing'); // Update state locally on success
      } else {
        await expandUserStorage(targetUser, expandSize);
        setMessage({
          type: 'success',
          text: t('admin.storage.user.successExpand'),
        });
      }
    } catch (err: unknown) {
      const e = err as { message?: string };
      setMessage({ type: 'error', text: e.message || 'Operation failed' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* 1. Target User Input & Status Check */}
      <div className="bg-gray-50 dark:bg-gray-900/50 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
          <UserIcon className="w-5 h-5 text-violet-500" />
          {t('admin.storage.user.targetUser')}
        </h3>

        <div className="flex gap-4 items-end max-w-xl">
          <div className="flex-grow">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {t('admin.storage.user.username')}
            </label>
            <input
              type="text"
              value={targetUser}
              onChange={(e) => setTargetUser(e.target.value)}
              placeholder={t('admin.storage.user.usernamePlaceholder')}
              className="block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-800 p-2.5 border"
            />
          </div>
          {/* Check Button */}
          <Button
            onClick={handleCheckStatus}
            disabled={!targetUser || loading}
            className="bg-gray-800 hover:bg-gray-700 text-white flex items-center gap-2"
          >
            <MagnifyingGlassIcon className="w-4 h-4" />
            {t('admin.storage.user.checkStatus')}
          </Button>
        </div>

        {/* Visual Status Indicator */}
        {targetUser && storageStatus !== 'unknown' && (
          <div
            className={`mt-4 flex items-center gap-2 text-sm font-medium animate-in fade-in ${
              storageStatus === 'exists' ? 'text-green-600' : 'text-orange-600'
            }`}
          >
            {storageStatus === 'exists' ? (
              <>
                <CheckCircleIcon className="w-5 h-5" /> {t('admin.storage.user.statusExists')}
              </>
            ) : (
              <>
                <QuestionMarkCircleIcon className="w-5 h-5" />{' '}
                {t('admin.storage.user.statusMissing')}
              </>
            )}
          </div>
        )}
      </div>

      {/* Feedback Message */}
      {message && (
        <div
          className={`p-4 rounded-md flex items-center gap-3 ${message.type === 'success' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'} border`}
        >
          {message.type === 'success' ? (
            <CheckCircleIcon className="w-5 h-5" />
          ) : (
            <ExclamationTriangleIcon className="w-5 h-5" />
          )}
          <span className="text-sm font-medium">{message.text}</span>
        </div>
      )}

      {/* 2. Action Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Card 1: Lifecycle (Mutually Exclusive Init/Delete) */}
        <div className="border border-gray-200 dark:border-gray-700 rounded-xl p-6 bg-white dark:bg-gray-800 flex flex-col">
          <div className="flex items-center gap-3 mb-4">
            <div
              className={`p-2 rounded-lg transition-colors ${storageStatus === 'exists' ? 'bg-red-100 text-red-600' : 'bg-accent-100 text-accent-600'}`}
            >
              {storageStatus === 'exists' ? (
                <TrashIcon className="w-6 h-6" />
              ) : (
                <PlayCircleIcon className="w-6 h-6" />
              )}
            </div>
            <h4 className="font-semibold text-gray-900 dark:text-gray-100">
              {t('admin.storage.user.lifecycleTitle')}
            </h4>
          </div>

          <div className="flex-grow mb-6 text-sm">
            {storageStatus === 'unknown' && (
              <p className="text-gray-500 italic">{t('admin.storage.user.hintUnknown')}</p>
            )}
            {storageStatus === 'missing' && (
              <p className="text-gray-500">{t('admin.storage.user.hintMissing')}</p>
            )}
            {storageStatus === 'exists' && (
              <p className="text-gray-500">{t('admin.storage.user.hintExists')}</p>
            )}
          </div>

          {/* Conditional Rendering for Buttons */}
          {storageStatus === 'missing' && (
            <Button
              onClick={() => handleAction('init')}
              disabled={loading}
              className="w-full bg-accent-600 hover:bg-accent-700 text-white"
            >
              {loading ? t('admin.storage.user.processing') : t('admin.storage.user.initBtn')}
            </Button>
          )}

          {storageStatus === 'exists' && (
            <Button
              onClick={() => handleAction('delete')}
              disabled={loading}
              className="w-full bg-red-50 text-red-600 border border-red-200 hover:bg-red-600 hover:text-white transition-all"
            >
              {loading ? t('admin.storage.user.processing') : t('admin.storage.user.deleteBtn')}
            </Button>
          )}

          {storageStatus === 'unknown' && (
            <Button
              disabled
              className="w-full bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200"
            >
              {t('admin.storage.user.checkStatusFirst')}
            </Button>
          )}
        </div>

        {/* Card 2: Expansion (Disabled if storage missing) */}
        <div
          className={`border border-gray-200 dark:border-gray-700 rounded-xl p-6 bg-white dark:bg-gray-800 flex flex-col transition-all duration-300 ${storageStatus !== 'exists' ? 'opacity-50 pointer-events-none grayscale' : ''}`}
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg text-orange-600">
              <ArrowsPointingOutIcon className="w-6 h-6" />
            </div>
            <h4 className="font-semibold text-gray-900 dark:text-gray-100">
              {t('admin.storage.user.expandTitle')}
            </h4>
          </div>

          <div className="mb-4">
            <label className="text-xs text-gray-500 mb-1 block font-medium">
              {t('admin.storage.user.newSize')}
            </label>
            <input
              type="text"
              value={expandSize}
              onChange={(e) => setExpandSize(e.target.value)}
              placeholder={t('admin.storage.user.newSizePlaceholder')}
              className="block w-full rounded-md border-gray-300 dark:bg-gray-900 dark:border-gray-600 p-2 border"
            />
          </div>

          <Button
            onClick={() => handleAction('expand')}
            disabled={storageStatus !== 'exists' || loading}
            className="w-full bg-orange-600 hover:bg-orange-700 text-white"
          >
            {loading ? t('admin.storage.user.processing') : t('admin.storage.user.expandBtn')}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default UserStorageManagement;

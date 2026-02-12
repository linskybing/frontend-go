import { useState } from 'react';
import { useTranslation } from '@nthucscc/utils';
import { Button, BaseModal } from '@nthucscc/ui';
import {
  PlayCircleIcon,
  TrashIcon,
  ArrowsPointingOutIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/outline';

type StorageStatus = 'unknown' | 'exists' | 'missing';

interface UserStorageActionsProps {
  targetUser: string;
  storageStatus: StorageStatus;
  expandSize: string;
  onExpandSizeChange: (size: string) => void;
  loading: boolean;
  onInit: () => void;
  onDelete: () => void;
  onExpand: () => void;
}

export default function UserStorageActions({
  targetUser,
  storageStatus,
  expandSize,
  onExpandSizeChange,
  loading,
  onInit,
  onDelete,
  onExpand,
}: UserStorageActionsProps) {
  const { t } = useTranslation();
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleDeleteConfirm = () => {
    setShowDeleteModal(false);
    onDelete();
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Card 1: Lifecycle (Mutually Exclusive Init/Delete) */}
        <div className="border border-gray-200 dark:border-gray-700 rounded-xl p-6 bg-white dark:bg-slate-800 flex flex-col shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3 mb-4">
            <div
              className={`p-2 rounded-lg transition-colors ${
                storageStatus === 'exists'
                  ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'
                  : 'bg-accent-100 dark:bg-accent-900/30 text-accent-600 dark:text-accent-400'
              }`}
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

          <div className="flex-grow mb-6 text-sm text-gray-600 dark:text-gray-400">
            {storageStatus === 'unknown' && (
              <p className="italic">{t('admin.storage.user.hintUnknown')}</p>
            )}
            {storageStatus === 'missing' && <p>{t('admin.storage.user.hintMissing')}</p>}
            {storageStatus === 'exists' && <p>{t('admin.storage.user.hintExists')}</p>}
          </div>

          {/* Conditional Rendering for Buttons */}
          {storageStatus === 'missing' && (
            <Button
              onClick={onInit}
              disabled={loading}
              className="w-full bg-accent-600 hover:bg-accent-700 text-white"
            >
              {loading ? t('admin.storage.user.processing') : t('admin.storage.user.initBtn')}
            </Button>
          )}

          {storageStatus === 'exists' && (
            <Button
              onClick={() => setShowDeleteModal(true)}
              disabled={loading}
              className="w-full bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800 hover:bg-red-600 hover:text-white dark:hover:bg-red-600 transition-all"
            >
              {loading ? t('admin.storage.user.processing') : t('admin.storage.user.deleteBtn')}
            </Button>
          )}

          {storageStatus === 'unknown' && (
            <Button
              disabled
              className="w-full bg-gray-100 dark:bg-slate-700 text-gray-400 cursor-not-allowed border border-gray-200 dark:border-gray-700"
            >
              {t('admin.storage.user.checkStatusFirst')}
            </Button>
          )}
        </div>

        {/* Card 2: Expansion (Disabled if storage missing) */}
        <div
          className={`border border-gray-200 dark:border-gray-700 rounded-xl p-6 bg-white dark:bg-slate-800 flex flex-col shadow-sm hover:shadow-md transition-all duration-300 ${
            storageStatus !== 'exists' ? 'opacity-50 pointer-events-none grayscale' : ''
          }`}
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg text-orange-600 dark:text-orange-400">
              <ArrowsPointingOutIcon className="w-6 h-6" />
            </div>
            <h4 className="font-semibold text-gray-900 dark:text-gray-100">
              {t('admin.storage.user.expandTitle')}
            </h4>
          </div>

          <div className="mb-4 flex-grow">
            <label className="text-xs text-gray-500 dark:text-gray-400 mb-1 block font-medium">
              {t('admin.storage.user.newSize')}
            </label>
            <input
              type="text"
              value={expandSize}
              onChange={(e) => onExpandSizeChange(e.target.value)}
              placeholder={t('admin.storage.user.newSizePlaceholder')}
              className="block w-full rounded-md border-gray-300 dark:bg-slate-700 dark:border-gray-600 dark:text-white p-2 border focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>

          <Button
            onClick={onExpand}
            disabled={storageStatus !== 'exists' || loading}
            className="w-full bg-orange-600 hover:bg-orange-700 text-white"
          >
            {loading ? t('admin.storage.user.processing') : t('admin.storage.user.expandBtn')}
          </Button>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <BaseModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Confirm storage delete"
      >
        <div className="space-y-4">
          <div className="flex items-start gap-3 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
            <ExclamationTriangleIcon className="w-6 h-6 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
            <div className="text-sm">
              <p className="font-medium text-red-800 dark:text-red-300">
                {t('admin.storage.user.confirmDelete')}
              </p>
              <p className="mt-1 text-red-700 dark:text-red-400">
                This will remove storage for {targetUser} and cannot be undone.
              </p>
            </div>
          </div>

          <div className="flex gap-3 justify-end">
            <Button
              onClick={() => setShowDeleteModal(false)}
              className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
            >
              {t('common.cancel')}
            </Button>
            <Button
              onClick={handleDeleteConfirm}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {t('common.delete')}
            </Button>
          </div>
        </div>
      </BaseModal>
    </>
  );
}

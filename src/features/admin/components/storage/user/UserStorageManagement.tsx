import { useState, useEffect } from 'react';
import { useTranslation } from '@nthucscc/utils';
import { CheckCircleIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';

// Services
import {
  checkUserStorageStatus,
  deleteUserStorage,
  expandUserStorage,
  initUserStorage,
} from '@/core/services/resource/storage';

// Components
import UserStorageForm from './UserStorageForm';
import UserStorageActions from './UserStorageActions';

// Define possible states for the storage hub
type StorageStatus = 'unknown' | 'exists' | 'missing';

export default function UserStorageManagement() {
  const { t } = useTranslation();

  // State
  const [targetUser, setTargetUser] = useState('');
  const [storageStatus, setStorageStatus] = useState<StorageStatus>('unknown');
  const [expandSize, setExpandSize] = useState('1Ti');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Reset status when username changes
  useEffect(() => {
    setStorageStatus('unknown');
    setMessage(null);
  }, [targetUser]);

  // Check if storage exists
  const handleCheckStatus = async () => {
    if (!targetUser) return;
    setLoading(true);
    try {
      const exists = await checkUserStorageStatus(targetUser);
      setStorageStatus(exists ? 'exists' : 'missing');
      setMessage(null);
    } catch {
      setStorageStatus('unknown');
    } finally {
      setLoading(false);
    }
  };

  // Initialize storage
  const handleInit = async () => {
    if (!targetUser) return;
    setLoading(true);
    setMessage(null);
    try {
      await initUserStorage(targetUser);
      setMessage({
        type: 'success',
        text: t('admin.storage.user.successInit'),
      });
      setStorageStatus('exists');
    } catch (err) {
      const e = err as { message?: string };
      setMessage({ type: 'error', text: e.message || 'Operation failed' });
    } finally {
      setLoading(false);
    }
  };

  // Delete storage
  const handleDelete = async () => {
    if (!targetUser) return;
    setLoading(true);
    setMessage(null);
    try {
      await deleteUserStorage(targetUser);
      setMessage({
        type: 'success',
        text: t('admin.storage.user.successDelete'),
      });
      setStorageStatus('missing');
    } catch (err) {
      const e = err as { message?: string };
      setMessage({ type: 'error', text: e.message || 'Operation failed' });
    } finally {
      setLoading(false);
    }
  };

  // Expand storage
  const handleExpand = async () => {
    if (!targetUser) return;
    setLoading(true);
    setMessage(null);
    try {
      await expandUserStorage(targetUser, expandSize);
      setMessage({
        type: 'success',
        text: t('admin.storage.user.successExpand'),
      });
    } catch (err) {
      const e = err as { message?: string };
      setMessage({ type: 'error', text: e.message || 'Operation failed' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <UserStorageForm
        targetUser={targetUser}
        onTargetUserChange={setTargetUser}
        storageStatus={storageStatus}
        loading={loading}
        onCheckStatus={handleCheckStatus}
      />

      {/* Feedback Message */}
      {message && (
        <div
          className={`p-4 rounded-md flex items-center gap-3 ${
            message.type === 'success'
              ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800'
              : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 border-red-200 dark:border-red-800'
          } border`}
        >
          {message.type === 'success' ? (
            <CheckCircleIcon className="w-5 h-5" />
          ) : (
            <ExclamationTriangleIcon className="w-5 h-5" />
          )}
          <span className="text-sm font-medium">{message.text}</span>
        </div>
      )}

      <UserStorageActions
        targetUser={targetUser}
        storageStatus={storageStatus}
        expandSize={expandSize}
        onExpandSizeChange={setExpandSize}
        loading={loading}
        onInit={handleInit}
        onDelete={handleDelete}
        onExpand={handleExpand}
      />
    </div>
  );
}

import { useTranslation } from '@nthucscc/utils';
import { Button } from '@nthucscc/ui';
import {
  UserIcon,
  MagnifyingGlassIcon,
  CheckCircleIcon,
  QuestionMarkCircleIcon,
} from '@heroicons/react/24/outline';

type StorageStatus = 'unknown' | 'exists' | 'missing';

interface UserStorageFormProps {
  targetUser: string;
  onTargetUserChange: (user: string) => void;
  storageStatus: StorageStatus;
  loading: boolean;
  onCheckStatus: () => void;
}

export default function UserStorageForm({
  targetUser,
  onTargetUserChange,
  storageStatus,
  loading,
  onCheckStatus,
}: UserStorageFormProps) {
  const { t } = useTranslation();

  return (
    <div className="bg-gray-50 dark:bg-slate-800/60 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
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
            onChange={(e) => onTargetUserChange(e.target.value)}
            placeholder={t('admin.storage.user.usernamePlaceholder')}
            className="block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-800 p-2.5 border focus:ring-2 focus:ring-violet-500 focus:border-transparent"
          />
        </div>
        <Button
          onClick={onCheckStatus}
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
          className={`mt-4 flex items-center gap-2 text-sm font-medium animate-in fade-in duration-300 ${
            storageStatus === 'exists'
              ? 'text-green-600 dark:text-green-400'
              : 'text-orange-600 dark:text-orange-400'
          }`}
        >
          {storageStatus === 'exists' ? (
            <>
              <CheckCircleIcon className="w-5 h-5" /> {t('admin.storage.user.statusExists')}
            </>
          ) : (
            <>
              <QuestionMarkCircleIcon className="w-5 h-5" /> {t('admin.storage.user.statusMissing')}
            </>
          )}
        </div>
      )}
    </div>
  );
}

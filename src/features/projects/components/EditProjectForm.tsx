import React, { ChangeEvent, FormEvent, useState, useEffect, useRef } from 'react';
import { useTranslation } from '@nthucscc/utils';
import { InputField } from '@/features/forms/components/form';
import { Button } from '@nthucscc/ui';

const SpinnerIcon = ({ className = 'w-4 h-4' }) => (
  <svg
    className={`animate-spin ${className}`}
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
  >
    <circle
      className="opacity-25"
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="4"
    ></circle>
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
    ></path>
  </svg>
);

const AlertIcon = ({ className = 'w-5 h-5' }) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.398 16c-.77 1.333.192 3 1.732 3z"
    />
  </svg>
);

interface EditProjectFormProps {
  projectName: string;
  description: string;
  gpuQuota: number;
  gpuAccess: string[];
  mpsMemory: number;
  maxConcurrentJobsPerUser: number;
  maxQueuedJobsPerUser: number;
  maxJobRuntimeSeconds: number;
  maxProjectUsers: number;
  scheduleWindows: { weekday: number; start: string; end: string }[];
  loading: boolean;
  error: string | null;
  isOpen: boolean;
  onClose: () => void;
  onProjectNameChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onDescriptionChange: (e: ChangeEvent<HTMLTextAreaElement>) => void;
  onGpuQuotaChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onGpuAccessChange: (access: string) => void;
  onMpsMemoryChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onMaxConcurrentJobsPerUserChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onMaxQueuedJobsPerUserChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onMaxJobRuntimeSecondsChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onMaxProjectUsersChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onScheduleWindowChange: (index: number, field: 'weekday' | 'start' | 'end', value: string | number) => void;
  addScheduleWindow: () => void;
  removeScheduleWindow: (index: number) => void;
  onSubmit: (e: FormEvent) => void;
}

const EditProjectForm: React.FC<EditProjectFormProps> = ({
  projectName,
  description,
  gpuQuota,
  gpuAccess,
  mpsMemory,
  maxConcurrentJobsPerUser,
  maxQueuedJobsPerUser,
  maxJobRuntimeSeconds,
  maxProjectUsers,
  scheduleWindows,
  loading,
  error,
  isOpen,
  onClose,
  onProjectNameChange,
  onDescriptionChange,
  onGpuQuotaChange,
  onGpuAccessChange,
  onMpsMemoryChange,
  onMaxConcurrentJobsPerUserChange,
  onMaxQueuedJobsPerUserChange,
  onMaxJobRuntimeSecondsChange,
  onMaxProjectUsersChange,
  onScheduleWindowChange,
  addScheduleWindow,
  removeScheduleWindow,
  onSubmit,
}) => {
  const { t } = useTranslation();
  const weekdayOptions = [
    { value: 0, label: 'Sun' },
    { value: 1, label: 'Mon' },
    { value: 2, label: 'Tue' },
    { value: 3, label: 'Wed' },
    { value: 4, label: 'Thu' },
    { value: 5, label: 'Fri' },
    { value: 6, label: 'Sat' },
  ];
  const [shouldRender, setShouldRender] = useState(false);
  const [animationClass, setAnimationClass] = useState('');
  const animationTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (animationTimeoutRef.current) {
      clearTimeout(animationTimeoutRef.current);
      animationTimeoutRef.current = null;
    }

    if (isOpen) {
      setShouldRender(true);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setAnimationClass('fade-in-0');
        });
      });
    } else if (shouldRender) {
      setAnimationClass('fade-out-0');
      animationTimeoutRef.current = setTimeout(() => {
        setShouldRender(false);
        setAnimationClass('');
        onClose();
      }, 300);
    }

    return () => {
      if (animationTimeoutRef.current) {
        clearTimeout(animationTimeoutRef.current);
      }
    };
  }, [isOpen, shouldRender, onClose]);

  if (!shouldRender) {
    return null;
  }

  return (
    <div
      className={`fixed inset-0 bg-gray-900 bg-opacity-50 dark:bg-opacity-50 flex items-center justify-center z-50 p-4 ${animationClass}`}
    >
      <div
        className="w-full max-w-lg bg-white dark:bg-gray-800 rounded-xl shadow-2xl relative"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-8">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-900 dark:hover:text-white transition duration-200"
            aria-label="Close modal"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              ></path>
            </svg>
          </button>

          <h3 className="mb-6 text-2xl font-bold text-gray-900 dark:text-white text-center">
            {t('project.edit.title') || 'Edit Project'}
          </h3>

          {error && (
            <p className="mb-4 p-3 flex items-start bg-red-50 dark:bg-red-900/30 border border-red-300 dark:border-red-600 text-red-700 dark:text-red-300 rounded-md text-sm font-medium">
              <AlertIcon className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0 text-red-500 dark:text-red-400" />
              <span className="text-left text-xs">
                {t('project.create.error')}: {error}
              </span>
            </p>
          )}

          <form onSubmit={onSubmit} className="space-y-5">
            <InputField
              type="text"
              label={t('project.create.name')}
              value={projectName}
              onChange={onProjectNameChange}
              required
              placeholder={t('project.create.namePlaceholder')}
              className="w-full"
              disabled={loading}
            />
            <div className="space-y-1.5 text-left">
              <label
                htmlFor="description-textarea"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                {t('project.create.description')}
              </label>
              <textarea
                id="description-textarea"
                value={description}
                onChange={onDescriptionChange}
                rows={4}
                placeholder={t('project.create.descriptionPlaceholder')}
                className="w-full p-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 dark:text-white rounded-md shadow-sm resize-y focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 disabled:bg-gray-100 dark:disabled:bg-gray-700/50 disabled:cursor-not-allowed"
                disabled={loading}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputField
                type="number"
                label={t('project.create.gpuQuota')}
                value={gpuQuota}
                onChange={onGpuQuotaChange}
                placeholder={t('project.create.gpuQuotaPlaceholder')}
                className="w-full"
                min="0"
                disabled={loading}
              />
              <InputField
                type="number"
                label={t('project.create.gpuMemoryLimit')}
                value={mpsMemory}
                onChange={onMpsMemoryChange}
                placeholder={t('project.create.gpuMemoryLimitPlaceholder')}
                className="w-full"
                min="0"
                disabled={loading}
              />
            </div>

            <div className="rounded-lg border border-gray-200 dark:border-gray-700 p-4 space-y-4">
              <div className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                Limits
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputField
                  type="number"
                  label="Max Concurrent Jobs Per User"
                  value={maxConcurrentJobsPerUser}
                  onChange={onMaxConcurrentJobsPerUserChange}
                  className="w-full"
                  min="0"
                  disabled={loading}
                />
                <InputField
                  type="number"
                  label="Max Queued Jobs Per User"
                  value={maxQueuedJobsPerUser}
                  onChange={onMaxQueuedJobsPerUserChange}
                  className="w-full"
                  min="0"
                  disabled={loading}
                />
                <InputField
                  type="number"
                  label="Max Job Runtime (Seconds)"
                  value={maxJobRuntimeSeconds}
                  onChange={onMaxJobRuntimeSecondsChange}
                  className="w-full"
                  min="0"
                  disabled={loading}
                />
                <InputField
                  type="number"
                  label="Max Project Users"
                  value={maxProjectUsers}
                  onChange={onMaxProjectUsersChange}
                  className="w-full"
                  min="0"
                  disabled={loading}
                />
              </div>
            </div>

            <div className="rounded-lg border border-gray-200 dark:border-gray-700 p-4 space-y-4">
              <div className="flex items-center justify-between">
                <div className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                  Schedule Windows
                </div>
                <Button
                  type="button"
                  onClick={addScheduleWindow}
                  className="px-3 py-1.5 text-xs font-semibold bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
                  disabled={loading}
                >
                  Add Window
                </Button>
              </div>
              {scheduleWindows.length === 0 ? (
                <div className="text-xs text-gray-500">No windows set. Jobs are allowed any time.</div>
              ) : (
                <div className="space-y-3">
                  {scheduleWindows.map((window, index) => (
                    <div key={`${window.weekday}-${index}`} className="grid grid-cols-1 md:grid-cols-4 gap-3">
                      <select
                        className="rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm p-2"
                        value={window.weekday}
                        onChange={(e) => onScheduleWindowChange(index, 'weekday', Number(e.target.value))}
                        disabled={loading}
                      >
                        {weekdayOptions.map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                      <input
                        type="time"
                        className="rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm p-2"
                        value={window.start}
                        onChange={(e) => onScheduleWindowChange(index, 'start', e.target.value)}
                        disabled={loading}
                      />
                      <input
                        type="time"
                        className="rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm p-2"
                        value={window.end}
                        onChange={(e) => onScheduleWindowChange(index, 'end', e.target.value)}
                        disabled={loading}
                      />
                      <Button
                        type="button"
                        onClick={() => removeScheduleWindow(index)}
                        className="px-3 py-2 text-xs font-semibold bg-red-50 text-red-600 rounded-md hover:bg-red-100"
                        disabled={loading}
                      >
                        Remove
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-1.5 text-left">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                {t('project.create.gpuAccessMode')}
              </label>
              <div className="flex gap-4">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={gpuAccess.includes('shared')}
                    onChange={() => onGpuAccessChange('shared')}
                    className="form-checkbox h-5 w-5 text-accent-600 rounded border-gray-300 focus:ring-violet-500 dark:border-gray-600 dark:bg-gray-700"
                    disabled={loading}
                  />
                  <span className="text-gray-700 dark:text-gray-300">
                    {t('project.create.gpuAccessShared')}
                  </span>
                </label>
              </div>
            </div>

            <div className="pt-2">
              <Button
                type="submit"
                className="w-full px-6 py-2.5 text-base font-semibold bg-accent-600 text-white rounded-md hover:bg-violet-700 transition duration-150 focus:outline-none focus:ring-4 focus:ring-violet-500 focus:ring-opacity-50 disabled:bg-gray-400 disabled:cursor-not-allowed"
                disabled={loading}
              >
                {loading ? (
                  <span className="flex items-center justify-center animate-pulse">
                    <SpinnerIcon className="w-4 h-4 mr-2 text-white" />
                    {t('project.edit.updating')}
                  </span>
                ) : (
                  t('project.edit.submit')
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditProjectForm;

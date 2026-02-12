import { useState } from 'react';
import { createForm } from '@/core/services/formService';
import { useTranslation } from '@nthucscc/utils';
import { BaseModal } from '@nthucscc/ui';
import {
  DocumentTextIcon,
  TagIcon,
  ChatBubbleBottomCenterTextIcon,
  HashtagIcon,
  PencilSquareIcon,
} from '@heroicons/react/24/outline';

interface CreateFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectId?: string;
}

export default function CreateFormModal({ isOpen, onClose, projectId }: CreateFormModalProps) {
  const { t } = useTranslation();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tag, setTag] = useState('');
  const [loading, setLoading] = useState(false);
  const [type, setType] = useState('general');

  const formTypes = [
    { id: 'general', label: t('form.type.general'), icon: DocumentTextIcon },
    { id: 'bug', label: t('form.type.bug'), icon: HashtagIcon },
    { id: 'feature', label: t('form.type.feature'), icon: PencilSquareIcon },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await createForm({
        title,
        description,
        project_id: projectId ? Number(projectId) : undefined,
        tag: tag || type,
      });
      console.log('Form created successfully'); // Add logging instead of alert
      // alert(t('form.created')); // Removed alert for better UX
      onClose();
      // Reset form
      setTitle('');
      setDescription('');
      setTag('');
      setType('general');
    } catch (error: unknown) {
      console.error('Create form failed:', error);
      alert(t('form.createFailed') + (error instanceof Error ? error.message : String(error)));
    } finally {
      setLoading(false);
    }
  };

  return (
    <BaseModal isOpen={isOpen} onClose={onClose} title="" maxWidth="max-w-2xl">
      <div className="p-6">
        <div className="mb-8 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-accent-100 dark:bg-accent-900/30 mb-4">
            <DocumentTextIcon className="h-8 w-8 text-accent-600 dark:text-accent-400" />
          </div>
          <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">
            {t('form.title')}
          </h2>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">{t('form.subtitle')}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Form Type Selection */}
          <div className="grid grid-cols-3 gap-3">
            {formTypes.map((ft) => (
              <button
                key={ft.id}
                type="button"
                onClick={() => setType(ft.id)}
                className={`flex flex-col items-center justify-center p-3 rounded-lg border transition-all ${
                  type === ft.id
                    ? 'border-accent-500 bg-accent-50 dark:bg-accent-900/20 text-accent-700 dark:text-accent-300 ring-1 ring-accent-500'
                    : 'border-gray-200 dark:border-gray-700 hover:border-accent-300 dark:hover:border-accent-700 text-gray-600 dark:text-gray-400'
                }`}
              >
                <ft.icon className="h-6 w-6 mb-2" />
                <span className="text-xs font-medium">{ft.label}</span>
              </button>
            ))}
          </div>

          <div className="space-y-4 bg-gray-50 dark:bg-gray-800/50 p-6 rounded-xl border border-gray-100 dark:border-gray-700/50">
            {/* Title Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                {t('form.field.title')} <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <PencilSquareIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="pl-10 block w-full rounded-lg border-gray-300 bg-white dark:bg-gray-800 focus:border-accent-500 focus:ring-accent-500 sm:text-sm dark:border-gray-600 dark:text-white transition-colors"
                  placeholder={t('form.exampleTitle')}
                />
              </div>
            </div>

            {/* Description Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                {t('form.field.description')} <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute top-3 left-3 pointer-events-none">
                  <ChatBubbleBottomCenterTextIcon className="h-5 w-5 text-gray-400" />
                </div>
                <textarea
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                  className="pl-10 block w-full rounded-lg border-gray-300 bg-white dark:bg-gray-800 focus:border-accent-500 focus:ring-accent-500 sm:text-sm dark:border-gray-600 dark:text-white transition-colors"
                  placeholder={t('form.placeholder.description.base')}
                />
              </div>
            </div>

            {/* Tag Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                {t('form.field.tag')}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <TagIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={tag}
                  onChange={(e) => setTag(e.target.value)}
                  className="pl-10 block w-full rounded-lg border-gray-300 bg-white dark:bg-gray-800 focus:border-accent-500 focus:ring-accent-500 sm:text-sm dark:border-gray-600 dark:text-white transition-colors"
                  placeholder={t('form.placeholder.tag')}
                />
              </div>
            </div>

            {projectId && (
              <div className="flex items-center gap-2 p-2 rounded bg-accent-50 dark:bg-accent-900/20 text-xs text-accent-700 dark:text-accent-300">
                <DocumentTextIcon className="h-4 w-4" />
                <span>{t('form.projectId', { id: projectId })}</span>
              </div>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              className="px-4 py-2.5 rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700 transition-colors text-sm font-medium"
              onClick={onClose}
            >
              {t('form.cancel')}
            </button>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center px-6 py-2.5 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent-500 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-500/30 transition-all text-sm font-medium"
            >
              {loading ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
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
                  {t('form.submitting')}
                </>
              ) : (
                t('form.submit')
              )}
            </button>
          </div>
        </form>
      </div>
    </BaseModal>
  );
}

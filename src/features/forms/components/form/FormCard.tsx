import React from 'react';
import { Form } from '@/core/interfaces/form';
import { LocaleKey } from '@nthucscc/utils';
import { ChatBubbleLeftIcon } from '@heroicons/react/24/outline';

interface FormCardProps {
  form: Form;
  statusText: (s?: string) => string;
  t: (key: LocaleKey, vars?: Record<string, string | number>) => string;
  onViewDetails?: (form: Form) => void;
}

const FormCard: React.FC<FormCardProps> = ({ form, statusText, t, onViewDetails }) => (
  <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800 flex flex-col gap-2 hover:shadow-md transition-shadow">
    <div className="flex items-center gap-2 mb-2">
      <span
        className={`inline-block w-2 h-2 rounded-full ${form.status === 'Completed' ? 'bg-green-500' : form.status === 'Rejected' ? 'bg-red-500' : form.status === 'Processing' ? 'bg-yellow-400' : 'bg-gray-400'}`}
      ></span>
      <span
        className={`inline-block rounded-full px-2 py-0.5 text-xs font-semibold ${form.status === 'Completed' ? 'bg-green-100 text-green-800' : form.status === 'Rejected' ? 'bg-red-100 text-red-800' : form.status === 'Processing' ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'} dark:bg-opacity-20`}
      >
        {statusText(form.status) || form.status}
      </span>
    </div>
    <div className="font-bold text-lg text-gray-800 dark:text-white line-clamp-1">{form.title}</div>
    <div className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">{form.description}</div>
    <div className="flex flex-wrap gap-2 mt-2 text-xs text-gray-400 dark:text-gray-500">
      <span>
        {t('form.label.project')}: {form.project?.ProjectName || '-'}
      </span>
      <span>
        {t('common.createdAt')}: {new Date(form.CreatedAt).toLocaleDateString()}
      </span>
    </div>
    {onViewDetails && (
      <button
        onClick={() => onViewDetails(form)}
        className="mt-3 w-full flex items-center justify-center gap-2 px-4 py-2 bg-accent-600 hover:bg-accent-700 text-white rounded-lg transition-colors text-sm font-medium"
      >
        <ChatBubbleLeftIcon className="h-4 w-4" />
        {t('form.viewDetails')}
      </button>
    )}
  </div>
);

export default FormCard;

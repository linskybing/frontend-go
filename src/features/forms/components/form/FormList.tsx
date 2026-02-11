import React from 'react';
import { Form } from '@/core/interfaces/form';
import FormCard from './FormCard';
import { useTranslation } from '@nthucscc/utils';
import { ChatBubbleLeftIcon } from '@heroicons/react/24/outline';

interface FormListProps {
  viewMode: 'grid' | 'list';
  currentForms: Form[];
  statusText: (s?: string) => string;
  onViewDetails?: (form: Form) => void;
}

const FormList: React.FC<FormListProps> = ({
  viewMode,
  currentForms,
  statusText,
  onViewDetails,
}) => {
  const { t } = useTranslation();

  if (currentForms.length === 0) {
    return <div className="py-8 text-center text-gray-400">{t('form.history.empty')}</div>;
  }

  return viewMode === 'grid' ? (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {currentForms.map((f) => (
        <FormCard key={f.ID} form={f} statusText={statusText} t={t} onViewDetails={onViewDetails} />
      ))}
    </div>
  ) : (
    <div className="overflow-x-auto">
      <table className="min-w-full text-sm text-left border">
        <thead className="bg-gray-50 dark:bg-gray-700/50 text-gray-500 dark:text-gray-400">
          <tr>
            <th className="px-4 py-2">{t('form.label.title')}</th>
            <th className="px-4 py-2">{t('form.label.description')}</th>
            <th className="px-4 py-2">{t('form.label.project')}</th>
            <th className="px-4 py-2">{t('table.status')}</th>
            <th className="px-4 py-2">{t('common.createdAt')}</th>
            {onViewDetails && <th className="px-4 py-2">{t('table.actions')}</th>}
          </tr>
        </thead>
        <tbody>
          {currentForms.map((f) => (
            <tr key={f.ID} className="border-t hover:bg-gray-50 dark:hover:bg-gray-800/50">
              <td className="px-4 py-2 font-medium text-gray-800 dark:text-white">{f.title}</td>
              <td className="px-4 py-2 text-gray-600 dark:text-gray-300">{f.description}</td>
              <td className="px-4 py-2">{f.project?.ProjectName || '-'}</td>
              <td className="px-4 py-2">
                <span
                  className={`inline-block rounded-full px-2 py-0.5 text-xs font-semibold ${f.status === 'Completed' ? 'bg-green-100 text-green-800' : f.status === 'Rejected' ? 'bg-red-100 text-red-800' : f.status === 'Processing' ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'} dark:bg-opacity-20`}
                >
                  {statusText(f.status) || f.status}
                </span>
              </td>
              <td className="px-4 py-2">{new Date(f.CreatedAt).toLocaleDateString()}</td>
              {onViewDetails && (
                <td className="px-4 py-2">
                  <button
                    onClick={() => onViewDetails(f)}
                    className="flex items-center gap-1 px-3 py-1 bg-accent-600 hover:bg-accent-700 text-white rounded text-xs font-medium transition-colors"
                  >
                    <ChatBubbleLeftIcon className="h-3 w-3" />
                    {t('form.viewDetails')}
                  </button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default FormList;

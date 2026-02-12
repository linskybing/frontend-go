import { TrashIcon } from '@heroicons/react/24/outline';
import type { AllowedImage } from '@/core/services/imageService';
import { useTranslation } from '@nthucscc/utils';

type Props = {
  images: AllowedImage[];
  onRemove: (id: number) => void;
};

export default function ProjectImageList({ images, onRemove }: Props) {
  const { t } = useTranslation();

  return (
    <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
      <table className="min-w-full divide-y divide-gray-300 dark:divide-gray-700">
        <thead className="bg-gray-50 dark:bg-gray-800">
          <tr>
            <th className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 dark:text-white sm:pl-6 w-3/4">
              {t('project.images.colImage')}
            </th>
            <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white w-1/4">
              {t('project.images.colStatus')}
            </th>
            <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
              <span className="sr-only">{t('project.images.colActions')}</span>
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-gray-900">
          {images.length === 0 ? (
            <tr>
              <td colSpan={3} className="py-4 text-center text-sm text-gray-500 dark:text-gray-400">
                {t('project.images.noImages')}
              </td>
            </tr>
          ) : (
            images.map((img) => (
              <tr key={img.ID}>
                <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-6 w-3/4">
                  <div className="font-medium text-gray-900 dark:text-white text-lg">
                    {img.Name}:{img.Tag}
                  </div>
                </td>
                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-400 w-1/4">
                  <span
                    className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ${
                      img.Status === 'pending'
                        ? 'bg-yellow-100 text-yellow-800 ring-1 ring-inset ring-yellow-600/20 dark:bg-yellow-900/30 dark:text-yellow-300'
                        : img.Status === 'approved'
                          ? 'bg-green-100 text-green-800 ring-1 ring-inset ring-green-600/20 dark:bg-green-900/30 dark:text-green-300'
                          : img.Status === 'rejected'
                            ? 'bg-red-100 text-red-800 ring-1 ring-inset ring-red-600/20 dark:bg-red-900/30 dark:text-red-300'
                            : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {img.Status ||
                      (img.IsGlobal ? t('project.images.global') : t('project.images.project'))}
                  </span>
                </td>
                <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                  {!img.IsGlobal && (
                    <button
                      className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                      title={t('project.images.remove')}
                      aria-label={t('project.images.remove')}
                      onClick={() => onRemove(img.ID)}
                    >
                      <TrashIcon className="h-5 w-5" aria-hidden="true" />
                    </button>
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

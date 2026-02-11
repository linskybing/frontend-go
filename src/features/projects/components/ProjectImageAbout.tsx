import { useTranslation } from '@nthucscc/utils';

export default function ProjectImageAbout() {
  const { t } = useTranslation();

  return (
    <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700">
      <div className="flex items-start gap-2">
        <svg
          className="w-5 h-5 text-accent-500 mt-0.5 flex-shrink-0"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            fillRule="evenodd"
            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
            clipRule="evenodd"
          />
        </svg>
        <div className="text-sm text-gray-700 dark:text-gray-300">
          <p className="font-medium mb-1">{t('project.images.about.title')}</p>
          <ul className="list-disc list-inside space-y-1 text-xs text-gray-600 dark:text-gray-400">
            <li>
              <strong>{t('project.images.about.globalLabel')}</strong>{' '}
              {t('project.images.about.globalDesc')}
            </li>
            <li>
              <strong>{t('project.images.about.projectLabel')}</strong>{' '}
              {t('project.images.about.projectDesc')}
            </li>
            <li>{t('project.images.about.accessible')}</li>
            <li>{t('project.images.about.allowed')}</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

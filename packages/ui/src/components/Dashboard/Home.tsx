import { PageMeta } from '@nthucscc/ui';
import { useTranslation } from '@nthucscc/utils';

export default function Home() {
  const { t } = useTranslation();
  return (
    <>
      <PageMeta
        title={t('page.home.title') || 'Dashboard'}
        description={t('page.home.description') || ''}
      />
      <div className="grid grid-cols-1 gap-4 md:gap-6">
        <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
            {t('page.home.welcome')}
          </h2>
          <p className="mt-2 text-gray-500 dark:text-gray-400">{t('page.home.subtitle')}</p>
        </div>
      </div>
    </>
  );
}

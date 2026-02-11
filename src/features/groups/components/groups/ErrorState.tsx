// src/components/groups/ErrorState.tsx
import { useTranslation } from '@nthucscc/utils';

const ErrorState = ({ message }: { message: string }) => {
  const { t } = useTranslation();
  return (
    <div className="rounded-lg bg-red-50 p-4 text-center dark:bg-red-900/30">
      <h3 className="text-sm font-semibold text-red-800 dark:text-red-300">
        {t('groups.error.loadFailed')}
      </h3>
      <p className="mt-1 text-sm text-red-700 dark:text-red-400">{message}</p>
    </div>
  );
};
export default ErrorState;

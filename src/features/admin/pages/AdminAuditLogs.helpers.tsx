import { GridIcon, BoxIcon, MoreDotIcon, TaskIcon } from '@/shared/icons';

export const getActionIcon = (action: string) => {
  const key = (action || '').toLowerCase();
  const baseClass = 'h-5 w-5';

  if (key.includes('create')) return <TaskIcon className={baseClass} />;
  if (key.includes('update') || key.includes('edit')) return <GridIcon className={baseClass} />;
  if (key.includes('delete') || key.includes('remove')) return <BoxIcon className={baseClass} />;
  return <MoreDotIcon className={baseClass} />;
};

export const getActionTheme = (action: string) => {
  const key = (action || '').toLowerCase();
  if (key.includes('create')) {
    return {
      bg: 'bg-emerald-50 dark:bg-emerald-900/20',
      text: 'text-emerald-700 dark:text-emerald-400',
      border: 'border-emerald-200 dark:border-emerald-800',
      iconBg: 'bg-emerald-100 dark:bg-emerald-800/40',
    };
  }
  if (key.includes('update') || key.includes('edit')) {
    return {
      bg: 'bg-accent-50 dark:bg-accent-900/20',
      text: 'text-accent-700 dark:text-accent-400',
      border: 'border-accent-200 dark:border-accent-800',
      iconBg: 'bg-accent-100 dark:bg-accent-800/40',
    };
  }
  if (key.includes('delete') || key.includes('remove')) {
    return {
      bg: 'bg-rose-50 dark:bg-rose-900/20',
      text: 'text-rose-700 dark:text-rose-400',
      border: 'border-rose-200 dark:border-rose-800',
      iconBg: 'bg-rose-100 dark:bg-rose-800/40',
    };
  }
  return {
    bg: 'bg-gray-50 dark:bg-gray-800/40',
    text: 'text-gray-700 dark:text-gray-400',
    border: 'border-gray-200 dark:border-gray-700',
    iconBg: 'bg-gray-100 dark:bg-gray-800',
  };
};

export const formatLocalizedDate = (dateString: string, locale: string = 'en-US') => {
  if (!dateString) return '';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;

  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(date);
};

export const safePrettyJSON = (data: unknown): string | null => {
  if (!data) return null;
  try {
    const obj = typeof data === 'string' ? JSON.parse(data) : data;
    if (typeof obj === 'object' && obj !== null && Object.keys(obj).length === 0) {
      return null;
    }
    return JSON.stringify(obj, null, 2);
  } catch (_error: unknown) {
    return String(data);
  }
};

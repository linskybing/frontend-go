import React from 'react';
import { useTranslation } from '@nthucscc/utils';

interface PaginationWrapperProps {
  currentPage: number;
  totalPages: number;
  setCurrentPage: (p: number) => void;
  className?: string;
}

const PaginationWrapper: React.FC<PaginationWrapperProps> = ({
  currentPage,
  totalPages,
  setCurrentPage,
  className = '',
}) => {
  const { t } = useTranslation();
  if (totalPages <= 1) return null;
  return (
    <div className={className + ' mt-4 flex items-center gap-2'}>
      <button
        className="mr-2 px-3 py-1 rounded border bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 disabled:opacity-50"
        onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
      >
        {t('pagination.prev')}
      </button>
      <span className="text-sm text-gray-500 dark:text-gray-400">
        {t('pagination.pageOf', { current: currentPage, total: totalPages })}
      </span>
      <button
        className="ml-2 px-3 py-1 rounded border bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 disabled:opacity-50"
        onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
      >
        {t('pagination.next')}
      </button>
    </div>
  );
};

export default PaginationWrapper;

import React from 'react';
import { useTranslation } from '@nthucscc/utils';
import { Form } from '@/core/interfaces/form';
import SearchBar from './SearchBar';
import ViewModeToggle from './ViewModeToggle';
import FormList from './FormList';
import PaginationWrapper from './PaginationWrapper';

interface UserFormHistoryProps {
  loadingForms: boolean;
  filteredForms: Form[];
  currentForms: Form[];
  itemsPerPage: number;
  viewMode: 'grid' | 'list';
  setViewMode: (v: 'grid' | 'list') => void;
  searchTerm: string;
  setSearchTerm: (s: string) => void;
  currentPage: number;
  totalPages: number;
  setCurrentPage: (p: number) => void;
  statusText: (s?: string) => string;
  onViewDetails?: (form: Form) => void;
}

const UserFormHistory: React.FC<UserFormHistoryProps> = ({
  loadingForms,
  currentForms,
  viewMode,
  setViewMode,
  searchTerm,
  setSearchTerm,
  currentPage,
  totalPages,
  setCurrentPage,
  statusText,
  onViewDetails,
}) => {
  const { t } = useTranslation();

  return (
    <div className="rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800 p-6 mb-8">
      <div className="mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
          {t('form.history.title')}
        </h3>
        <div className="flex items-center gap-2">
          <ViewModeToggle viewMode={viewMode} setViewMode={setViewMode} />
          <SearchBar value={searchTerm} onChange={setSearchTerm} />
        </div>
      </div>

      {loadingForms ? (
        <div className="py-8 text-center text-gray-400">{t('form.history.loading')}</div>
      ) : (
        <>
          <FormList
            viewMode={viewMode}
            currentForms={currentForms}
            statusText={statusText}
            onViewDetails={onViewDetails}
          />

          <PaginationWrapper
            currentPage={currentPage}
            totalPages={totalPages}
            setCurrentPage={setCurrentPage}
          />
        </>
      )}
    </div>
  );
};

export default UserFormHistory;

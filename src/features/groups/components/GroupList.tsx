// src/components/GroupList.tsx

import React, { ChangeEvent, useState, useEffect } from 'react';
import { useTranslation, LocaleKey } from '@nthucscc/utils';
import { Group } from '@/core/interfaces/group'; // Adjust import based on your structure
import { Pagination } from '@nthucscc/components-shared';

// --- SVG Icons --- //

/** SVG Icon for Deletion (Trash Can) */
const TrashIcon: React.FC<{ className?: string }> = ({ className = 'h-5 w-5' }) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.134-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.067-2.09 1.02-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
    />
  </svg>
);

/** SVG Icon for Group/Team */
const GroupIcon: React.FC<{ className?: string }> = ({ className = 'h-5 w-5' }) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 20 20"
    fill="currentColor"
  >
    <path d="M10 9a3 3 0 100-6 3 3 0 000 6zM6 8a2 2 0 11-4 0 2 2 0 014 0zM1.49 15.326a.78.78 0 01-.358-.442 3 3 0 014.308-3.516 6.484 6.484 0 00-1.905 3.959c-.023.222-.014.442.028.658a.78.78 0 01-.357.442zM20 9a3 3 0 100-6 3 3 0 000 6zM14 8a2 2 0 11-4 0 2 2 0 014 0zm5.51 7.326a.78.78 0 01-.358-.442 3 3 0 01-4.308-3.516 6.484 6.484 0 001.905 3.959c.023.222.014.442-.028.658a.78.78 0 01.357.442zM9.25 12.164a4.5 4.5 0 00-5.462-3.332 6.49 6.49 0 00-1.905 3.959c-.023.222-.014.442.028.658a.78.78 0 00.358.442 4.5 4.5 0 005.462-3.332zM14.75 12.164a4.5 4.5 0 015.462-3.332 6.49 6.49 0 011.905 3.959c.023.222.014.442-.028.658a.78.78 0 01-.358.442 4.5 4.5 0 01-5.462-3.332z" />
  </svg>
);

/** SVG Icon for Search */
const SearchIcon: React.FC<{ className?: string }> = ({ className = 'w-5 h-5' }) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
    />
  </svg>
);

// --- Helper Components for States (Loading, Error, Empty) --- //

const LoadingSpinner: React.FC<{
  t: (key: LocaleKey, vars?: Record<string, string | number>) => string;
}> = ({ t }) => (
  <div className="flex justify-center items-center p-8 text-gray-500 dark:text-gray-400">
    <svg
      className="animate-spin h-6 w-6 mr-3 text-accent-500 dark:text-accent-400"
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
    <span>{t('groups.list.loading')}</span>
  </div>
);

const ErrorDisplay: React.FC<{
  message: string;
  t: (key: LocaleKey, vars?: Record<string, string | number>) => string;
}> = ({ message, t }) => (
  <div
    className="bg-red-50 dark:bg-red-900/30 border border-red-300 dark:border-red-600 text-red-700 dark:text-red-300 px-4 py-3 rounded-lg"
    role="alert"
  >
    <strong className="font-bold mr-1">{t('project.list.errorPrefix')}</strong>
    <span className="block sm:inline">{message}</span>
  </div>
);

const EmptyState: React.FC<{
  isFiltering: boolean;
  t: (key: LocaleKey, vars?: Record<string, string | number>) => string;
}> = ({ isFiltering, t }) => (
  <div className="text-center py-12 px-6 border border-dashed border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800">
    <GroupIcon className="mx-auto h-10 w-10 text-gray-400" />
    <h3 className="mt-4 text-lg font-semibold text-gray-800 dark:text-white">
      {isFiltering ? t('groups.list.empty.filter') : t('groups.list.empty.noGroups')}
    </h3>
    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
      {isFiltering ? t('groups.list.empty.filterTip') : t('groups.list.empty.noGroupsTip')}
    </p>
  </div>
);

// --- Main Component --- //

interface GroupListProps {
  groups: Group[];
  loading: boolean;
  error: string | null;
  onGroupClick: (groupId: string) => void;
  // FIX: Update onDeleteGroup to accept the entire Group object
  onDeleteGroup: (group: Group) => void;
  // Props for the search functionality
  searchTerm: string;
  onSearchChange: (e: ChangeEvent<HTMLInputElement>) => void;
  // NOTE: If you want to disable delete buttons during an API operation (optional but recommended), add:
  // isActionLoading?: boolean;
  isActionLoading: boolean;
}

const GroupList: React.FC<GroupListProps> = ({
  groups,
  loading,
  error,
  onGroupClick,
  onDeleteGroup,
  searchTerm,
  onSearchChange,
  // isActionLoading = false, // Uncomment if adding isActionLoading
}) => {
  const { t } = useTranslation();
  const isFiltering = (searchTerm || '').length > 0;
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Reset page when search changes (groups prop changes)
  useEffect(() => {
    setCurrentPage(1);
  }, [groups]);

  const totalPages = Math.ceil(groups.length / itemsPerPage);
  const paginatedGroups = groups.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  const renderContent = () => {
    if (loading) {
      return <LoadingSpinner t={t} />;
    }
    if (error) {
      return <ErrorDisplay message={error} t={t} />;
    }
    // Defensive check: Ensure 'groups' is an array before checking its length
    if (!groups || groups.length === 0) {
      return <EmptyState isFiltering={isFiltering} t={t} />;
    }

    return (
      <>
        <ul className="space-y-4">
          {paginatedGroups.map((group) => (
            <li
              key={group.GID}
              // Aesthetic card styling with hover feedback
              className="group flex justify-between items-center 
                          bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl 
                          shadow-md transition-all duration-200 
                          hover:shadow-lg hover:border-violet-400 dark:hover:border-violet-500"
            >
              {/* Group details and navigation area */}
              <div
                onClick={() => onGroupClick(group.GID)}
                className="flex-grow cursor-pointer px-4 py-3"
              >
                <div className="flex items-center gap-4">
                  {/* Decorative Icon (Violet accent color) */}
                  <div className="h-10 w-10 flex-shrink-0 flex items-center justify-center rounded-full bg-violet-50 dark:bg-accent-900/30 text-accent-600 dark:text-accent-400 shadow-sm">
                    <GroupIcon className="h-6 w-6" />
                  </div>

                  {/* Text Details */}
                  <div>
                    <p className="font-bold text-lg text-gray-800 dark:text-white truncate">
                      {group.GroupName}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 truncate mt-0.5">
                      {group.Description || t('groups.noDescription')}
                    </p>
                  </div>
                </div>
              </div>

              {/* Delete button (Icon-only) */}
              <div className="px-4 flex-shrink-0">
                <button
                  // FIX: Pass the whole group object instead of just the ID
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent onGroupClick from firing
                    onDeleteGroup(group);
                  }}
                  className="p-2 rounded-full text-gray-400 hover:bg-red-50 dark:hover:bg-red-900/30 hover:text-red-600 dark:hover:text-red-400 transition-colors duration-200"
                  aria-label={t('groups.list.deleteGroupAria')}
                  // disabled={isActionLoading} // Uncomment if adding isActionLoading
                >
                  <TrashIcon className="h-5 w-5" />
                </button>
              </div>
            </li>
          ))}
        </ul>
        <Pagination current={currentPage} total={totalPages} onPageChange={setCurrentPage} />
      </>
    );
  };

  return (
    <div className="mx-auto w-full max-w-4xl">
      {/* Header (Structural Context) */}
      <div className="mb-6">
        <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white">
          {t('groups.list.title')}
        </h2>
        <p className="mt-1 text-base text-gray-600 dark:text-gray-400">
          {t('groups.list.description')}
        </p>
      </div>

      {/* Search Bar */}
      <div className="mb-6 relative">
        <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500" />
        <input
          type="text"
          placeholder={t('groups.list.searchPlaceholder')}
          value={searchTerm}
          onChange={onSearchChange}
          className="
                w-full 
                py-2 pl-10 pr-4 
                border border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white 
                rounded-lg 
                focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500
                transition duration-150
            "
        />
      </div>

      {/* Main Content Area (Background Contrast) */}
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-5 sm:p-8 shadow-lg">
        {renderContent()}
      </div>
    </div>
  );
};

export default GroupList;

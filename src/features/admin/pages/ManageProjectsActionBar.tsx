import React from 'react';
import { Button, PlusIcon, SearchIcon } from '@nthucscc/ui';

type Props = {
  searchTerm: string;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onCreateClick: () => void;
  loading?: boolean;
  actionLoading?: boolean;
  searchPlaceholder?: string;
};

export default function ManageProjectsActionBar({
  searchTerm,
  onSearchChange,
  onCreateClick,
  loading = false,
  actionLoading = false,
  searchPlaceholder = 'Search projects...',
}: Props) {
  return (
    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="relative flex-1 max-w-md">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
          <SearchIcon size={20} className="text-gray-400" />
        </div>
        <input
          type="text"
          value={searchTerm}
          onChange={onSearchChange}
          placeholder={searchPlaceholder}
          className="block w-full rounded-lg border border-gray-300 bg-white py-2.5 pl-10 pr-3 text-sm text-gray-900 placeholder-gray-400 focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:placeholder-gray-500"
        />
      </div>

      <Button
        type="button"
        onClick={onCreateClick}
        disabled={loading || actionLoading}
        className="inline-flex items-center gap-2 rounded-lg bg-accent-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md transition-all duration-150 hover:bg-violet-700 focus:outline-none focus:ring-4 focus:ring-violet-500 focus:ring-opacity-50 disabled:cursor-not-allowed disabled:opacity-50"
      >
        <PlusIcon size={20} />
        <span>New Project</span>
      </Button>
    </div>
  );
}

// src/components/groups/GroupCard.tsx

import React from 'react';
import { useTranslation } from '@nthucscc/utils';
import { Group } from '@/core/interfaces/group';

interface GroupCardProps {
  group: Group;
  onClick: () => void;
}

/**
 * A card component to display summary information for a single group.
 * It's clickable and has hover effects for better user interaction.
 */
const GroupCard: React.FC<GroupCardProps> = ({ group, onClick }) => {
  const { t } = useTranslation();
  return (
    <div
      onClick={onClick}
      className="group cursor-pointer rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-lg hover:border-accent-500/50 dark:border-gray-700 dark:bg-gray-800 dark:hover:border-accent-500"
    >
      <div className="flex items-start gap-4">
        {/* Icon */}
        <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-gray-100 text-gray-600 transition-colors group-hover:bg-accent-100 group-hover:text-accent-600 dark:bg-gray-700 dark:text-gray-300 dark:group-hover:bg-accent-900/50 dark:group-hover:text-accent-400">
          <svg
            className="h-6 w-6"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m-7.5-2.962A3.75 3.75 0 0115 12a3.75 3.75 0 01-2.25 3.512M7.5 3.75A3.75 3.75 0 003.75 7.5a3.75 3.75 0 003.75 3.75v-7.5zM12 1.5c-4.5 0-8.25 3.75-8.25 8.25v7.5A3.75 3.75 0 0112 18.75a3.75 3.75 0 013.75-3.75v-7.5C15.75 5.25 12 1.5 12 1.5z"
            />
          </svg>
        </div>
        {/* Text content */}
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{group.GroupName}</h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
            {group.Description || t('groups.noDescription')}
          </p>
        </div>
      </div>
    </div>
  );
};

export default GroupCard;

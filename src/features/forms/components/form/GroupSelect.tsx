import React, { useState } from 'react';
import { useTranslation } from '@nthucscc/utils';

interface GroupOption {
  GID: string;
  GroupName: string;
}

interface GroupSelectProps {
  availableGroups: GroupOption[];
  selectedGroupName: string;
  onSelectedGroupChange: (groupId: string, groupName: string) => void;
}

export const GroupSelect: React.FC<GroupSelectProps> = ({
  availableGroups,
  selectedGroupName,
  onSelectedGroupChange,
}) => {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const [open, setOpen] = useState(false);

  const filtered = availableGroups.filter((g) =>
    g.GroupName.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="relative">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        {t('project.create.group')} <span className="text-red-500">*</span>
      </label>

      <div className="relative">
        <input
          type="text"
          placeholder={t('project.create.groupPlaceholder')}
          value={searchTerm || selectedGroupName}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        />

        {open && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded shadow-lg z-10 max-h-48 overflow-y-auto">
            {filtered.length === 0 ? (
              <div className="px-3 py-2 text-sm text-gray-500">
                {t('project.create.noGroupsFound')}
              </div>
            ) : (
              filtered.map((group) => (
                <button
                  key={group.GID}
                  onClick={() => {
                    onSelectedGroupChange(group.GID, group.GroupName);
                    setSearchTerm('');
                    setOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-sm text-gray-900 dark:text-white"
                >
                  {group.GroupName}
                </button>
              ))
            )}
          </div>
        )}
      </div>

      {selectedGroupName && (
        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
          Selected: <span className="font-semibold">{selectedGroupName}</span>
        </p>
      )}
    </div>
  );
};

export default GroupSelect;

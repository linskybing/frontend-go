import React from 'react';
import { UserIcon } from '@heroicons/react/24/outline';

interface ProfileHeaderProps {
  name: string;
  username: string;
  email: string;
  isEditing: boolean;
  onEditClick: () => void;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  name,
  username,
  email,
  isEditing,
  onEditClick,
}) => {
  return (
    <div className="bg-gradient-to-r from-accent-600 to-accent-500 dark:from-accent-700 dark:to-accent-600 px-8 py-8">
      <div className="flex items-end justify-between">
        <div className="flex items-end gap-4">
          {/* Avatar */}
          <div className="w-20 h-20 rounded-full bg-white dark:bg-slate-800 flex items-center justify-center shadow-lg ring-4 ring-white dark:ring-slate-700">
            <UserIcon className="w-10 h-10 text-accent-600 dark:text-accent-400" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white mb-1">
              {name || username || 'User'}
            </h2>
            <p className="text-accent-100">{email}</p>
          </div>
        </div>
        {!isEditing && (
          <button
            onClick={onEditClick}
            className="px-4 py-2 bg-white dark:bg-slate-700 text-accent-600 dark:text-accent-400 rounded-lg font-semibold hover:bg-slate-50 dark:hover:bg-slate-600 transition-colors"
          >
            Edit
          </button>
        )}
      </div>
    </div>
  );
};

export default ProfileHeader;

import React from 'react';
import {
  UserIcon,
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
} from '@heroicons/react/24/outline';

export interface FormState {
  username: string;
  name: string;
  email: string;
  phone: string;
  department: string;
}

interface ProfileFormProps {
  formData: FormState;
  isEditing: boolean;
  isLoading: boolean;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSave: (e: React.FormEvent) => void;
  onCancel: () => void;
}

const ProfileForm: React.FC<ProfileFormProps> = ({
  formData,
  isEditing,
  isLoading,
  onInputChange,
  onSave,
  onCancel,
}) => {
  return (
    <form onSubmit={onSave} className="px-8 py-8">
      <div className="space-y-6">
        {/* Username - Read Only */}
        <div className="group">
          <label className="flex items-center text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            <UserIcon className="w-4 h-4 mr-2 text-gray-500" />
            Username
          </label>
          <div className="px-4 py-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg text-gray-700 dark:text-gray-300 cursor-not-allowed opacity-75">
            {formData.username}
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Username cannot be changed
          </p>
        </div>

        {/* Full Name */}
        <div className="group">
          <label className="flex items-center text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            <svg
              className="w-4 h-4 mr-2 text-gray-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
            Full Name
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={onInputChange}
            disabled={!isEditing}
            className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100 disabled:bg-slate-50 dark:disabled:bg-slate-800 disabled:opacity-75 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-accent-500 dark:focus:ring-accent-400 focus:border-transparent transition-all"
            placeholder="Enter your full name"
          />
        </div>

        {/* Email */}
        <div className="group">
          <label className="flex items-center text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            <EnvelopeIcon className="w-4 h-4 mr-2 text-gray-500" />
            Email
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={onInputChange}
            disabled={!isEditing}
            className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100 disabled:bg-slate-50 dark:disabled:bg-slate-800 disabled:opacity-75 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-accent-500 dark:focus:ring-accent-400 focus:border-transparent transition-all"
            placeholder="Enter your email address"
          />
        </div>

        {/* Phone */}
        <div className="group">
          <label className="flex items-center text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            <PhoneIcon className="w-4 h-4 mr-2 text-gray-500" />
            Phone
          </label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={onInputChange}
            disabled={!isEditing}
            className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100 disabled:bg-slate-50 dark:disabled:bg-slate-800 disabled:opacity-75 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-accent-500 dark:focus:ring-accent-400 focus:border-transparent transition-all"
            placeholder="Enter your phone number"
          />
        </div>

        {/* Department */}
        <div className="group">
          <label className="flex items-center text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            <MapPinIcon className="w-4 h-4 mr-2 text-gray-500" />
            Department
          </label>
          <input
            type="text"
            name="department"
            value={formData.department}
            onChange={onInputChange}
            disabled={!isEditing}
            className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100 disabled:bg-slate-50 dark:disabled:bg-slate-800 disabled:opacity-75 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-accent-500 dark:focus:ring-accent-400 focus:border-transparent transition-all"
            placeholder="Enter your department"
          />
        </div>
      </div>

      {/* Action Buttons */}
      {isEditing && (
        <div className="flex gap-3 mt-8 pt-8 border-t border-slate-200 dark:border-slate-700">
          <button
            type="submit"
            disabled={isLoading}
            className="flex-1 px-6 py-3 bg-gradient-to-r from-accent-600 to-accent-500 hover:from-accent-700 hover:to-accent-600 dark:from-accent-700 dark:to-accent-600 dark:hover:from-accent-800 dark:hover:to-accent-700 text-white rounded-lg font-semibold transition-all disabled:opacity-75 disabled:cursor-not-allowed active:scale-95"
          >
            {isLoading ? 'Saving...' : 'Save Changes'}
          </button>
          <button
            type="button"
            onClick={onCancel}
            disabled={isLoading}
            className="flex-1 px-6 py-3 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-gray-700 dark:text-gray-300 rounded-lg font-semibold transition-all disabled:opacity-75 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
        </div>
      )}
    </form>
  );
};

export default ProfileForm;

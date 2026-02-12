import React from 'react';
import { useTranslation } from '@nthucscc/utils';

interface ThemeSettingsProps {
  currentTheme: 'light' | 'dark';
  onThemeChange: (theme: 'light' | 'dark') => void;
}

const ThemeSettings: React.FC<ThemeSettingsProps> = ({ currentTheme, onThemeChange }) => {
  const { t } = useTranslation();

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        {t('user.settings.theme.title')}
      </h2>
      <div className="flex items-center space-x-4">
        <button
          onClick={() => onThemeChange('light')}
          className={`px-4 py-2 rounded-md text-sm font-medium ${
            currentTheme === 'light'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
          }`}
        >
          {t('user.settings.theme.light')}
        </button>
        <button
          onClick={() => onThemeChange('dark')}
          className={`px-4 py-2 rounded-md text-sm font-medium ${
            currentTheme === 'dark'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
          }`}
        >
          {t('user.settings.theme.dark')}
        </button>
      </div>
    </div>
  );
};

export default ThemeSettings;

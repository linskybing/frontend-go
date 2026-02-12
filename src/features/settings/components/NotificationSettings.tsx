import React from 'react';
import { useTranslation } from '@nthucscc/utils';

interface NotificationSettingsProps {
  receiveNotifications: boolean;
  onToggleNotifications: (receive: boolean) => void;
}

const NotificationSettings: React.FC<NotificationSettingsProps> = ({
  receiveNotifications,
  onToggleNotifications,
}) => {
  const { t } = useTranslation();

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        {t('user.settings.notifications.title')}
      </h2>
      <label className="flex items-center space-x-2 cursor-pointer">
        <input
          type="checkbox"
          checked={receiveNotifications}
          onChange={(e) => onToggleNotifications(e.target.checked)}
          className="form-checkbox h-5 w-5 text-blue-600 rounded focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
        />
        <span className="text-gray-700 dark:text-gray-300">
          {t('user.settings.notifications.receive')}
        </span>
      </label>
    </div>
  );
};

export default NotificationSettings;

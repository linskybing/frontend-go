import { useTranslation } from '@nthucscc/utils';
import { Group } from '@/core/interfaces/group';
import {
  IdentificationIcon,
  TagIcon,
  ChatBubbleLeftRightIcon,
  CalendarDaysIcon,
} from '@heroicons/react/24/outline';

interface GroupOverviewTabProps {
  group: Group;
}

export default function GroupOverviewTab({ group }: GroupOverviewTabProps) {
  const { t } = useTranslation();
  const details = [
    { label: 'ID', value: group.GID, icon: IdentificationIcon },
    { label: t('groups.name'), value: group.GroupName, icon: TagIcon },
    {
      label: t('groups.description'),
      value: group.Description || 'N/A',
      icon: ChatBubbleLeftRightIcon,
    },
    {
      label: t('common.createdAt'),
      value: new Date(group.CreatedAt).toLocaleString(),
      icon: CalendarDaysIcon,
    },
    {
      label: t('common.updatedAt'),
      value: new Date(group.UpdatedAt).toLocaleString(),
      icon: CalendarDaysIcon,
    },
  ];

  return (
    <div className="max-w-3xl">
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          {t('groups.infoTitle')}
        </h3>
        <div className="mt-6 space-y-6 border-t border-gray-200 pt-6 dark:border-gray-700">
          {details.map((item) => (
            <div key={item.label} className="flex items-start gap-4">
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400">
                <item.icon className="h-6 w-6" aria-hidden="true" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{item.label}</p>
                <p className="mt-1 text-base font-semibold text-gray-900 dark:text-white">
                  {item.value}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

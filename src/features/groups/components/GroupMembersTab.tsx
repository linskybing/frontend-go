import { useTranslation } from '@nthucscc/utils';
import { Button } from '@nthucscc/ui';
import { PlusIcon } from '@heroicons/react/24/outline';
import { UserGroupUser } from '@/core/interfaces/userGroup';

interface GroupMembersTabProps {
  groupUsers: UserGroupUser[];
  canManage: boolean;
  onInvite: () => void;
  onEdit: (user: UserGroupUser) => void;
  onRemove: (userid: string) => void;
}

const RoleBadge = ({ role }: { role: string }) => {
  const roleStyles: { [key: string]: string } = {
    admin: 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300',
    manager: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300',
    user: 'bg-accent-100 text-accent-800 dark:bg-accent-900/50 dark:text-accent-300',
  };
  return (
    <span
      className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ${roleStyles[role] || 'bg-gray-100 text-gray-800'}`}
    >
      {role.charAt(0).toUpperCase() + role.slice(1)}
    </span>
  );
};

export default function GroupMembersTab({
  groupUsers,
  canManage,
  onInvite,
  onEdit,
  onRemove,
}: GroupMembersTabProps) {
  const { t } = useTranslation();

  return (
    <div className="space-y-6">
      {canManage && (
        <div className="flex justify-end">
          <Button onClick={onInvite} className="inline-flex items-center gap-2">
            <PlusIcon className="h-5 w-5" />
            {t('groups.inviteUser')}
          </Button>
        </div>
      )}

      <div className="rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800 overflow-hidden">
        <div className="border-b border-gray-200 p-4 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50">
          <h3 className="font-semibold text-gray-900 dark:text-white">{t('groups.membersList')}</h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {t('groups.memberCount', { count: groupUsers.length })}
          </p>
        </div>

        {groupUsers.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700/50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                    {t('table.user')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                    {t('table.role')}
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                    {t('common.actions')}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-800">
                {groupUsers.map((user) => (
                  <tr key={user.UID} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-8 w-8 rounded-full bg-accent-100 flex items-center justify-center text-accent-600 font-bold mr-3 dark:bg-accent-900/30 dark:text-accent-400">
                          {user.Username.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {user.Username}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400 font-mono">
                            UID: {user.UID}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <RoleBadge role={user.Role} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      {canManage && (
                        <>
                          <button
                            onClick={() => onEdit(user)}
                            className="mr-4 text-accent-600 hover:text-accent-900 dark:text-accent-400 dark:hover:text-accent-300"
                          >
                            {t('common.edit')}
                          </button>
                          <button
                            onClick={() => onRemove(user.UID)}
                            className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                          >
                            {t('common.remove')}
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-10 text-center text-gray-500 dark:text-gray-400">
            {t('groups.noMembers')}
          </div>
        )}
      </div>
    </div>
  );
}

import React, { useState, useEffect, useCallback } from 'react';
import { UserGroupUser } from '@/core/interfaces/userGroup';
import {
  getUsersByGroup,
  getGroupsByUser,
  createUserGroup,
} from '@/core/services/userGroupService';
import InviteUserModal, { FormData } from './InviteUserModal';
import { useTranslation } from '@nthucscc/utils';

interface ProjectMembersProps {
  groupId: string;
}

const ProjectMembers: React.FC<ProjectMembersProps> = ({ groupId }) => {
  const [members, setMembers] = useState<UserGroupUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [canManage, setCanManage] = useState(false);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const { t } = useTranslation();

  const fetchMembers = useCallback(async () => {
    try {
      setLoading(true);
      const users = await getUsersByGroup(groupId);
      setMembers(users);

      // Check permissions
      const userData = localStorage.getItem('userData');
      if (userData) {
        const { user_id: userId } = JSON.parse(userData);
        const userGroups = await getGroupsByUser(userId);
        const currentGroup = userGroups.find((g) => g.GID === groupId);
        if (currentGroup && (currentGroup.Role === 'admin' || currentGroup.Role === 'manager')) {
          setCanManage(true);
        }
      }
    } catch (error: unknown) {
      console.error('Failed to fetch members:', error);
    } finally {
      setLoading(false);
    }
  }, [groupId]);

  // Removed fetchAvailableUsers - users can be invited by entering username directly

  useEffect(() => {
    fetchMembers();
  }, [fetchMembers]);

  const handleInvite = async (data: FormData) => {
    await createUserGroup({
      u_id: data.uid,
      g_id: groupId,
      role: data.role,
    });
    setIsInviteModalOpen(false);
    fetchMembers();
  };

  const filteredMembers = members.filter((member) =>
    member.Username.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  if (loading) {
    return <div className="animate-pulse h-20 bg-gray-200 rounded-lg"></div>;
  }

  return (
    <div className="rounded-xl border border-gray-200 bg-white shadow-md dark:border-gray-700 dark:bg-gray-800">
      <div className="flex flex-col gap-4 border-b border-gray-200 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-6 dark:border-gray-600">
        <div>
          <h3 className="text-lg font-bold leading-6 text-gray-900 dark:text-white">
            {t('project.members.title')}
          </h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500 dark:text-gray-400">
            {t('project.members.description', { groupId })}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder={t('project.members.searchPlaceholder')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-accent-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
          />
          {canManage && (
            <button
              onClick={() => setIsInviteModalOpen(true)}
              className="inline-flex items-center justify-center gap-2 rounded-md border border-transparent bg-accent-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-accent-700 focus:outline-none focus:ring-2 focus:ring-accent-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
            >
              {t('project.members.addMember')}
            </button>
          )}
        </div>
      </div>
      <div className="p-4 sm:p-6">
        <ul className="divide-y divide-gray-200 dark:divide-gray-700">
          {filteredMembers.map((member) => (
            <li key={member.UID} className="py-3 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-bold">
                  {member.Username.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {member.Username}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {t('role.label', { role: member.Role })}
                  </p>
                </div>
              </div>
            </li>
          ))}
          {filteredMembers.length === 0 && (
            <li className="py-4 text-center text-gray-500 dark:text-gray-400">
              {members.length === 0 ? t('members.noneFound') : t('members.noMatch')}
            </li>
          )}
        </ul>
      </div>

      {canManage && (
        <InviteUserModal
          isOpen={isInviteModalOpen}
          onClose={() => setIsInviteModalOpen(false)}
          users={[]}
          onSubmit={handleInvite}
        />
      )}
    </div>
  );
};

export default ProjectMembers;

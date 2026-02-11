import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from '@nthucscc/utils';
import { Group } from '@/core/interfaces/group';
import { User } from '@/core/interfaces/user';
import { UserGroupUser } from '@/core/interfaces/userGroup';
import { getGroupById } from '@/core/services/groupService';
import { getUsers } from '@/core/services/userService';
import {
  createUserGroup,
  getUsersByGroup,
  deleteUserGroup,
  updateUserGroup,
} from '@/core/services/userGroupService';
import { FormData } from '../components/InviteUserModal';

export default function useGroupDetail(id: string) {
  const { t } = useTranslation();
  const [group, setGroup] = useState<Group | null>(null);
  const [groupUsers, setGroupUsers] = useState<UserGroupUser[]>([]);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [canManage, setCanManage] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refetchGroupUsers = useCallback(async () => {
    if (!id) return;
    try {
      const userGroupsData = await getUsersByGroup(id);
      setGroupUsers(userGroupsData);

      const userData = localStorage.getItem('userData');
      if (userData) {
        const { user_id: userId, is_super_admin } = JSON.parse(userData);

        if (is_super_admin === true) {
          setCanManage(true);
          return;
        }

        const currentUserInGroup = userGroupsData.find((u) => u.UID === userId);
        if (currentUserInGroup && currentUserInGroup.Role === 'admin') {
          setCanManage(true);
        } else {
          setCanManage(false);
        }
      }
    } catch (err) {
      console.warn('refetchGroupUsers error', err);
    }
  }, [id]);

  useEffect(() => {
    const fetchInitialData = async () => {
      if (!id) {
        setError(t('groups.error.userIdMissing'));
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        const [groupData, usersData] = await Promise.all([getGroupById(id), getUsers()]);
        setGroup(groupData);
        setAllUsers(usersData);
        await refetchGroupUsers();
      } catch (err) {
        setError(err instanceof Error ? err.message : t('groups.error.unknown'));
      } finally {
        setLoading(false);
      }
    };
    fetchInitialData();
  }, [id, refetchGroupUsers, t]);

  const handleInviteSubmit = async (formData: FormData) => {
    const { uid, role } = formData;
    if (!uid || !id) return;
    await createUserGroup({ u_id: uid, g_id: id, role });
    await refetchGroupUsers();
  };

  const handleDeleteUser = async (uid: string) => {
    if (!id || !window.confirm(t('common.confirmDelete'))) return;
    await deleteUserGroup({ u_id: uid, g_id: id });
    await refetchGroupUsers();
  };

  const handleUpdateRole = async (user: UserGroupUser, newRole: 'admin' | 'manager' | 'user') => {
    if (!id) return;
    await updateUserGroup({
      u_id: user.UID,
      g_id: id,
      role: newRole,
    });
    await refetchGroupUsers();
  };

  return {
    group,
    groupUsers,
    allUsers,
    canManage,
    loading,
    error,
    handleInviteSubmit,
    handleDeleteUser,
    handleUpdateRole,
  };
}

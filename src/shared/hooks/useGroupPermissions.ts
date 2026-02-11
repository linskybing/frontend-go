/**
 * Custom hook to check user permissions within a group
 */
import { useState, useEffect } from 'react';
import { getGroupsByUser } from '@/core/services/userGroupService';
import { getUserData, isSuperAdmin } from '../utils/permissions';

interface UseGroupPermissionsReturn {
  canManage: boolean;
  userRole: string | null;
  loading: boolean;
}

/**
 * Hook to check if current user can manage resources in a specific group
 * (e.g., configfiles, storage)
 * Super admins always have manage permissions
 * Users with admin or manager role in the group can manage resources
 *
 * Note: For managing group members, only 'admin' role is allowed (not manager)
 *
 * @param groupId - The ID of the group to check permissions for
 * @returns Object containing canManage flag, userRole, and loading state
 */
export function useGroupPermissions(groupId: string | null): UseGroupPermissionsReturn {
  const [canManage, setCanManage] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkPermissions = async () => {
      if (!groupId) {
        setCanManage(false);
        setUserRole(null);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);

        // Super admins can always manage
        if (isSuperAdmin()) {
          setCanManage(true);
          setUserRole('super_admin');
          setLoading(false);
          return;
        }

        // Check user's role in this specific group
        const userData = getUserData();
        if (!userData?.user_id) {
          setCanManage(false);
          setUserRole(null);
          setLoading(false);
          return;
        }

        const userGroups = await getGroupsByUser(userData.user_id);
        const currentGroup = userGroups.find((g) => g.GID === groupId);

        if (currentGroup) {
          const role = currentGroup.Role?.toLowerCase();
          setUserRole(role || null);
          setCanManage(role === 'admin' || role === 'manager');
        } else {
          setCanManage(false);
          setUserRole(null);
        }
      } catch (error: unknown) {
        console.error('Failed to check group permissions:', error);
        setCanManage(false);
        setUserRole(null);
      } finally {
        setLoading(false);
      }
    };

    checkPermissions();
  }, [groupId]);

  return { canManage, userRole, loading };
}

/**
 * Group Storage Permission API
 */

import { API_BASE_URL } from '@/core/config/url';
import { fetchWithAuth } from '@/shared/utils/api';
import {
  GroupStoragePermission,
  SetStoragePermissionRequest,
  BatchSetPermissionsRequest,
  SetStorageAccessPolicyRequest,
  StoragePermissionInfo,
} from '@/core/interfaces/groupStorage';

type ApiResponse<T> = { data?: T } | T;

const extractData = <T>(response: ApiResponse<T>): T => {
  if (response && typeof response === 'object' && 'data' in response) {
    return (response as { data?: T }).data as T;
  }
  return response as T;
};

const STORAGE_BASE_URL = `${API_BASE_URL}/storage`;

/**
 * Set user permission for group storage
 * POST /storage/permissions
 */
export const setStoragePermission = async (request: SetStoragePermissionRequest): Promise<void> => {
  try {
    await fetchWithAuth(`${STORAGE_BASE_URL}/permissions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        group_id: request.groupId,
        pvc_id: request.pvcId,
        user_id: request.userId,
        permission: request.permission,
      }),
    });
  } catch (error: unknown) {
    throw new Error(error instanceof Error ? error.message : 'Failed to set storage permission.');
  }
};

/**
 * Batch set permissions for multiple users
 * POST /storage/permissions/batch
 */
export const batchSetPermissions = async (request: BatchSetPermissionsRequest): Promise<void> => {
  try {
    await fetchWithAuth(`${STORAGE_BASE_URL}/permissions/batch`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        group_id: request.groupId,
        pvc_id: request.pvcId,
        permissions: request.permissions.map((p) => ({
          user_id: p.userId,
          permission: p.permission,
        })),
      }),
    });
  } catch (error: unknown) {
    throw new Error(error instanceof Error ? error.message : 'Failed to batch set permissions.');
  }
};

/**
 * Get user's permission for a specific group PVC
 * GET /storage/permissions/group/{groupId}/pvc/{pvcId}
 */
export const getUserPermission = async (
  groupId: string,
  pvcId: string,
): Promise<GroupStoragePermission> => {
  try {
    const response = await fetchWithAuth(
      `${STORAGE_BASE_URL}/permissions/group/${groupId}/pvc/${pvcId}`,
      {
        method: 'GET',
      },
    );
    return extractData<GroupStoragePermission>(response);
  } catch (error: unknown) {
    throw new Error(error instanceof Error ? error.message : 'Failed to get user permission.');
  }
};

/**
 * Set default access policy for group storage
 * POST /storage/policies
 */
export const setStorageAccessPolicy = async (
  request: SetStorageAccessPolicyRequest,
): Promise<void> => {
  try {
    await fetchWithAuth(`${STORAGE_BASE_URL}/policies`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        group_id: request.groupId,
        pvc_id: request.pvcId,
        default_permission: request.defaultPermission,
        admin_only: request.adminOnly || false,
      }),
    });
  } catch (error: unknown) {
    throw new Error(error instanceof Error ? error.message : 'Failed to set access policy.');
  }
};

/**
 * List all permissions for a group PVC
 * GET /storage/permissions/group/{groupId}/pvc/{pvcId}/list
 */
export const listPVCPermissions = async (
  groupId: string,
  pvcId: string,
): Promise<StoragePermissionInfo[]> => {
  try {
    const response = await fetchWithAuth(
      `${STORAGE_BASE_URL}/permissions/group/${groupId}/pvc/${pvcId}/list`,
      {
        method: 'GET',
      },
    );
    return extractData<StoragePermissionInfo[]>(response);
  } catch (error: unknown) {
    throw new Error(error instanceof Error ? error.message : 'Failed to list PVC permissions.');
  }
};

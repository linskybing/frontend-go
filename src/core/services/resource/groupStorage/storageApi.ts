/**
 * Group Storage API - CRUD operations
 */

import { API_BASE_URL } from '@/core/config/url';
import { fetchWithAuth } from '@/shared/utils/api';
import {
  GroupPVC,
  GroupPVCWithPermissions,
  CreateGroupStorageRequest,
  CreateGroupStorageResponse,
} from '@/core/interfaces/groupStorage';

type ApiResponse<T> = { data?: T } | T;

const extractData = <T>(response: ApiResponse<T>): T => {
  if (response && typeof response === 'object' && 'data' in response) {
    return (response as { data?: T }).data as T;
  }
  return response as T;
};

const GROUP_STORAGE_BASE_URL = `${API_BASE_URL}/storage`;

/**
 * Get all storage for a specific group
 * GET /storage/group/{groupId}
 */
export const getGroupStorages = async (groupId: string): Promise<GroupPVC[]> => {
  try {
    const response = await fetchWithAuth(`${GROUP_STORAGE_BASE_URL}/group/${groupId}`, {
      method: 'GET',
    });
    return extractData<GroupPVC[]>(response);
  } catch (error: unknown) {
    throw new Error(error instanceof Error ? error.message : 'Failed to fetch group storages.');
  }
};

/**
 * Get current user's accessible group storages (with permissions)
 * GET /storage/my-storages
 */
export const getMyGroupStorages = async (): Promise<GroupPVCWithPermissions[]> => {
  try {
    const response = await fetchWithAuth(`${GROUP_STORAGE_BASE_URL}/my-storages`, {
      method: 'GET',
    });
    return extractData<GroupPVCWithPermissions[]>(response);
  } catch (error: unknown) {
    throw new Error(
      error instanceof Error ? error.message : 'Failed to fetch your group storages.',
    );
  }
};

/**
 * Create new group storage
 * POST /storage/{groupId}/storage
 */
export const createGroupStorage = async (
  groupId: string,
  request: Omit<CreateGroupStorageRequest, 'groupId'>,
): Promise<CreateGroupStorageResponse> => {
  try {
    const response = await fetchWithAuth(`${GROUP_STORAGE_BASE_URL}/${groupId}/storage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        group_id: groupId,
        group_name: request.groupName,
        name: request.name,
        capacity: request.capacity,
        storage_class: request.storageClass || 'longhorn',
      }),
    });
    return extractData<CreateGroupStorageResponse>(response);
  } catch (error: unknown) {
    throw new Error(error instanceof Error ? error.message : 'Failed to create group storage.');
  }
};

/**
 * Delete group storage
 * DELETE /storage/{groupId}/storage/{pvcId}
 */
export const deleteGroupStorage = async (groupId: string, pvcId: string): Promise<void> => {
  try {
    await fetchWithAuth(`${GROUP_STORAGE_BASE_URL}/${groupId}/storage/${pvcId}`, {
      method: 'DELETE',
    });
  } catch (error: unknown) {
    throw new Error(error instanceof Error ? error.message : 'Failed to delete group storage.');
  }
};

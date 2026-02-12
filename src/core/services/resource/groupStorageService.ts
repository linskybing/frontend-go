/**
 * Group Storage Service
 *
 * API service for group-level storage management with permission control
 */

import { API_BASE_URL } from '@/core/config/url';
import { fetchWithAuth } from '@/shared/utils/api';
import {
  GroupPVC,
  GroupPVCWithPermissions,
  GroupStoragePermission,
  SetStoragePermissionRequest,
  BatchSetPermissionsRequest,
  SetStorageAccessPolicyRequest,
  StoragePermissionInfo,
  FileBrowserAccessResponse,
  CreateProjectPVCBindingRequest,
  ProjectPVCBindingInfo,
  CreateGroupStorageRequest,
  CreateGroupStorageResponse,
} from '@/core/interfaces/groupStorage';
import { getUserId } from '@/shared/utils/permissions';

type ApiResponse<T> = { data?: T } | T;

const extractData = <T>(response: ApiResponse<T>): T => {
  if (response && typeof response === 'object' && 'data' in response) {
    return (response as { data?: T }).data as T;
  }
  return response as T;
};

const GROUP_STORAGE_BASE_URL = `${API_BASE_URL}/storage`;
const STORAGE_BASE_URL = `${API_BASE_URL}/storage`;
const K8S_BASE_URL = `${API_BASE_URL}/k8s`;

// ===== Group Storage Management =====

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

// ===== Permission Management =====

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

// ===== FileBrowser Access =====

/**
 * Get FileBrowser access for group storage
 * POST /k8s/filebrowser/access
 */
export const getFileBrowserAccess = async (
  groupId: string | number,
  pvcId: string,
): Promise<FileBrowserAccessResponse> => {
  try {
    const userId = getUserId();
    const response = await fetchWithAuth(`${K8S_BASE_URL}/filebrowser/access`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        group_id: String(groupId),
        pvc_id: pvcId,
        user_id: userId ? String(userId) : '',
      }),
    });
    return extractData<FileBrowserAccessResponse>(response);
  } catch (error: unknown) {
    throw new Error(error instanceof Error ? error.message : 'Failed to get file browser access.');
  }
};

/**
 * Get proxy URL for group storage FileBrowser
 */
/**
 * Request FileBrowser access and return the URL
 */
export const getGroupStorageProxyUrl = async (groupId: string, pvcId: string): Promise<string> => {
  const resp = await getFileBrowserAccess(groupId, pvcId);
  return (resp.url || '') as string;
};

/**
 * Start group storage FileBrowser
 * POST /storage/{groupId}/storage/{pvcId}/start
 */
export const startGroupFileBrowser = async (groupId: string, pvcId: string): Promise<void> => {
  try {
    await fetchWithAuth(`${GROUP_STORAGE_BASE_URL}/${groupId}/storage/${pvcId}/start`, {
      method: 'POST',
    });
  } catch (error: unknown) {
    throw new Error(error instanceof Error ? error.message : 'Failed to start file browser.');
  }
};

/**
 * Stop group storage FileBrowser
 * DELETE /storage/{groupId}/storage/{pvcId}/stop
 */
export const stopGroupFileBrowser = async (groupId: string, pvcId: string): Promise<void> => {
  try {
    await fetchWithAuth(`${GROUP_STORAGE_BASE_URL}/${groupId}/storage/${pvcId}/stop`, {
      method: 'DELETE',
    });
  } catch (error: unknown) {
    throw new Error(error instanceof Error ? error.message : 'Failed to stop file browser.');
  }
};

// ===== PVC Binding (Mount group storage in project) =====

/**
 * Create PVC binding to mount group storage in project namespace
 * POST /k8s/pvc-binding
 */
export const createPVCBinding = async (
  request: CreateProjectPVCBindingRequest,
): Promise<ProjectPVCBindingInfo> => {
  try {
    const response = await fetchWithAuth(`${K8S_BASE_URL}/pvc-binding`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        project_id: request.projectId,
        group_pvc_id: request.groupPvcId,
        pvc_name: request.pvcName,
        read_only: request.readOnly || false,
      }),
    });
    return extractData<ProjectPVCBindingInfo>(response);
  } catch (error: unknown) {
    throw new Error(error instanceof Error ? error.message : 'Failed to create PVC binding.');
  }
};

/**
 * List PVC bindings for a project
 * GET /k8s/pvc-binding/project/{projectId}
 */
export const listProjectPVCBindings = async (
  projectId: string,
): Promise<ProjectPVCBindingInfo[]> => {
  try {
    const response = await fetchWithAuth(`${K8S_BASE_URL}/pvc-binding/project/${projectId}`, {
      method: 'GET',
    });
    return extractData<ProjectPVCBindingInfo[]>(response);
  } catch (error: unknown) {
    throw new Error(error instanceof Error ? error.message : 'Failed to list PVC bindings.');
  }
};

/**
 * Delete PVC binding
 * DELETE /k8s/pvc-binding/{bindingId}
 */
export const deletePVCBinding = async (bindingId: string): Promise<void> => {
  try {
    await fetchWithAuth(`${K8S_BASE_URL}/pvc-binding/${bindingId}`, {
      method: 'DELETE',
    });
  } catch (error: unknown) {
    throw new Error(error instanceof Error ? error.message : 'Failed to delete PVC binding.');
  }
};

// Service object export for easier consumption
export const groupStorageService = {
  getGroupStorages,
  getMyGroupStorages,
  createGroupStorage,
  deleteGroupStorage,
  setStoragePermission,
  batchSetPermissions,
  getUserPermission,
  setStorageAccessPolicy,
  listPVCPermissions,
  getFileBrowserAccess,
  getGroupStorageProxyUrl,
  startGroupFileBrowser,
  stopGroupFileBrowser,
  createPVCBinding,
  listProjectPVCBindings,
  deletePVCBinding,
};

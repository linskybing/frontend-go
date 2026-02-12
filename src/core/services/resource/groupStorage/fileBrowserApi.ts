/**
 * Group Storage FileBrowser API
 */

import { API_BASE_URL } from '@/core/config/url';
import { fetchWithAuth } from '@/shared/utils/api';
import { FileBrowserAccessResponse } from '@/core/interfaces/groupStorage';
import { getUserId } from '@/shared/utils/permissions';

type ApiResponse<T> = { data?: T } | T;

const extractData = <T>(response: ApiResponse<T>): T => {
  if (response && typeof response === 'object' && 'data' in response) {
    return (response as { data?: T }).data as T;
  }
  return response as T;
};

const K8S_BASE_URL = `${API_BASE_URL}/k8s`;
const GROUP_STORAGE_BASE_URL = `${API_BASE_URL}/storage`;

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
 * Request FileBrowser access and return the URL
 */
export const getGroupStorageProxyUrl = async (groupId: string, pvcId: string): Promise<string> => {
  const resp = await getFileBrowserAccess(groupId, pvcId);
  return (resp.url || '') as string;
};

/**
 * Start group storage FileBrowser
 * POST /groups/{groupId}/storage/{pvcId}/start
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
 * DELETE /groups/{groupId}/storage/{pvcId}/stop
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

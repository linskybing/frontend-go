import {
  PVC_CREATE_URL,
  PVC_EXPAND_URL,
  PVC_LIST_URL,
  PVC_GET_URL,
  PVC_DELETE_URL,
  PVC_FILEBROWSER_START_URL,
  PVC_FILEBROWSER_STOP_URL,
  USER_DRIVE_URL,
  API_BASE_URL,
} from '@/core/config/url';
import { PVC, PVCRequest } from '@/core/interfaces/pvc';
// canonical types are in '@/core/interfaces/groupStorage'
import { fetchWithAuth } from '@/shared/utils/api';
import { getMyGroupStorages as fetchMyGroupStorages } from './groupStorageService';

type ApiResponse<T> = { data?: T } | T;

const extractData = <T>(response: ApiResponse<T>): T => {
  if (response && typeof response === 'object' && 'data' in response) {
    return (response as { data?: T }).data as T;
  }
  return response as T;
};

// --- Legacy PVC Operations ---

export const createPVC = async (input: PVCRequest): Promise<{ [key: string]: string }> => {
  const formData = new URLSearchParams();
  formData.append('name', input.name);
  formData.append('namespace', input.namespace);
  formData.append('size', input.size);
  formData.append('storageClassName', input.storageClassName);

  try {
    const response = await fetchWithAuth(PVC_CREATE_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: formData,
    });
    return extractData<{ [key: string]: string }>(response);
  } catch (error: unknown) {
    throw new Error(error instanceof Error ? error.message : 'Failed to create PVC.');
  }
};

export const expandPVC = async (input: PVCRequest): Promise<{ [key: string]: string }> => {
  const formData = new URLSearchParams();
  formData.append('name', input.name);
  formData.append('namespace', input.namespace);
  formData.append('size', input.size);
  formData.append('storageClassName', input.storageClassName);

  try {
    const response = await fetchWithAuth(PVC_EXPAND_URL, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: formData,
    });
    return extractData<{ [key: string]: string }>(response);
  } catch (error: unknown) {
    throw new Error(error instanceof Error ? error.message : 'Failed to expand PVC.');
  }
};

export const getPVCList = async (namespace: string): Promise<PVC[]> => {
  try {
    const response = await fetchWithAuth(PVC_LIST_URL(namespace), {
      method: 'GET',
    });
    return extractData<PVC[]>(response);
  } catch (error: unknown) {
    throw new Error(error instanceof Error ? error.message : 'Failed to fetch PVC list.');
  }
};

export const getPVC = async (namespace: string, name: string): Promise<PVC> => {
  try {
    const response = await fetchWithAuth(PVC_GET_URL(namespace, name), {
      method: 'GET',
    });
    return extractData<PVC>(response);
  } catch (error: unknown) {
    throw new Error(error instanceof Error ? error.message : 'Failed to fetch PVC.');
  }
};

export const deletePVC = async (
  namespace: string,
  name: string,
): Promise<{ [key: string]: string }> => {
  try {
    const response = await fetchWithAuth(PVC_DELETE_URL(namespace, name), {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    });
    return extractData<{ [key: string]: string }>(response);
  } catch (error: unknown) {
    throw new Error(error instanceof Error ? error.message : 'Failed to delete PVC.');
  }
};

export const startFileBrowser = async (
  namespace: string,
  pvcName: string,
): Promise<{ nodePort: number }> => {
  try {
    const response = await fetchWithAuth(PVC_FILEBROWSER_START_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ namespace, pvc_name: pvcName }),
    });
    return extractData<{ nodePort: number }>(response);
  } catch (error: unknown) {
    throw new Error(error instanceof Error ? error.message : 'Failed to start file browser.');
  }
};

export const stopFileBrowser = async (namespace: string, pvcName: string): Promise<void> => {
  try {
    await fetchWithAuth(PVC_FILEBROWSER_STOP_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ namespace, pvc_name: pvcName }),
    });
  } catch (error: unknown) {
    throw new Error(error instanceof Error ? error.message : 'Failed to stop file browser.');
  }
};

// --- User Storage Hub Operations ---

export const expandUserStorage = async (username: string, newSize: string): Promise<void> => {
  try {
    await fetchWithAuth(`${API_BASE_URL}/k8s/users/${username}/storage/expand`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ new_size: newSize }),
    });
  } catch (error: unknown) {
    throw new Error(error instanceof Error ? error.message : 'Failed to expand user storage.');
  }
};

export const initUserStorage = async (username: string): Promise<void> => {
  try {
    await fetchWithAuth(`${API_BASE_URL}/k8s/users/${username}/storage/init`, {
      method: 'POST',
    });
  } catch (error: unknown) {
    throw new Error(error instanceof Error ? error.message : 'Failed to initialize user storage.');
  }
};

export const deleteUserStorage = async (username: string): Promise<void> => {
  try {
    await fetchWithAuth(`${API_BASE_URL}/k8s/users/${username}/storage`, {
      method: 'DELETE',
    });
  } catch (error: unknown) {
    throw new Error(error instanceof Error ? error.message : 'Failed to delete user storage.');
  }
};

export const checkUserStorageStatus = async (username: string): Promise<boolean> => {
  try {
    const response = await fetchWithAuth(`${API_BASE_URL}/k8s/users/${username}/storage/status`, {
      method: 'GET',
    });
    return response.exists;
  } catch (error: unknown) {
    return false;
  }
};

export const openUserDrive = async (): Promise<{ nodePort: number }> => {
  try {
    const response = await fetchWithAuth(USER_DRIVE_URL, {
      method: 'POST',
    });
    const data = extractData<{ nodePort?: number }>(response);
    return { nodePort: Number(data.nodePort) };
  } catch (error: unknown) {
    throw new Error(error instanceof Error ? error.message : 'Failed to open user drive.');
  }
};

export const stopUserDrive = async (): Promise<void> => {
  try {
    await fetchWithAuth(USER_DRIVE_URL, {
      method: 'DELETE',
    });
  } catch (error: unknown) {
    // Silent failure - drive stop may fail without affecting user experience
  }
};
// --- Group Storage (project -> group) Operations ---

/**
 * Get PVCs for a specific project (filter from all accessible group storages)
 */
export const getPVCListByProject = async (pid: string): Promise<PVC[]> => {
  try {
    const allMy = await fetchMyGroupStorages();
    const filtered = (allMy || []).filter((s) => String(s.id) === String(pid));

    const mapped: PVC[] = filtered.map((p) => ({
      name: p.pvcName || '',
      namespace: p.namespace || '',
      size: String(p.capacity ?? ''),
      status: p.status || '',
    }));

    return mapped;
  } catch (error: unknown) {
    throw new Error(
      error instanceof Error ? error.message : 'Failed to fetch PVC list by project.',
    );
  }
};

/**
 * Fetch group storages for the current logged-in user
 * GET /groups/my-storages
 */
/**
 * New canonical accessor: fetch group-level storages available to the user.
 * Keep the old `getMyProjectStorages` as a compatibility alias for now.
 */
// Removed legacy `getMyProjectStorages` alias — use `groupStorageService.getMyGroupStorages` instead.

/**
 * Get proxy URL for user hub file browser
 */
export const getUserHubProxyUrl = (): string => {
  return `${API_BASE_URL}/k8s/users/proxy/`;
};

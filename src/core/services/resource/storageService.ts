import { USER_DRIVE_URL, API_BASE_URL } from '@/core/config/url';
import { fetchWithAuth } from '@/shared/utils/api';

type ApiResponse<T> = { data?: T } | T;

const extractData = <T>(response: ApiResponse<T>): T => {
  if (response && typeof response === 'object' && 'data' in response) {
    return (response as { data?: T }).data as T;
  }
  return response as T;
};

// --- User Storage Hub Operations ---

export const expandUserStorage = async (username: string, newSize: string): Promise<void> => {
  try {
    await fetchWithAuth(`${API_BASE_URL}/admin/user-storage/${username}/expand`, {
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
    await fetchWithAuth(`${API_BASE_URL}/admin/user-storage/${username}/init`, {
      method: 'POST',
    });
  } catch (error: unknown) {
    throw new Error(error instanceof Error ? error.message : 'Failed to initialize user storage.');
  }
};

export const deleteUserStorage = async (username: string): Promise<void> => {
  try {
    await fetchWithAuth(`${API_BASE_URL}/admin/user-storage/${username}`, {
      method: 'DELETE',
    });
  } catch (error: unknown) {
    throw new Error(error instanceof Error ? error.message : 'Failed to delete user storage.');
  }
};

export const checkAdminUserStorageStatus = async (username: string): Promise<boolean> => {
  try {
    const response = await fetchWithAuth(`${API_BASE_URL}/admin/user-storage/${username}/status`, {
      method: 'GET',
    });
    return response.exists;
  } catch (error: unknown) {
    return false;
  }
};

export const checkUserStorageStatus = async (): Promise<boolean> => {
  try {
    const response = await fetchWithAuth(`${API_BASE_URL}/k8s/user-storage/status`, {
      method: 'GET',
    });
    return response.exists;
  } catch (error: any) {
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
// Group storage selection is handled via group storage service APIs.

/**
 * Get proxy URL for user hub file browser
 */
export const getUserHubProxyUrl = (): string => {
  return `${API_BASE_URL}/k8s/user-storage/proxy/`;
};

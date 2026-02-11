import { USER_GROUP_URL, USER_GROUP_BY_GROUP_URL, USER_GROUP_BY_USER_URL } from '@/core/config/url';
import { MessageResponse } from '@/core/response/response';
import { UserGroup, UserGroupUser, UserGroupGroup } from '@/core/interfaces/userGroup';
import { fetchWithAuth } from '@/shared/utils/api';

type ApiResponse<T> = { data?: T } | T;

const extractData = <T>(response: ApiResponse<T>): T => {
  if (response && typeof response === 'object' && 'data' in response) {
    return (response as { data?: T }).data as T;
  }
  return response as T;
};

export const getUserGroup = async (u_id: string, g_id: string): Promise<UserGroup> => {
  try {
    const response = await fetchWithAuth(`${USER_GROUP_URL}?u_id=${u_id}&g_id=${g_id}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    });
    return extractData<UserGroup>(response);
  } catch (error: unknown) {
    throw new Error(error instanceof Error ? error.message : 'Failed to fetch user-group.');
  }
};

export interface UserGroupInputDTO {
  u_id: string;
  g_id: string;
  role: 'admin' | 'manager' | 'user';
}

export const createUserGroup = async (input: UserGroupInputDTO): Promise<UserGroup> => {
  const payload = new URLSearchParams({
    u_id: input.u_id,
    g_id: input.g_id,
    role: input.role,
  });
  try {
    const response = await fetchWithAuth(USER_GROUP_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: payload.toString(),
    });
    return extractData<UserGroup>(response);
  } catch (error: unknown) {
    throw new Error(error instanceof Error ? error.message : 'Failed to create.');
  }
};

export const updateUserGroup = async (input: UserGroupInputDTO): Promise<UserGroup> => {
  const payload = new URLSearchParams({
    u_id: input.u_id,
    g_id: input.g_id,
    role: input.role,
  });
  try {
    const response = await fetchWithAuth(USER_GROUP_URL, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: payload.toString(),
    });
    return extractData<UserGroup>(response);
  } catch (error: unknown) {
    throw new Error(error instanceof Error ? error.message : 'Failed to update user-group.');
  }
};

export interface UserGroupDeleteDTO {
  u_id: string;
  g_id: string;
}

export const deleteUserGroup = async (input: UserGroupDeleteDTO): Promise<MessageResponse> => {
  try {
    const response = await fetchWithAuth(
      `${USER_GROUP_URL}?u_id=${input.u_id}&g_id=${input.g_id}`,
      {
        method: 'DELETE',
      },
    );

    if (
      response &&
      typeof response === 'object' &&
      'status' in response &&
      response.status === 204
    ) {
      return { message: '204' } as MessageResponse;
    }

    return extractData<MessageResponse>(response);
  } catch (error: unknown) {
    throw new Error(error instanceof Error ? error.message : 'Failed to delete user-group.');
  }
};

export const getUsersByGroup = async (g_id: string): Promise<UserGroupUser[]> => {
  try {
    const response = await fetchWithAuth(`${USER_GROUP_BY_GROUP_URL}?g_id=${g_id}`, {
      method: 'GET',
    });

    const dataMap = extractData<Record<string, unknown>>(response);

    if (!dataMap || typeof dataMap !== 'object') {
      return [];
    }

    const groupData = dataMap[g_id] || dataMap[g_id.toString()];
    return (groupData as { Users?: UserGroupUser[] })?.Users ?? [];
  } catch (error: unknown) {
    return [];
  }
};

export const getGroupsByUser = async (u_id: string): Promise<UserGroupGroup[]> => {
  try {
    const response = await fetchWithAuth(`${USER_GROUP_BY_USER_URL}?u_id=${u_id}`, {
      method: 'GET',
    });

    const data = extractData<UserGroup[]>(response);

    if (!data || !Array.isArray(data)) {
      return [];
    }

    const groups: UserGroupGroup[] = data.map((ug: UserGroup) => ({
      GID: ug.GID,
      GroupName: '',
      Role: ug.Role as 'admin' | 'manager' | 'user',
    }));

    return groups;
  } catch (error: unknown) {
    return [];
  }
};

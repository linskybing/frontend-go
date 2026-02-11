import { GROUPS_URL, GROUP_BY_ID_URL } from '@/core/config/url';
import { MessageResponse } from '@/core/response/response';
import { Group } from '@/core/interfaces/group';
import { fetchWithAuth } from '@/shared/utils/api';

type ApiResponse<T> = { data?: T } | T;

const extractData = <T>(response: ApiResponse<T>): T => {
  if (response && typeof response === 'object' && 'data' in response) {
    return (response as { data?: T }).data as T;
  }
  return response as T;
};

export const getGroups = async (): Promise<Group[]> => {
  try {
    const response = await fetchWithAuth(GROUPS_URL, {
      method: 'GET',
    });
    return extractData<Group[]>(response);
  } catch (error: unknown) {
    throw new Error(error instanceof Error ? error.message : 'Failed to fetch groups.');
  }
};

export interface CreateGroupInput {
  group_name: string;
  description?: string;
}

export const createGroup = async (input: CreateGroupInput): Promise<Group> => {
  const formData = new FormData();
  formData.append('group_name', input.group_name);
  if (input.description) formData.append('description', input.description);

  try {
    const response = await fetchWithAuth(GROUPS_URL, {
      method: 'POST',
      body: formData,
    });
    return extractData<Group>(response);
  } catch (error: unknown) {
    throw new Error(error instanceof Error ? error.message : 'Failed to create group.');
  }
};

export const getGroupById = async (id: string): Promise<Group> => {
  try {
    const response = await fetchWithAuth(GROUP_BY_ID_URL(id), {
      method: 'GET',
    });
    return extractData<Group>(response);
  } catch (error: unknown) {
    throw new Error(error instanceof Error ? error.message : 'Failed to fetch group.');
  }
};

export const updateGroup = async (id: string, input: CreateGroupInput): Promise<Group> => {
  const formData = new FormData();
  formData.append('group_name', input.group_name);
  if (input.description) formData.append('description', input.description);

  try {
    const response = await fetchWithAuth(GROUP_BY_ID_URL(id), {
      method: 'PUT',
      body: formData,
    });
    return extractData<Group>(response);
  } catch (error: unknown) {
    throw new Error(error instanceof Error ? error.message : 'Failed to update group.');
  }
};

export const deleteGroup = async (id: string): Promise<MessageResponse> => {
  try {
    const response = await fetchWithAuth(GROUP_BY_ID_URL(id), {
      method: 'DELETE',
    });
    return extractData<MessageResponse>(response);
  } catch (error: unknown) {
    throw new Error(error instanceof Error ? error.message : 'Failed to delete group.');
  }
};

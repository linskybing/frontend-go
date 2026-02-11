import { USERS_URL, USER_BY_ID_URL } from '@/core/config/url';
import { MessageResponse } from '@/core/response/response';
import { User, UserRequest } from '@/core/interfaces/user';
import { fetchWithAuth } from '@/shared/utils/api';

type ApiResponse<T> = { data?: T } | T;

const extractData = <T>(response: ApiResponse<T>): T => {
  if (response && typeof response === 'object' && 'data' in response) {
    return (response as { data?: T }).data as T;
  }
  return response as T;
};

export const getUsers = async (): Promise<User[]> => {
  try {
    const response = await fetchWithAuth(USERS_URL, {
      method: 'GET',
    });
    return extractData<User[]>(response);
  } catch (error: unknown) {
    throw new Error(error instanceof Error ? error.message : 'Failed to fetch users.');
  }
};

export const getUserById = async (id: string): Promise<User> => {
  try {
    const response = await fetchWithAuth(USER_BY_ID_URL(id), {
      method: 'GET',
    });
    return extractData<User>(response);
  } catch (error: unknown) {
    throw new Error(error instanceof Error ? error.message : 'Failed to fetch user.');
  }
};

export const updateUser = async (id: string, input: Partial<UserRequest>): Promise<User> => {
  const formData = new URLSearchParams();
  if (input.username) formData.append('username', input.username);
  if (input.password) formData.append('password', input.password);
  if (input.email) formData.append('email', input.email);
  if (input.role) formData.append('role', input.role);

  try {
    const response = await fetchWithAuth(USER_BY_ID_URL(id), {
      method: 'PUT',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: formData,
    });
    return extractData<User>(response);
  } catch (error: unknown) {
    throw new Error(error instanceof Error ? error.message : 'Failed to update user.');
  }
};

export const deleteUser = async (id: string): Promise<MessageResponse> => {
  try {
    const response = await fetchWithAuth(USER_BY_ID_URL(id), {
      method: 'DELETE',
    });
    return extractData<MessageResponse>(response);
  } catch (error: unknown) {
    throw new Error(error instanceof Error ? error.message : 'Failed to delete user.');
  }
};

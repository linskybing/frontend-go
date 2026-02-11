import { RESOURCES_URL, RESOURCE_BY_ID_URL, CONFIG_FILE_BY_ID_URL } from '@/core/config/url';
import { MessageResponse } from '@/core/response/response';
import { Resource } from '@/core/interfaces/resource';
import { fetchWithAuth } from '@/shared/utils/api';

type ApiResponse<T> = { data?: T } | T;

const extractData = <T>(response: ApiResponse<T>): T => {
  if (response && typeof response === 'object' && 'data' in response) {
    return (response as { data?: T }).data as T;
  }
  return response as T;
};

export const getResourceById = async (id: string): Promise<Resource> => {
  try {
    const response = await fetchWithAuth(RESOURCE_BY_ID_URL(id), {
      method: 'GET',
    });
    return extractData<Resource>(response);
  } catch (error: unknown) {
    throw new Error(error instanceof Error ? error.message : 'Failed to fetch resource.');
  }
};

export interface UpdateResourceInput {
  name?: string;
  type?: string;
  parsed_yaml?: string;
  description?: string;
}

export const updateResource = async (id: string, input: UpdateResourceInput): Promise<Resource> => {
  const formData = new FormData();
  if (input.name) formData.append('name', input.name);
  if (input.type) formData.append('type', input.type);
  if (input.parsed_yaml) formData.append('parsed_yaml', input.parsed_yaml);
  if (input.description) formData.append('description', input.description);

  try {
    const response = await fetchWithAuth(RESOURCE_BY_ID_URL(id), {
      method: 'PUT',
      body: formData,
    });
    return extractData<Resource>(response);
  } catch (error: unknown) {
    throw new Error(error instanceof Error ? error.message : 'Failed to update resource.');
  }
};

export const deleteResource = async (id: string): Promise<MessageResponse> => {
  try {
    const response = await fetchWithAuth(RESOURCE_BY_ID_URL(id), {
      method: 'DELETE',
    });
    return extractData<MessageResponse>(response);
  } catch (error: unknown) {
    throw new Error(error instanceof Error ? error.message : 'Failed to delete resource.');
  }
};

export const getResources = async (): Promise<Resource[]> => {
  try {
    const response = await fetchWithAuth(RESOURCES_URL, {
      method: 'GET',
    });
    return response as Resource[];
  } catch (error: unknown) {
    throw new Error(error instanceof Error ? error.message : 'Failed to fetch resources.');
  }
};

export const getResourcesByConfigFile = async (cfId: string): Promise<Resource[]> => {
  try {
    const response = await fetchWithAuth(`${CONFIG_FILE_BY_ID_URL(cfId)}/resources`, {
      // Wrap with your base URL
      method: 'GET',
    });
    return response as Resource[];
  } catch (error: unknown) {
    throw new Error(
      error instanceof Error ? error.message : 'Failed to fetch resources by config file.',
    );
  }
};

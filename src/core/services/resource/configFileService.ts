import {
  CONFIG_FILES_URL,
  CONFIG_FILE_BY_ID_URL,
  CONFIG_FILE_RESOURCES_URL,
  CONFIG_FILES_BY_PROJECT_URL,
  INSTANCE_BY_ID_URL,
} from '@/core/config/url';
import { MessageResponse } from '@/core/response/response';
import { ConfigFile } from '@/core/interfaces/configFile';
import { Resource } from '@/core/interfaces/resource';
import { fetchWithAuth } from '@/shared/utils/api';
import { NetworkError, ServerError } from '@/core/errors';

type ApiResponse<T> = { data?: T } | T;

const extractData = <T>(response: ApiResponse<T>): T => {
  if (response && typeof response === 'object' && 'data' in response) {
    return (response as { data?: T }).data as T;
  }
  return response as T;
};

export const getConfigFiles = async (): Promise<ConfigFile[]> => {
  try {
    const response = await fetchWithAuth(CONFIG_FILES_URL, {
      method: 'GET',
    });
    return extractData<ConfigFile[]>(response);
  } catch (error: unknown) {
    if (error instanceof Error && error.message === 'Network error') {
      throw new NetworkError('Failed to fetch config files: network issue');
    }
    throw new ServerError(
      error instanceof Error
        ? `Failed to fetch config files: ${error.message}`
        : 'Failed to fetch config files.',
      error instanceof Error && error.message.includes('401') ? 401 : 500,
    );
  }
};

export interface CreateConfigFileInput {
  filename: string;
  raw_yaml: string;
  project_id: string;
}

export const createConfigFile = async (input: CreateConfigFileInput): Promise<ConfigFile> => {
  const formData = new FormData();
  formData.append('filename', input.filename);
  formData.append('raw_yaml', input.raw_yaml);
  formData.append('project_id', input.project_id);

  try {
    const response = await fetchWithAuth(CONFIG_FILES_URL, {
      method: 'POST',
      body: formData,
    });
    return extractData<ConfigFile>(response);
  } catch (error: unknown) {
    if (error instanceof Error && error.message === 'Network error') {
      throw new NetworkError('Failed to create config file: network issue');
    }
    throw new ServerError(
      error instanceof Error
        ? `Failed to create config file: ${error.message}`
        : 'Failed to create config file.',
    );
  }
};

export const getConfigFileById = async (id: string): Promise<ConfigFile> => {
  try {
    const response = await fetchWithAuth(CONFIG_FILE_BY_ID_URL(id), {
      method: 'GET',
    });
    return extractData<ConfigFile>(response);
  } catch (error: unknown) {
    throw new ServerError(
      error instanceof Error
        ? `Failed to fetch config file: ${error.message}`
        : 'Failed to fetch config file.',
    );
  }
};

export interface UpdateConfigFileInput {
  filename?: string;
  raw_yaml?: string;
}

export const updateConfigFile = async (
  id: string,
  input: UpdateConfigFileInput,
): Promise<ConfigFile> => {
  const formData = new FormData();
  if (input.filename) formData.append('filename', input.filename);
  if (input.raw_yaml) formData.append('raw_yaml', input.raw_yaml);

  try {
    const response = await fetchWithAuth(CONFIG_FILE_BY_ID_URL(id), {
      method: 'PUT',
      body: formData,
    });
    return extractData<ConfigFile>(response);
  } catch (error: unknown) {
    throw new ServerError(
      error instanceof Error
        ? `Failed to update config file: ${error.message}`
        : 'Failed to update config file.',
    );
  }
};

export const deleteConfigFile = async (id: string): Promise<MessageResponse> => {
  try {
    const response = await fetchWithAuth(CONFIG_FILE_BY_ID_URL(id), {
      method: 'DELETE',
    });
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
    throw new ServerError(
      error instanceof Error
        ? `Failed to delete config file: ${error.message}`
        : 'Failed to delete config file.',
    );
  }
};

export const getResourcesByConfigFile = async (id: string): Promise<Resource[]> => {
  try {
    const response = await fetchWithAuth(CONFIG_FILE_RESOURCES_URL(id), {
      method: 'GET',
    });
    return extractData<Resource[]>(response);
  } catch (error: unknown) {
    throw new ServerError(
      error instanceof Error
        ? `Failed to fetch resources: ${error.message}`
        : 'Failed to fetch resources.',
    );
  }
};

export const getConfigFilesByProjectId = async (projectId: string): Promise<ConfigFile[]> => {
  try {
    const response = await fetchWithAuth(CONFIG_FILES_BY_PROJECT_URL(projectId), {
      method: 'GET',
    });
    return extractData<ConfigFile[]>(response);
  } catch (error: unknown) {
    throw new ServerError(
      error instanceof Error
        ? `Failed to fetch project config files: ${error.message}`
        : 'Failed to fetch config files by project ID.',
    );
  }
};

export const createInstance = async (id: string): Promise<MessageResponse> => {
  try {
    const response = await fetchWithAuth(INSTANCE_BY_ID_URL(id), { method: 'POST' });
    return extractData<MessageResponse>(response);
  } catch (error: unknown) {
    throw new ServerError(
      error instanceof Error
        ? `Failed to create instance: ${error.message}`
        : 'Failed to create instance.',
    );
  }
};

export const deleteInstance = async (id: string): Promise<void> => {
  try {
    await fetchWithAuth(INSTANCE_BY_ID_URL(id), { method: 'DELETE' });
  } catch (error: unknown) {
    throw new ServerError(
      error instanceof Error
        ? `Failed to delete instance: ${error.message}`
        : 'Failed to delete instance.',
    );
  }
};

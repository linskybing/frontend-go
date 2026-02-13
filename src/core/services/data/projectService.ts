import {
  PROJECTS_BY_USER_URL,
  PROJECTS_URL,
  PROJECT_BY_ID_URL,
  PROJECT_CONFIG_FILES_URL,
  PROJECT_RESOURCES_URL,
} from '@/core/config/url';
import { MessageResponse } from '@/core/response/response';
import { Project, ScheduleWindow } from '@/core/interfaces/project';
import { ConfigFile } from '@/core/interfaces/configFile';
import { Resource } from '@/core/interfaces/resource';
import { fetchWithAuth } from '@/shared/utils/api';

type ApiResponse<T> = { data?: T } | T;

const extractData = <T>(response: ApiResponse<T>): T => {
  if (response && typeof response === 'object' && 'data' in response) {
    return (response as { data?: T }).data as T;
  }
  return response as T;
};

export const getProjects = async (): Promise<Project[]> => {
  try {
    const response = await fetchWithAuth(PROJECTS_URL, {
      method: 'GET',
    });
    const data = extractData<Project[]>(response);
    return Array.isArray(data) ? data : [];
  } catch (error: unknown) {
    throw new Error(error instanceof Error ? error.message : 'Failed to fetch projects.');
  }
};

/**
 * Fetch all projects associated with the current user.
 * This endpoint typically returns project details along with the user's specific role.
 * GET /projects/by-user
 */
export const getProjectListByUser = async (): Promise<Project[]> => {
  try {
    const response = await fetchWithAuth(PROJECTS_BY_USER_URL(), {
      method: 'GET',
    });

    const data = extractData<Project[]>(response);
    return Array.isArray(data) ? data : [];
  } catch (error: unknown) {
    throw new Error(error instanceof Error ? error.message : 'Failed to fetch your projects.');
  }
};

export interface CreateProjectDTO {
  project_name: string;
  description?: string;
  g_id: string;
  gpu_quota?: number;
  gpu_access?: string;
  mps_memory?: number;
  max_concurrent_jobs_per_user?: number;
  max_queued_jobs_per_user?: number;
  max_job_runtime_seconds?: number;
  max_project_users?: number;
  schedule_windows?: ScheduleWindow[];
}

export const createProject = async (input: CreateProjectDTO): Promise<Project> => {
  try {
    const response = await fetchWithAuth(PROJECTS_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(input),
    });
    return extractData<Project>(response);
  } catch (error: unknown) {
    throw new Error(error instanceof Error ? error.message : 'Failed to create group.');
  }
};

export const getProjectById = async (id: string): Promise<Project> => {
  try {
    const response = await fetchWithAuth(PROJECT_BY_ID_URL(id), {
      method: 'GET',
    });
    return extractData<Project>(response);
  } catch (error: unknown) {
    throw new Error(error instanceof Error ? error.message : 'Failed to fetch project.');
  }
};

export interface UpdateProjectInput {
  project_name?: string;
  description?: string;
  g_id?: string;
  gpu_quota?: number;
  gpu_access?: string;
  mps_memory?: number;
  max_concurrent_jobs_per_user?: number;
  max_queued_jobs_per_user?: number;
  max_job_runtime_seconds?: number;
  max_project_users?: number;
  schedule_windows?: ScheduleWindow[];
}

export const updateProject = async (id: string, input: UpdateProjectInput): Promise<Project> => {
  try {
    const response = await fetchWithAuth(PROJECT_BY_ID_URL(id), {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(input),
    });
    return extractData<Project>(response);
  } catch (error: unknown) {
    throw new Error(error instanceof Error ? error.message : 'Failed to update project.');
  }
};

export const deleteProject = async (id: string): Promise<MessageResponse> => {
  try {
    const response = await fetchWithAuth(PROJECT_BY_ID_URL(id), {
      method: 'DELETE',
    });
    return extractData<MessageResponse>(response);
  } catch (error: unknown) {
    throw new Error(error instanceof Error ? error.message : 'Failed to delete project.');
  }
};

export const getConfigFilesByProject = async (id: string): Promise<ConfigFile[]> => {
  try {
    const response = await fetchWithAuth(PROJECT_CONFIG_FILES_URL(id), {
      method: 'GET',
    });
    return extractData<ConfigFile[]>(response);
  } catch (error: unknown) {
    throw new Error(error instanceof Error ? error.message : 'Failed to fetch config files.');
  }
};

export const getResourcesByProject = async (id: string): Promise<Resource[]> => {
  try {
    const response = await fetchWithAuth(PROJECT_RESOURCES_URL(id), {
      method: 'GET',
    });
    return extractData<Resource[]>(response);
  } catch (error: unknown) {
    throw new Error(error instanceof Error ? error.message : 'Failed to fetch resources.');
  }
};

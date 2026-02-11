import { API_BASE_URL } from '@/core/config/url';
import { fetchWithAuth } from '@/shared/utils/api';

type ApiResponse<T> = { data?: T } | T;

const extractData = <T>(response: ApiResponse<T>): T => {
  if (response && typeof response === 'object' && 'data' in response) {
    return (response as { data?: T }).data as T;
  }
  return response as T;
};

export interface FailedPullJob {
  job_id: string;
  image_name: string;
  image_tag: string;
  status: string;
  progress: number;
  message: string;
  updated_at: string;
}

export interface ActivePullJob {
  job_id: string;
  image_name: string;
  image_tag: string;
  status: string;
  progress: number;
  message: string;
  updated_at: string;
}

export const getFailedPullJobs = async (limit: number = 10): Promise<FailedPullJob[]> => {
  try {
    const response = await fetchWithAuth(`${API_BASE_URL}/images/pull-failed?limit=${limit}`, {
      method: 'GET',
    });
    const data = extractData<FailedPullJob[]>(response);
    return Array.isArray(data) ? data : [];
  } catch (err) {
    return [];
  }
};

export const getActivePullJobs = async (): Promise<ActivePullJob[]> => {
  try {
    const response = await fetchWithAuth(`${API_BASE_URL}/images/pull-active`, { method: 'GET' });
    const data = extractData<ActivePullJob[]>(response);
    return Array.isArray(data) ? data : [];
  } catch (err) {
    return [];
  }
};

import { JOB_SUBMIT_URL } from '@/core/config/url';
import { fetchWithAuth } from '@/shared/utils/api';

type ApiResponse<T> = { code?: number; message?: string; data?: T } | T;

const extractData = <T>(response: ApiResponse<T>): T => {
  if (response && typeof response === 'object' && 'data' in response) {
    return (response as { data?: T }).data as T;
  }
  return response as T;
};

export interface SubmitJobRequest {
  project_id: string;
  config_file_id: string;
  submit_type?: 'job' | 'workflow';
  queue_name?: string;
  priority?: number;
}

export interface SubmitJobResponse {
  job_id: string;
}

export const submitJob = async (data: SubmitJobRequest): Promise<SubmitJobResponse> => {
  const response = await fetchWithAuth(JOB_SUBMIT_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return extractData<SubmitJobResponse>(response as ApiResponse<SubmitJobResponse>);
};

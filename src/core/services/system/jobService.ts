import { JOBS_URL, JOB_BY_ID_URL, JOB_SUBMIT_URL } from '@/core/config/url';
import { fetchWithAuth } from '@/shared/utils/api';

type ApiResponse<T> = { code?: number; message?: string; data?: T };

const extractData = <T>(response: unknown): T => {
  const maybe = response as ApiResponse<T> | T;
  if (maybe && typeof maybe === 'object' && 'data' in maybe) {
    return (maybe as ApiResponse<T>).data as T;
  }
  return maybe as T;
};

export interface Job {
  ID: string;
  UserID: string;
  ConfigFileID: string;
  ProjectID: string;
  Namespace: string;
  Status: string;
  QueueName: string;
  Priority: number;
  ErrorMessage: string;
  SubmittedAt: string;
  StartedAt: string | null;
  CompletedAt: string | null;
}

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

export const getJobs = async (): Promise<Job[]> => {
  try {
    const response = await fetchWithAuth(JOBS_URL);
    const data = extractData<Job[]>(response);
    return Array.isArray(data) ? data : [];
  } catch (error: unknown) {
    throw new Error(error instanceof Error ? error.message : 'Failed to fetch jobs.');
  }
};

export const getJob = async (id: string): Promise<Job> => {
  try {
    const response = await fetchWithAuth(JOB_BY_ID_URL(id));
    return extractData<Job>(response);
  } catch (error: unknown) {
    throw new Error(error instanceof Error ? error.message : 'Failed to fetch job.');
  }
};

export const submitJob = async (payload: SubmitJobRequest): Promise<SubmitJobResponse> => {
  try {
    const response = await fetchWithAuth(JOB_SUBMIT_URL, {
      method: 'POST',
      body: JSON.stringify(payload),
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return extractData<SubmitJobResponse>(response);
  } catch (error: unknown) {
    throw new Error(error instanceof Error ? error.message : 'Failed to submit job.');
  }
};

// Job logs are fetched via Pod logs websocket; REST logs endpoint is not available.

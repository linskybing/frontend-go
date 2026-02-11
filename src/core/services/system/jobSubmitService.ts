import { JOBS_URL } from '@/core/config/url';
import { fetchWithAuth } from '@/shared/utils/api';

export interface SubmitJobRequest {
  name: string;
  image: string;
  namespace: string;
  priority?: string;
  job_type?: string;
  command?: string[];
  args?: string[];
  gpu_count?: number;
  gpu_type?: string;
  cpu_request?: string;
  memory_request?: string;
  working_dir?: string;
  env_vars?: Record<string, string>;
}

export const submitJob = async (data: SubmitJobRequest): Promise<void> => {
  await fetchWithAuth(JOBS_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
};

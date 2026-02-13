import { WORKFLOWS_URL, WORKFLOW_BY_NAME_URL } from '@/core/config/url';
import { fetchWithAuth } from '@/shared/utils/api';

type ApiResponse<T> = { code?: number; message?: string; data?: T } | T;

const extractData = <T>(response: ApiResponse<T>): T => {
  if (response && typeof response === 'object' && 'data' in response) {
    return (response as { data?: T }).data as T;
  }
  return response as T;
};

export interface WorkflowNode {
  id?: string;
  name?: string;
  displayName?: string;
  type?: string;
  phase?: string;
  message?: string;
  startedAt?: string;
  finishedAt?: string;
  children?: string[];
  outboundNodes?: string[];
}

export interface Workflow {
  metadata: {
    name: string;
    namespace?: string;
    creationTimestamp?: string;
    labels?: Record<string, string>;
  };
  spec?: {
    entrypoint?: string;
    templates?: Array<{
      name: string;
      dag?: {
        tasks?: Array<{
          name: string;
          template?: string;
          dependencies?: string[];
        }>;
      };
    }>;
  };
  status?: {
    phase?: string;
    startedAt?: string;
    finishedAt?: string;
    nodes?: Record<string, WorkflowNode>;
  };
}

export const listWorkflows = async (params?: Record<string, string>): Promise<Workflow[]> => {
  const query = params ? `?${new URLSearchParams(params).toString()}` : '';
  const response = await fetchWithAuth(`${WORKFLOWS_URL}${query}`);
  const data = extractData<Workflow[]>(response);
  return Array.isArray(data) ? data : [];
};

export const getWorkflow = async (name: string): Promise<Workflow> => {
  const response = await fetchWithAuth(WORKFLOW_BY_NAME_URL(name));
  return extractData<Workflow>(response);
};

export const createWorkflow = async (payload: unknown): Promise<Workflow> => {
  const response = await fetchWithAuth(WORKFLOWS_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  return extractData<Workflow>(response);
};

export const suspendWorkflow = async (name: string): Promise<void> => {
  await fetchWithAuth(`${WORKFLOW_BY_NAME_URL(name)}/suspend`, { method: 'POST' });
};

export const resumeWorkflow = async (name: string): Promise<void> => {
  await fetchWithAuth(`${WORKFLOW_BY_NAME_URL(name)}/resume`, { method: 'POST' });
};

export const terminateWorkflow = async (name: string): Promise<void> => {
  await fetchWithAuth(`${WORKFLOW_BY_NAME_URL(name)}/terminate`, { method: 'POST' });
};

export const deleteWorkflow = async (name: string): Promise<void> => {
  await fetchWithAuth(WORKFLOW_BY_NAME_URL(name), { method: 'DELETE' });
};

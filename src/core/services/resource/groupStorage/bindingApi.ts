/**
 * PVC Binding API - Mount group storage in project namespaces
 */

import { API_BASE_URL } from '@/core/config/url';
import { fetchWithAuth } from '@/shared/utils/api';
import {
  CreateProjectPVCBindingRequest,
  ProjectPVCBindingInfo,
} from '@/core/interfaces/groupStorage';

type ApiResponse<T> = { data?: T } | T;

const extractData = <T>(response: ApiResponse<T>): T => {
  if (response && typeof response === 'object' && 'data' in response) {
    return (response as { data?: T }).data as T;
  }
  return response as T;
};

const K8S_BASE_URL = `${API_BASE_URL}/k8s`;

/**
 * Create PVC binding to mount group storage in project namespace
 * POST /k8s/pvc-binding
 */
export const createPVCBinding = async (
  request: CreateProjectPVCBindingRequest,
): Promise<ProjectPVCBindingInfo> => {
  try {
    const response = await fetchWithAuth(`${K8S_BASE_URL}/pvc-binding`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        project_id: request.projectId,
        group_pvc_id: request.groupPvcId,
        pvc_name: request.pvcName,
        read_only: request.readOnly || false,
      }),
    });
    return extractData<ProjectPVCBindingInfo>(response);
  } catch (error: unknown) {
    throw new Error(error instanceof Error ? error.message : 'Failed to create PVC binding.');
  }
};

/**
 * List PVC bindings for a project
 * GET /k8s/pvc-binding/project/{projectId}
 */
export const listProjectPVCBindings = async (
  projectId: string,
): Promise<ProjectPVCBindingInfo[]> => {
  try {
    const response = await fetchWithAuth(`${K8S_BASE_URL}/pvc-binding/project/${projectId}`, {
      method: 'GET',
    });
    return extractData<ProjectPVCBindingInfo[]>(response);
  } catch (error: unknown) {
    throw new Error(error instanceof Error ? error.message : 'Failed to list PVC bindings.');
  }
};

/**
 * Delete PVC binding
 * DELETE /k8s/pvc-binding/{bindingId}
 */
export const deletePVCBinding = async (bindingId: string): Promise<void> => {
  try {
    await fetchWithAuth(`${K8S_BASE_URL}/pvc-binding/${bindingId}`, {
      method: 'DELETE',
    });
  } catch (error: unknown) {
    throw new Error(error instanceof Error ? error.message : 'Failed to delete PVC binding.');
  }
};

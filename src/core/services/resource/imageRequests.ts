import { API_BASE_URL } from '@/core/config/url';
import { fetchWithAuth } from '@/shared/utils/api';

type ApiResponse<T> = { data?: T } | T;

const extractData = <T>(response: ApiResponse<T>): T => {
  if (response && typeof response === 'object' && 'data' in response) {
    return (response as { data?: T }).data as T;
  }
  return response as T;
};

export interface ImageRequest {
  ID: string;
  UserID: string;
  Name: string;
  Tag: string;
  ProjectID: string | null;
  Status: string;
  Note: string;
  CreatedAt: string;
}

interface BackendImageRequest {
  ID?: number;
  id?: number;
  UserID?: number;
  user_id?: number;
  Name?: string;
  name?: string;
  ImageName?: string;
  image_name?: string;
  Tag?: string;
  tag?: string;
  ProjectID?: number;
  project_id?: number;
  Status?: string;
  status?: string;
  Note?: string;
  note?: string;
  CreatedAt?: string;
  created_at?: string;
}

const parseResponse = (response: unknown): BackendImageRequest[] => {
  const data = extractData<unknown>(response);
  if (Array.isArray(data)) return data as BackendImageRequest[];
  return [];
};

const mapToImageRequest = (r: BackendImageRequest, defaultProjectId?: number): ImageRequest => ({
  ID: String(r.ID ?? r.id ?? ''),
  UserID: String(r.UserID ?? r.user_id ?? ''),
  Name: r.Name || r.name || r.ImageName || r.image_name || '',
  Tag: r.Tag || r.tag || 'latest',
  ProjectID:
    (r.ProjectID ?? r.project_id ?? defaultProjectId ?? null)
      ? String(r.ProjectID ?? r.project_id ?? defaultProjectId)
      : null,
  Status: r.Status || r.status || 'pending',
  Note: r.Note || r.note || '',
  CreatedAt: r.CreatedAt || r.created_at || new Date().toISOString(),
});

export interface CreateImageRequestInput {
  name: string;
  tag?: string;
  project_id?: number;
}

export const requestImage = async (input: CreateImageRequestInput) => {
  try {
    const response = await fetchWithAuth(`${API_BASE_URL}/image-requests`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input),
    });
    return extractData<ImageRequest>(response);
  } catch (err: unknown) {
    throw new Error(err instanceof Error ? err.message : 'Failed to request image.');
  }
};

export const getImageRequests = async (status?: string): Promise<ImageRequest[]> => {
  const params = new URLSearchParams();
  if (status) params.append('status', status);
  try {
    const response = await fetchWithAuth(`${API_BASE_URL}/image-requests?${params.toString()}`, {
      method: 'GET',
    });
    const rawData = parseResponse(response);
    return rawData.map((r) => mapToImageRequest(r));
  } catch (err) {
    return [];
  }
};

export const getProjectImageRequests = async (
  projectId: string,
  status?: string,
): Promise<ImageRequest[]> => {
  const params = new URLSearchParams();
  if (status) params.append('status', status);
  try {
    const response = await fetchWithAuth(
      `${API_BASE_URL}/projects/${projectId}/image-requests?${params.toString()}`,
      { method: 'GET' },
    );
    const rawData = parseResponse(response);
    return rawData.map((r) => mapToImageRequest(r, Number(projectId)));
  } catch (err) {
    return [];
  }
};

export const approveImageRequest = async (id: string, note: string, isGlobal: boolean = false) => {
  try {
    await fetchWithAuth(`${API_BASE_URL}/image-requests/${id}/approve`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ note, is_global: isGlobal }),
    });
  } catch (err: unknown) {
    throw new Error(err instanceof Error ? err.message : 'Failed to approve image request.');
  }
};

export const rejectImageRequest = async (id: string, note: string) => {
  try {
    await fetchWithAuth(`${API_BASE_URL}/image-requests/${id}/reject`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ note }),
    });
  } catch (err: unknown) {
    throw new Error(err instanceof Error ? err.message : 'Failed to reject image request.');
  }
};

import { API_BASE_URL } from '@/core/config/url';
import { fetchWithAuth } from '@/shared/utils/api';

type ApiResponse<T> = { data?: T } | T;

const extractData = <T>(response: ApiResponse<T>): T => {
  if (response && typeof response === 'object' && 'data' in response) {
    return (response as { data?: T }).data as T;
  }
  return response as T;
};

export interface AllowedImage {
  id: string;
  Name: string;
  Tag: string;
  ProjectID?: number;
  IsGlobal: boolean;
  CreatedAt: string;
  IsPulled: boolean;
  Status?: 'pending' | 'approved' | 'rejected' | string;
}

export interface AddProjectImageInput {
  name: string;
  tag: string;
}

export const getAllowedImages = async (projectId?: number): Promise<AllowedImage[]> => {
  try {
    const url = projectId
      ? `${API_BASE_URL}/images/allowed?project_id=${projectId}`
      : `${API_BASE_URL}/images/allowed`;
    const response = await fetchWithAuth(url, {
      method: 'GET',
    });

    const rawData = extractData<unknown>(response) as any[];
    if (!Array.isArray(rawData)) return [];

    // Normalize fields similar to previous implementation
    return rawData.map((img: any) => {
      const fullField = img.FullName || img.full_name || '';
      const imageNameField = img.ImageName || img.image_name || img.Name || img.name || '';
      const explicitTag = img.Tag || img.tag || '';

      const stripRegistry = (s: string) => {
        const parts = s.split('/');
        if (parts.length > 1) {
          const first = parts[0];
          if (first.includes('.') || first.includes(':') || first === 'localhost') {
            return parts.slice(1).join('/');
          }
        }
        return s;
      };

      let normalizedName = fullField ? stripRegistry(fullField) : imageNameField;
      let normalizedTag = explicitTag || '';

      if (!normalizedTag && normalizedName.includes(':')) {
        const lastColon = normalizedName.lastIndexOf(':');
        const afterColon = normalizedName.slice(lastColon + 1);
        if (!afterColon.includes('/')) {
          normalizedTag = afterColon;
          normalizedName = normalizedName.slice(0, lastColon);
        }
      }

      return {
        ID: img.ID || img.id || 0,
        Name: normalizedName,
        Tag: normalizedTag || 'latest',
        ProjectID: img.ProjectID || img.project_id,
        IsGlobal: img.IsGlobal ?? img.is_global ?? false,
        CreatedAt: img.CreatedAt || img.created_at || '',
        IsPulled: img.IsPulled ?? img.is_pulled ?? false,
      } as AllowedImage;
    });
  } catch (err) {
    return [];
  }
};

export const addProjectImage = async (
  projectid: string,
  input: AddProjectImageInput,
): Promise<AllowedImage> => {
  try {
    const response = await fetchWithAuth(`${API_BASE_URL}/projects/${projectId}/images`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input),
    });
    return extractData<AllowedImage>(response);
  } catch (err: unknown) {
    throw new Error(err instanceof Error ? err.message : 'Failed to add project image.');
  }
};

export const removeProjectImage = async (projectId: string, imageId: string): Promise<void> => {
  try {
    await fetchWithAuth(`${API_BASE_URL}/projects/${projectId}/images/${imageId}`, {
      method: 'DELETE',
    });
  } catch (err: unknown) {
    throw new Error(err instanceof Error ? err.message : 'Failed to remove project image.');
  }
};

export const deleteAllowedImage = async (id: string): Promise<void> => {
  try {
    await fetchWithAuth(`${API_BASE_URL}/images/allowed/${id}`, { method: 'DELETE' });
  } catch (err: unknown) {
    throw new Error(err instanceof Error ? err.message : 'Failed to delete image.');
  }
};

export const pullImage = async (name: string, tag: string): Promise<void> => {
  try {
    await fetchWithAuth(`${API_BASE_URL}/images/pull`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, tag }),
    });
  } catch (err: unknown) {
    throw new Error(err instanceof Error ? err.message : 'Failed to pull image.');
  }
};

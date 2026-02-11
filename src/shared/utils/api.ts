import { ApiError } from '@/core/interfaces/error';
export { ApiError } from '@/core/interfaces/error';
import cfg from '@/core/config/config';

export const fetchWithAuth = async (url: string, options: RequestInit = {}) => {
  // Normalize headers to a plain object so we can safely merge defaults
  const providedHeaders = (options.headers as Record<string, string>) || {};
  const headers: Record<string, string> = {
    ...providedHeaders,
  };

  // Prefer explicit API key from centralized config; fall back to localStorage
  const apiKey = (cfg && cfg.API_KEY) || localStorage.getItem('apiKey') || '';

  // If an API key is provided, prefer X-API-Key header (service-to-service)
  if (apiKey) {
    headers['X-API-Key'] = apiKey;
  } else {
    // Otherwise, include Bearer token if present and Authorization not already provided
    const token = localStorage.getItem('token') || localStorage.getItem('accessToken');
    if (token && !headers['Authorization'] && !headers['authorization']) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }

  let response: Response;

  try {
    response = await fetch(url, {
      ...options,
      headers,
      credentials: 'include',
    });
  } catch (networkError: any) {
    console.error('Fetch Network Error:', networkError);

    throw new ApiError(0, 'Network Error: Failed to connect to server (Possible CORS or Offline)', {
      originalError: networkError.message,
    });
  }
  if (response.status === 401) {
    // Don't perform a navigation here; let the Auth layer decide how to handle 401
    // (e.g. single redirect to /signin). Keep throwing so callers can react.
    throw new ApiError(401, 'Session expired. Please log in again.');
  }

  if (!response.ok) {
    let errorData: any;
    let errorMessage = '';

    try {
      const responseText = await response.text();
      try {
        errorData = JSON.parse(responseText);
        errorMessage = errorData.error || errorData.message || errorData.detail;
      } catch (_error: unknown) {
        errorMessage = responseText;
        errorData = { raw: responseText };
      }
    } catch (_error: unknown) {
      errorMessage = `Request failed with status ${response.status}`;
    }

    if (!errorMessage) {
      errorMessage = `HTTP Error ${response.status}: ${response.statusText}`;
    }

    throw new ApiError(response.status, errorMessage, errorData);
  }

  if (response.status === 204) {
    // Return a minimal object instead of null so callers can safely inspect status
    return { status: response.status };
  }

  return response.json();
};

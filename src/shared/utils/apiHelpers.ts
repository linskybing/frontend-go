// Consolidate common API response/error handling patterns
import type { ApiErrorResponse } from '@/core/interfaces/error';

export interface ApiResponse<T = unknown> {
  message?: string;
  error?: string;
  data?: T;
  status?: 'success' | 'error' | number;
}

export const handleApiError = (error: unknown): ApiErrorResponse => {
  if (error instanceof Error) {
    return { message: error.message };
  }
  if (typeof error === 'string') {
    return { message: error };
  }
  return { message: 'Unknown error occurred' };
};

export const isSuccessResponse = (response: ApiResponse): boolean => {
  return !response.error && !!response.message && response.status !== 'error';
};

export const getErrorMessage = (response: ApiResponse | Error | string): string => {
  if (typeof response === 'string') return response;
  if (response instanceof Error) return response.message;
  return response.error || response.message || 'An error occurred';
};

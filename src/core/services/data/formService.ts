import { API_BASE_URL } from '@/core/config/url';
import {
  Form,
  CreateFormRequest,
  FormMessage,
  CreateFormMessageRequest,
} from '@/core/interfaces/form';
import { fetchWithAuth } from '@/shared/utils/api';

type ApiResponse<T> = { data?: T } | T;

const extractData = <T>(response: ApiResponse<T>): T => {
  if (response && typeof response === 'object' && 'data' in response) {
    return (response as { data?: T }).data as T;
  }
  return response as T;
};

export const createForm = async (data: CreateFormRequest): Promise<Form> => {
  try {
    const response = await fetchWithAuth(`${API_BASE_URL}/forms`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return extractData<Form>(response);
  } catch (error: unknown) {
    throw new Error(error instanceof Error ? error.message : 'Failed to create form.');
  }
};

export const getMyForms = async (): Promise<Form[]> => {
  try {
    const response = await fetchWithAuth(`${API_BASE_URL}/forms/my`, {
      method: 'GET',
    });
    return extractData<Form[]>(response);
  } catch (error: unknown) {
    throw new Error(error instanceof Error ? error.message : 'Failed to fetch forms.');
  }
};

export const getAllForms = async (): Promise<Form[]> => {
  try {
    const response = await fetchWithAuth(`${API_BASE_URL}/forms`, {
      method: 'GET',
    });
    return extractData<Form[]>(response);
  } catch (error: unknown) {
    throw new Error(error instanceof Error ? error.message : 'Failed to fetch forms.');
  }
};

export const updateFormStatus = async (id: string, status: string): Promise<Form> => {
  try {
    const response = await fetchWithAuth(`${API_BASE_URL}/forms/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    return extractData<Form>(response);
  } catch (error: unknown) {
    throw new Error(error instanceof Error ? error.message : 'Failed to update form status.');
  }
};

export const createFormMessage = async (
  formId: string,
  data: CreateFormMessageRequest,
): Promise<FormMessage> => {
  try {
    const response = await fetchWithAuth(`${API_BASE_URL}/forms/${formId}/messages`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return extractData<FormMessage>(response);
  } catch (error: unknown) {
    throw new Error(error instanceof Error ? error.message : 'Failed to create message.');
  }
};

export const getFormMessages = async (formId: string): Promise<FormMessage[]> => {
  try {
    const response = await fetchWithAuth(`${API_BASE_URL}/forms/${formId}/messages`, {
      method: 'GET',
    });
    return extractData<FormMessage[]>(response);
  } catch (error: unknown) {
    throw new Error(error instanceof Error ? error.message : 'Failed to fetch messages.');
  }
};

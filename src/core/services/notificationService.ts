import { MessageResponse } from '@/core/response/response';
import { fetchWithAuth } from '@/shared/utils/api';

const NOTIFICATION_API_BASE_URL = '/api/notifications'; // Placeholder API base URL

const extractData = <T>(response: MessageResponse | T): T => {
  if (response && typeof response === 'object' && 'data' in response) {
    return (response as { data?: T }).data as T;
  }
  return response as T;
};

export const markNotificationAsRead = async (id: string): Promise<MessageResponse> => {
  try {
    const response = await fetchWithAuth(`${NOTIFICATION_API_BASE_URL}/${id}/read`, {
      method: 'PUT',
    });
    return extractData<MessageResponse>(response);
  } catch (error: unknown) {
    throw new Error(
      error instanceof Error ? error.message : 'Failed to mark notification as read.',
    );
  }
};

export const markAllNotificationsAsRead = async (): Promise<MessageResponse> => {
  try {
    const response = await fetchWithAuth(`${NOTIFICATION_API_BASE_URL}/read-all`, {
      method: 'PUT',
    });
    return extractData<MessageResponse>(response);
  } catch (error: unknown) {
    throw new Error(
      error instanceof Error ? error.message : 'Failed to mark all notifications as read.',
    );
  }
};

export const clearAllNotifications = async (): Promise<MessageResponse> => {
  try {
    const response = await fetchWithAuth(`${NOTIFICATION_API_BASE_URL}/clear-all`, {
      method: 'DELETE',
    });
    return extractData<MessageResponse>(response);
  } catch (error: unknown) {
    throw new Error(error instanceof Error ? error.message : 'Failed to clear all notifications.');
  }
};

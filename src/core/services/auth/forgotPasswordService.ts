import { FORGOT_PASSWORD_URL } from '@/core/config/url';
import { ErrorResponse, MessageResponse } from '@/core/response/response';
import { fetchWithAuth } from '@/shared/utils/api';

export const forgotPassword = async (
  username: string,
  newPassword: string,
): Promise<MessageResponse> => {
  const formData = new URLSearchParams();
  formData.append('username', username);
  formData.append('new_password', newPassword);

  try {
    const response = await fetchWithAuth(FORGOT_PASSWORD_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData.toString(),
      credentials: 'include',
    });

    if (!response.ok) {
      const errorData: ErrorResponse = await response.json();
      throw new Error(errorData.error || `Password reset failed with status ${response.status}`);
    }

    const data: MessageResponse = await response.json();
    return data;
  } catch (error: unknown) {
    throw new Error(
      error instanceof Error ? error.message : 'Password reset failed, please try again.',
    );
  }
};

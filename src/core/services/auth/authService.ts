import { LOGIN_URL, REGISTER_URL, LOGOUT_URL } from '@/core/config/url';
import { MessageResponse, LoginResponse } from '@/core/response/response';
import { RegisterInput } from '@/core/interfaces/auth';
import { fetchWithAuth } from '@/shared/utils/api';

const appendIfPresent = (formData: URLSearchParams, key: string, value: string | undefined) => {
  if (value !== undefined && value !== null && value !== '') {
    formData.append(key, value);
  }
};

export const login = async (username: string, password: string): Promise<LoginResponse> => {
  const formData = new URLSearchParams();
  formData.append('username', username);
  formData.append('password', password);
  // console.log('in logging');
  try {
    // `fetchWithAuth` returns parsed JSON for successful responses and
    // throws an `ApiError` for HTTP errors, so we can treat the result as data.
    const data: LoginResponse = await fetchWithAuth(LOGIN_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData.toString(),
      credentials: 'include',
    });

    localStorage.setItem('username', data.username);
    return data;
  } catch (error: unknown) {
    throw new Error(error instanceof Error ? error.message : 'Login failed, please try again.');
  }
};

export const logout = async (): Promise<void> => {
  try {
    await fetchWithAuth(LOGOUT_URL, {
      method: 'POST',
      credentials: 'include',
    });

    localStorage.clear();
    sessionStorage.clear();

    document.cookie.split(';').forEach((cookie) => {
      const eqPos = cookie.indexOf('=');
      const name = eqPos > -1 ? cookie.substring(0, eqPos).trim() : cookie.trim();
      document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/';
      document.cookie =
        name + '=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=' + window.location.hostname;
    });

    // console.log('Logged out successfully');
  } catch (error: unknown) {
    throw new Error(error instanceof Error ? error.message : 'Logout failed, please try again.');
  }
};

export const register = async (input: RegisterInput): Promise<MessageResponse> => {
  const formData = new URLSearchParams();
  formData.append('username', input.username);
  formData.append('password', input.password);
  appendIfPresent(formData, 'email', input.email);
  appendIfPresent(formData, 'full_name', input.full_name);
  appendIfPresent(formData, 'type', input.type);
  appendIfPresent(formData, 'status', input.status);

  try {
    const data: MessageResponse = await fetchWithAuth(REGISTER_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData.toString(),
      credentials: 'include',
    });
    return data;
  } catch (error: unknown) {
    throw new Error(
      error instanceof Error ? error.message : 'Registration failed, please try again.',
    );
  }
};

export const getUsername = (): string => {
  return localStorage.getItem('username') || '';
};

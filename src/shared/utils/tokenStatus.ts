// Utility to check token status and auto-logout if expired
import { API_BASE_URL } from '@/core/config/url';
import { fetchWithAuth } from '@/shared/utils/api';

export async function checkTokenStatus() {
  try {
    const token = localStorage.getItem('token') || localStorage.getItem('accessToken');
    const url = `${API_BASE_URL}/auth/status`;
    const options: RequestInit = token
      ? { headers: { Authorization: `Bearer ${token}` } }
      : { credentials: 'include' };

    const res = await fetchWithAuth(url, options as RequestInit);
    if (res.status === 401) {
      localStorage.removeItem('userData');
      localStorage.removeItem('username');
      window.location.href = '/signin';
      return false;
    }
    // If backend returns JSON with status, respect it; otherwise treat 200 as valid.
    if (res.status === 200) {
      try {
        const data = await res.json();
        if (data && data.status && data.status !== 'valid') {
          localStorage.removeItem('userData');
          localStorage.removeItem('username');
          window.location.href = '/signin';
          return false;
        }
      } catch (_error: unknown) {
        // ignore JSON parse errors, treat 200 as valid
      }
      return true;
    }

    localStorage.removeItem('userData');
    localStorage.removeItem('username');
    window.location.href = '/signin';
    return false;
  } catch (_error: unknown) {
    localStorage.removeItem('userData');
    localStorage.removeItem('username');
    window.location.href = '/signin';
    return false;
  }
}

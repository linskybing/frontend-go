import React, { useEffect, useState, useCallback } from 'react';
import { API_BASE_URL, LOGOUT_URL } from '../config/url';
import { fetchWithAuth } from '@/shared/utils/api';
import { AuthContext } from './auth-context';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [viewMode, setViewMode] = useState<'user' | 'admin'>(() => {
    const stored = localStorage.getItem('viewMode');
    return stored === 'admin' ? 'admin' : 'user';
  });
  const initRef = React.useRef(false);

  const switchViewMode = useCallback((mode: 'user' | 'admin', persist: boolean = true) => {
    setViewMode(mode);
    if (persist) {
      localStorage.setItem('viewMode', mode);
    } else {
      localStorage.removeItem('viewMode');
    }
  }, []);

  useEffect(() => {
    // Admin role check from localStorage
    const userData = localStorage.getItem('userData');
    if (userData) {
      try {
        const parsedData = JSON.parse(userData);
        const roleValue = (
          parsedData.role ||
          parsedData.Role ||
          (Array.isArray(parsedData.roles) ? parsedData.roles[0] : '')
        )
          .toString()
          .toLowerCase();
        const isSuperAdmin = parsedData.is_super_admin === true;
        const isAdminLike = isSuperAdmin || roleValue === 'admin' || roleValue === 'manager';
        setIsAdmin(isAdminLike);
      } catch (e) {
        console.error('Failed to parse userData from localStorage', e);
        setIsAdmin(false);
      }
    }

    // At app root: check auth with backend.
    // If token exists in localStorage, validate it via Authorization header.
    // If no token, call backend with credentials included to allow cookie/session-based auth.
    if (initRef.current) {
      // Prevent double invocation in React Strict Mode during development
      setLoading(false);
      return;
    }
    // If user is on a public auth route and there is no token, skip server status check.
    // This prevents the signin/signup pages from triggering backend checks which
    // can cause redirect/refresh loops when the backend is down or returns 401.
    const publicAuthPaths = ['/signin', '/signup', '/forgot-password'];
    const currentPath = typeof window !== 'undefined' ? window.location.pathname : '';
    initRef.current = true;

    const token = localStorage.getItem('token') || localStorage.getItem('accessToken');
    if (!token && publicAuthPaths.includes(currentPath)) {
      setIsAuthenticated(false);
      setLoading(false);
      initRef.current = true;
      return;
    }
    const url = `${API_BASE_URL}/auth/status`;

    const options: RequestInit = token
      ? { headers: { Authorization: `Bearer ${token}` } }
      : { credentials: 'include' };

    // `fetchWithAuth` returns parsed JSON for successful responses (not a Response object).
    // If it resolves, treat the user as authenticated; if it throws, clear auth state.
    fetchWithAuth(url, options)
      .then((_data: any) => {
        setIsAuthenticated(true);
      })
      .catch((err: unknown) => {
        // Network errors (backend down) will throw here. Only clear local auth state;
        // don't attempt server logout when the backend is unreachable to avoid repeated failures.
        setIsAuthenticated(false);
        localStorage.removeItem('userData');
        localStorage.removeItem('username');
        if (err && typeof err === 'object' && 'status' in err && (err as any).status === 401) {
          // If server explicitly returned unauthorized, try clearing server session.
          fetchWithAuth(LOGOUT_URL, { method: 'POST', credentials: 'include' }).catch(() => {});
        }
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, setIsAuthenticated, loading, isAdmin, viewMode, switchViewMode }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Note: `useAuth` is exported from `src/core/context/useAuth.ts` to keep this file
// exporting only React components for fast-refresh compatibility.

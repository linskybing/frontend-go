import { createContext } from 'react';

export interface AuthContextType {
  isAuthenticated: boolean;
  setIsAuthenticated: (v: boolean) => void;
  loading: boolean;
  isAdmin: boolean;
  viewMode: 'user' | 'admin';
  switchViewMode: (mode: 'user' | 'admin', persist?: boolean) => void;
}

export const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  setIsAuthenticated: () => {},
  loading: true,
  isAdmin: false,
  viewMode: 'user',
  switchViewMode: () => {},
});

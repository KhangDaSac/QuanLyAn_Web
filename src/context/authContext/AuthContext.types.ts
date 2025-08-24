import { createContext } from 'react';

export interface User {
  id: string;
  username: string;
  email?: string;
  scope?: string;
}

export interface LoginResponse {
  success: boolean;
  status: number;
  message: string;
  data: {
    authenticated: boolean;
    token: string;
  };
  timestamp: string;
}

export interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

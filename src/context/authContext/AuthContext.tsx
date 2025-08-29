import { useState, useEffect, type ReactNode } from 'react';
import { AuthService } from '../../services/AuthService';
import { createContext } from 'react';
import type { ApiResponse } from '../../types/ApiResponse';
import type { AuthenticationResponse } from '../../types/response/auth/AuthenticationResponse';

interface User {
  id: string;
  username: string;
  email?: string;
  scope?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<ApiResponse<AuthenticationResponse>>;
  logout: () => void;
}


interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user and token are stored in localStorage on app start
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    if (storedToken && storedUser) {
      try {
        const userData = JSON.parse(storedUser);

        // Check if token is still valid
        const decodedToken = AuthService.decodeJWT(storedToken);
        const currentTime = Date.now() / 1000;

        if (decodedToken && decodedToken.exp && decodedToken.exp > currentTime) {
          setToken(storedToken);
          setUser(userData);
        } else {
          // Token expired, clear storage
          localStorage.removeItem('token');
          localStorage.removeItem('user');
        }
      } catch (error) {
        console.error('Error parsing stored user data:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (identifier: string, password: string): Promise<ApiResponse<AuthenticationResponse>> => {


    try {
      setIsLoading(true);
      const response = await AuthService.login({ identifier, password });
      if (response.success && response.data.authenticated && response.data.token) {
        const jwtToken = response.data.token;
        const decodedToken = AuthService.decodeJWT(jwtToken);

        if (decodedToken) {
          const newUser: User = {
            id: decodedToken.sub || decodedToken.jti || 'unknown',
            username: decodedToken.username || identifier,
            scope: decodedToken.scope,
            email: `${decodedToken.username || identifier}@company.com`
          };

          setUser(newUser);
          setToken(jwtToken);
          localStorage.setItem('user', JSON.stringify(newUser));
          localStorage.setItem('token', jwtToken);
        }
      }
      return response;
    } catch (error) {
      throw new Error("Lỗi khi đăng nhập");
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await AuthService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      setToken(null);
      localStorage.removeItem('user');
      localStorage.removeItem('token');
    }
  };

  const value: AuthContextType = {
    user,
    token,
    isAuthenticated: !!user && !!token,
    isLoading,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

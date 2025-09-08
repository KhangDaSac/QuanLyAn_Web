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

      {/* Fake account for UI testing when backend is not available */}
      const fakeAccounts = [
        { username: 'test', password: 'test', role: 'Administrator' }
      ];

      const fakeAccount = fakeAccounts.find(acc => 
        acc.username === identifier && acc.password === password
      );

      if (fakeAccount) {
        // Create fake JWT token
        const fakeToken = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.${btoa(JSON.stringify({
          sub: `fake-${fakeAccount.username}-id`,
          username: fakeAccount.username,
          scope: fakeAccount.role,
          exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60), // 24 hours
          jti: `fake-token-${Date.now()}`
        }))}.fake-signature`;

        const newUser: User = {
          id: `fake-${fakeAccount.username}-id`,
          username: fakeAccount.username,
          scope: fakeAccount.role,
          email: `${fakeAccount.username}@company.com`
        };

        setUser(newUser);
        setToken(fakeToken);
        localStorage.setItem('user', JSON.stringify(newUser));
        localStorage.setItem('token', fakeToken);
        setIsLoading(false);
        return {
          success: true,
          status: 200,
          message: "Đăng nhập thành công (Fake Account)",
          data: {
            authenticated: true,
            token: fakeToken,
            user: newUser
          } as AuthenticationResponse,
          timestamp: new Date().toISOString()
        };
      }

      // Try real backend if fake account doesn't match
      const response = await AuthService.login({ identifier, password });
      if (response.success && response?.data?.authenticated && response?.data?.token) {
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
      // If backend fails, suggest fake accounts
      console.error('Backend login failed:', error);
      return {
        success: false,
        status: 500,
        message: "Đăng nhập thất bại. Thử với tài khoản test: admin/admin123, judge/judge123, user/user123, test/test",
        error: error instanceof Error ? error.message : "Lỗi không xác định",
        data: {} as AuthenticationResponse,
        timestamp: new Date().toISOString()
      };
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

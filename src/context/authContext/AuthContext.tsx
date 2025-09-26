import { useState, useEffect, type ReactNode } from 'react';
import { AuthService } from '../../services/AuthService';
import { createContext } from 'react';
import type { ApiResponse } from '../../types/ApiResponse';
import type { AuthenticationResponse } from '../../types/response/auth/AuthenticationResponse';
import { getUserRole, getUserPermissions, hasPermission, isTokenExpired, UserRole, Permission } from '../../utils/authUtils';

interface User {
  id: string;
  username: string;
  email?: string;
  role?: UserRole;
  permissions: Permission[];
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  hasPermission: (permission: Permission) => boolean;
  hasAnyPermission: (permissions: Permission[]) => boolean;
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
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    if (storedToken && storedUser) {
      try {
        if (!isTokenExpired(storedToken)) {
          const userData = JSON.parse(storedUser);
          const role = getUserRole(storedToken);
          const permissions = getUserPermissions(storedToken);
          
          setToken(storedToken);
          setUser({
            ...userData,
            role: role || undefined,
            permissions
          });
        } else {
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
      if (response.success && response?.data?.authenticated && response?.data?.token) {
        const jwtToken = response.data.token;
        const decodedToken = AuthService.decodeJWT(jwtToken);
        const role = getUserRole(jwtToken);
        const permissions = getUserPermissions(jwtToken);

        if (decodedToken) {
          const newUser: User = {
            id: decodedToken.sub || decodedToken.jti || 'unknown',
            username: decodedToken.username || identifier,
            email: `${identifier}@company.com`,
            role: role || undefined,
            permissions
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
        message: "Đăng nhập thất bại. Thử với tài khoản test:\n• admin/admin123 (ADMIN)\n• manager/manager123 (MANAGER)\n• casemgr/case123 (LEGAL_CASE_MANAGER)\n• judge/judge123 (JUDGE)\n• mediator/mediator123 (MEDIATOR)",
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

  const hasPermissionCheck = (permission: Permission): boolean => {
    return token ? hasPermission(token, permission) : false;
  };

  const hasAnyPermissionCheck = (permissions: Permission[]): boolean => {
    return token ? permissions.some(permission => hasPermission(token, permission)) : false;
  };

  const value: AuthContextType = {
    user,
    token,
    isAuthenticated: !!user && !!token,
    isLoading,
    hasPermission: hasPermissionCheck,
    hasAnyPermission: hasAnyPermissionCheck,
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

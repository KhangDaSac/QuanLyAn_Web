import type { ApiResponse } from '../types/ApiResponse';
import type { LoginRequest } from '../types/request/auth/LoginRequest';
import { Connect } from '../connect/Connect'; 
import type { AuthenticationResponse } from '../types/response/auth/AuthenticationResponse';

interface JWTPayload {
  sub?: string;
  jti?: string;
  username?: string;
  scope?: string;
  exp?: number;
  iat?: number;
  iss?: string;
}

export class AuthService {
  static async login(loginRequest: LoginRequest): Promise<ApiResponse<AuthenticationResponse>> {
    try {
      return Connect.request(
        '/auth/login',
        'POST',
        loginRequest,
        null
      );
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  static async logout(): Promise<ApiResponse<void>> {
    try {
      const token = localStorage.getItem("token");
      return Connect.request(
        '/auth/logout',
        'POST',
        { token },
        null
      );
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  static decodeJWT(token: string): JWTPayload | null {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map(function (c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
          })
          .join('')
      );
      return JSON.parse(jsonPayload) as JWTPayload;
    } catch (error) {
      console.error('Error decoding JWT:', error);
      return null;
    }
  }
}

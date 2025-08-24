import type { LoginResponse } from '../context/authContext/AuthContext.types';
const server_url = import.meta.env.SERVER_URL || 'https://localhost:8081';

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
  static async login(identifier: string, password: string): Promise<LoginResponse> {
    try {
      const response = await fetch(`${server_url}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          identifier,
          password,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  static async logout(): Promise<void> {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        await fetch(`${server_url}/auth/logout`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
      }
    } catch (error) {
      console.error('Logout error:', error);
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

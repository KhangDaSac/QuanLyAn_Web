import type { ApiResponse } from '../types/ApiResponse';
import type { LoginRequest } from '../types/request/auth/LoginRequest';
import { Connect } from '../connect/Connect';
import type { AuthenticationResponse } from '../types/response/auth/AuthenticationResponse';
import type RefreshTokenRequest from '../types/request/auth/RefreshTokenRequest';
import type IntrospectRequest from '../types/request/auth/IntrospectRequest';
import type ChangePasswordRequest from '../types/request/auth/ChangePasswordRequest';
import type ForgotPasswordRequest from '../types/request/auth/ForgotPasswordRequest';
import type VerifyOtpRequest from '../types/request/auth/VerifyOtpRequest';
import type VerifyOtpResponse from '../types/response/auth/VerifyOtpResponse';
import type ResetPasswordRequest from '../types/request/auth/ResetPasswordRequest';
import type AccountRequest from '../types/request/auth/AccountRequest';

export interface JWTPayload {
  sub: string;               // accountId
  jti: string;               // JWT ID (UUID)
  username: string;          // Tên đăng nhập
  displayName?: string | null; // Tên hiển thị (có thể null nếu không có judge)
  judgeId?: string | null;   // ID của judge (có thể null)
  scope: string;             // Vai trò (ADMIN, MANAGER, JUDGE)
  exp: number;               // Thời gian hết hạn (epoch seconds)
  iat: number;               // Thời gian tạo token (epoch seconds)
  iss: string;               // Issuer (tên hệ thống)
}


export class AuthService {
  static api: string = '/auth';
  static async login(loginRequest: LoginRequest): Promise<ApiResponse<AuthenticationResponse>> {
    return Connect.request(
      `${this.api}/login`,
      'POST',
      loginRequest,
      null
    );
  }

  static async logout(): Promise<ApiResponse<void>> {
    const token = localStorage.getItem("token");
    return Connect.request(
      `${this.api}/logout`,
      'POST',
      { token },
      null
    );
  }

  static async introspect(): Promise<ApiResponse<void>> {
    const token = localStorage.getItem("token");
    return Connect.request(
      `${this.api}/introspect`,
      'POST',
      { token } as IntrospectRequest,
      null
    );
  }

  static async refreshToken(): Promise<ApiResponse<AuthenticationResponse>> {
    const token = localStorage.getItem("token");
    return Connect.request(
      `${this.api}/refresh-token`,
      'POST',
      { token } as RefreshTokenRequest,
      null
    );
  }

  static async changePassword(request: ChangePasswordRequest): Promise<ApiResponse<void>> {
    const token = localStorage.getItem("token");
    return Connect.request(
      `${this.api}/change-password`,
      'POST',
      request,
      token
    );
  }

  static async forgotPassword(request: ForgotPasswordRequest): Promise<ApiResponse<void>> {
    return Connect.request(
      `${this.api}/forgot-password`,
      'POST',
      request,
      null
    );
  }

  static async verifyOtp(request: VerifyOtpRequest): Promise<ApiResponse<VerifyOtpResponse>> {
    return Connect.request(
      `${this.api}/verify-otp`,
      'POST',
      request,
      null
    );
  }

  static async resetPassword(request: ResetPasswordRequest): Promise<ApiResponse<void>> {
    const token = localStorage.getItem("token");
    return Connect.request(
      `${this.api}/reset-password`,
      'POST',
      request,
      token
    );
  }

  static async createAccount(request: AccountRequest): Promise<ApiResponse<void>> {
    const token = localStorage.getItem("token");
    return Connect.request(
      `${this.api}/account`,
      'POST',
      request,
      token
    );
  }

  static async updateAccount(id: string, request: AccountRequest): Promise<ApiResponse<void>> {
    const token = localStorage.getItem("token");
    return Connect.request(
      `${this.api}/account/${id}`,
      'PUT',
      request,
      token
    );
  }

  static async deleteAccount(id: string): Promise<ApiResponse<void>> {
    const token = localStorage.getItem("token");
    return Connect.request(
      `${this.api}/account/${id}`,
      'DELETE',
      null,
      token
    );
  }

  static decodeJWT(token: string): JWTPayload | null {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      
      // Handle fake tokens for UI testing
      if (token.includes('fake-signature')) {
        const payload = JSON.parse(atob(base64));
        return {
          sub: payload.sub,
          jti: payload.jti,
          username: payload.username,
          scope: payload.scope,
          exp: payload.exp,
          iat: payload.iat || Math.floor(Date.now() / 1000),
          iss: payload.iss || 'fake-system'
        } as JWTPayload;
      }
      
      // Handle real JWT tokens
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

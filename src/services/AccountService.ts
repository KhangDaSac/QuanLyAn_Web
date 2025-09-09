import type { ApiResponse } from '../types/ApiResponse';
import { Connect } from '../connect/Connect';
import type { AccountResponse } from '../types/response/auth/AccountResponse';
import type { CreateAccountRequest } from '../types/request/auth/CreateAccountRequest';
import type { UpdateAccountRequest } from '../types/request/auth/UpdateAccountRequest';

export class AccountService {
  static api: string = '/auth';

  static async getAllAccounts(): Promise<ApiResponse<AccountResponse[]>> {
    return Connect.request(
      `${this.api}`,
      'GET',
      null,
      localStorage.getItem("token")
    );
  }

  static async getAccountById(accountId: string): Promise<ApiResponse<AccountResponse>> {
    return Connect.request(
      `${this.api}/${accountId}`,
      'GET',
      null,
      localStorage.getItem("token")
    );
  }

  static async createAccount(createAccountRequest: CreateAccountRequest): Promise<ApiResponse<AccountResponse>> {
    return Connect.request(
      `${this.api}`,
      'POST',
      createAccountRequest,
      localStorage.getItem("token")
    );
  }

  static async updateAccount(updateAccountRequest: UpdateAccountRequest): Promise<ApiResponse<AccountResponse>> {
    return Connect.request(
      `${this.api}/${updateAccountRequest.accountId}`,
      'PUT',
      updateAccountRequest,
      localStorage.getItem("token")
    );
  }

  static async deleteAccount(accountId: string): Promise<ApiResponse<void>> {
    return Connect.request(
      `${this.api}/${accountId}`,
      'DELETE',
      null,
      localStorage.getItem("token")
    );
  }

  static async toggleAccountStatus(accountId: string): Promise<ApiResponse<AccountResponse>> {
    return Connect.request(
      `${this.api}/${accountId}/toggle-status`,
      'PUT',
      null,
      localStorage.getItem("token")
    );
  }
}

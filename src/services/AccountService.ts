import { Connect } from "../connect/Connect";
import type { ApiResponse } from "../types/ApiResponse";
import type { PageResponse } from "../types/response/PageResponse";
import type AccountRequest from "../types/request/auth/AccountRequest";
import type { AccountSearchRequest } from "../types/request/auth/AccountSearchRequest";
import type { AccountResponse } from "../types/response/auth/AccountResponse";
import type { StatusOfAccount } from "../types/enum/StatusOfAccount";

export class AccountService {
  static api: string = "/auth/account";

  static async search(
    request: AccountSearchRequest,
    page: number = 0,
    size: number = 10,
    sort: string = "email"
  ): Promise<ApiResponse<PageResponse<AccountResponse>>> {
    const token = localStorage.getItem("token");
    const params = new URLSearchParams();
    params.append("page", page.toString());
    params.append("size", size.toString());
    params.append("sortBy", sort);

    return Connect.request<PageResponse<AccountResponse>>(
      `${this.api}/search?${params.toString()}`,
      "POST",
      request,
      token
    );
  }

  static async getAllAccounts(): Promise<ApiResponse<AccountResponse[]>> {
    const token = localStorage.getItem("token");
    return Connect.request<AccountResponse[]>(
      `${this.api}/all`,
      "GET",
      null,
      token
    );
  }

  static async getLimit50Accounts(): Promise<ApiResponse<AccountResponse[]>> {
    const token = localStorage.getItem("token");
    return Connect.request<AccountResponse[]>(
      `${this.api}/limit-50`,
      "GET",
      null,
      token
    );
  }

  static async createAccount(
    request: AccountRequest
  ): Promise<ApiResponse<void>> {
    const token = localStorage.getItem("token");
    return Connect.request<void>(`${this.api}`, "POST", request, token);
  }

  static async updateAccount(
    id: string,
    request: AccountRequest
  ): Promise<ApiResponse<void>> {
    const token = localStorage.getItem("token");
    return Connect.request<void>(`${this.api}/${id}`, "PUT", request, token);
  }

  static async toggleAccountStatus(
    id: string,
    statusOfAccount: StatusOfAccount
  ): Promise<ApiResponse<void>> {
    const token = localStorage.getItem("token");
    const request: AccountRequest = {
      username: null,
      password: null,
      email: null,
      role: null,
      statusOfAccount: statusOfAccount,
    };
    return Connect.request<void>(`${this.api}/${id}`, "PUT", request, token);
  }

  static async blockAccount(id: string): Promise<ApiResponse<void>> {
    const token = localStorage.getItem("token");
    return Connect.request<void>(
      `${this.api}/block/${id}`,
      "PATCH",
      null,
      token
    );
  }

  static async activeAccount(id: string): Promise<ApiResponse<void>> {
    const token = localStorage.getItem("token");
    return Connect.request<void>(
      `${this.api}/active/${id}`,
      "PATCH",
      null,
      token
    );
  }

  static async deleteAccount(id: string): Promise<ApiResponse<void>> {
    const token = localStorage.getItem("token");
    return Connect.request<void>(`${this.api}/${id}`, "DELETE", null, token);
  }
}

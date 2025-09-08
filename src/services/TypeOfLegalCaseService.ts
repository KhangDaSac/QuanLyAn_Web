import { type ApiResponse } from "../types/ApiResponse";
import { type TypeOfLegalCaseResponse } from "../types/response/type-of-legal-case/TypeOfLegalCaseResponse";
import { Connect } from "../connect/Connect";
import { type TypeOfLegalCaseRequest } from "../types/request/type-of-legal-case/TypeOfLegalCaseRequest";
import type { TypeOfLegalCaseSearchRequest } from "../types/request/type-of-legal-case/TypeOfLegalCaseSearchRequest";

export class TypeOfLegalCaseService {
  static api: string = '/type-of-legal-case';

  static async top50(): Promise<ApiResponse<TypeOfLegalCaseResponse[]>> {
    const token = localStorage.getItem('token');
    return Connect.request<TypeOfLegalCaseResponse[]>(
      `${this.api}/limit-50`,
      'GET',
      null,
      token
    );
  }

  static async create(request: TypeOfLegalCaseRequest): Promise<ApiResponse<void>> {
    const token = localStorage.getItem('token');
    return Connect.request<void>(
      `${this.api}/`,
      'POST',
      request,
      token
    );
  }

  static async update(id: string, request: TypeOfLegalCaseRequest): Promise<ApiResponse<void>> {
    const token = localStorage.getItem('token');
    return Connect.request<void>(
      `${this.api}/${id}`,
      'PUT',
      request,
      token
    );
  }
  static async delete(id: string): Promise<ApiResponse<void>> {
    const token = localStorage.getItem('token');
    return Connect.request<void>(
      `${this.api}/${id}`,
      'DELETE',
      null,
      token
    );
  }

  static async search(request: TypeOfLegalCaseSearchRequest): Promise<ApiResponse<TypeOfLegalCaseResponse[]>> {
    const token = localStorage.getItem('token');
    return Connect.request<TypeOfLegalCaseResponse[]>(
      `${this.api}/search`,
      'POST',
      request,
      token
    );
  }

  static async getAll(): Promise<ApiResponse<TypeOfLegalCaseResponse[]>> {
    const token = localStorage.getItem('token');
    return Connect.request<TypeOfLegalCaseResponse[]>(
      `${this.api}/all`,
      'GET',
      null,
      token
    );
  }
}
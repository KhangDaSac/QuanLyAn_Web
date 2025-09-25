import { type ApiResponse } from "../types/ApiResponse";
import { type TypeOfLegalCaseResponse } from "../types/response/type-of-legal-case/TypeOfLegalCaseResponse";
import { Connect } from "../connect/Connect";
import { type TypeOfLegalCaseRequest } from "../types/request/type-of-legal-case/TypeOfLegalCaseRequest";
import type { TypeOfLegalCaseSearchRequest } from "../types/request/type-of-legal-case/TypeOfLegalCaseSearchRequest";
import type { PageResponse } from "../types/response/PageResponse";

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

  static async search(
    request: TypeOfLegalCaseSearchRequest,
    page: number = 0,
    size: number = 10,
    sortBy: string = "typeOfLegalCaseName"
  ): Promise<ApiResponse<PageResponse<TypeOfLegalCaseResponse>>> {
    const token = localStorage.getItem('token');
    
    const queryParams = new URLSearchParams({
      page: page.toString(),
      size: size.toString(),
      sortBy: sortBy
    });
    
    const url = `${this.api}/search?${queryParams.toString()}`;
    
    return Connect.request<PageResponse<TypeOfLegalCaseResponse>>(
      url,
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
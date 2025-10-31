import { type ApiResponse } from "../types/ApiResponse";
import { type LegalCaseTypeResponse } from "../types/response/legal-case-type/LegalCaseTypeResponse";
import { Connect } from "../connect/Connect";
import { type LegalCaseTypeRequest } from "../types/request/legal-case-type/LegalCaseTypeRequest";
import type { LegalCaseTypeSearchRequest } from "../types/request/legal-case-type/LegalCaseTypeSearchRequest";
import type { PageResponse } from "../types/response/PageResponse";

export class LegalCaseTypeService {
  static api: string = '/legal-case-type';

  static async top50(): Promise<ApiResponse<LegalCaseTypeResponse[]>> {
    const token = localStorage.getItem('token');
    return Connect.request<LegalCaseTypeResponse[]>(
      `${this.api}/limit-50`,
      'GET',
      null,
      token
    );
  }

  static async create(request: LegalCaseTypeRequest): Promise<ApiResponse<void>> {
    const token = localStorage.getItem('token');
    return Connect.request<void>(
      `${this.api}`,
      'POST',
      request,
      token
    );
  }

  static async update(id: string, request: LegalCaseTypeRequest): Promise<ApiResponse<void>> {
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
    request: LegalCaseTypeSearchRequest,
    page: number = 0,
    size: number = 10,
    sortBy: string = "typeOfLegalCaseName"
  ): Promise<ApiResponse<PageResponse<LegalCaseTypeResponse>>> {
    const token = localStorage.getItem('token');
    
    const queryParams = new URLSearchParams({
      page: page.toString(),
      size: size.toString(),
      sortBy: sortBy
    });
    
    const url = `${this.api}/search?${queryParams.toString()}`;
    
    return Connect.request<PageResponse<LegalCaseTypeResponse>>(
      url,
      'POST',
      request,
      token
    );
  }

  static async getAll(): Promise<ApiResponse<LegalCaseTypeResponse[]>> {
    const token = localStorage.getItem('token');
    return Connect.request<LegalCaseTypeResponse[]>(
      `${this.api}/all`,
      'GET',
      null,
      token
    );
  }
}
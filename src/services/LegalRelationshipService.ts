import { type ApiResponse } from "../types/ApiResponse";
import { Connect } from "../connect/Connect";
import type { LegalRelationshipResponse } from "../types/response/legal-relationship/LegalRelationshipResponse";
import type { LegalRelationshipRequest } from "../types/request/legal-relationship/LegalRelationshipRequest";
import type { LegalRelationshipSearchRequest } from "../types/request/legal-relationship/LegalRelationshipSearchRequest";
import type { PageResponse } from "../types/response/PageResponse";

export class LegalRelationshipService {
  static api: string = '/legal-relationship';
  static async getTop50(): Promise<ApiResponse<LegalRelationshipResponse[]>> {
    const token = localStorage.getItem('token');
    return Connect.request<LegalRelationshipResponse[]>(
      `${this.api}/limit-50`,
      'GET',
      null,
      token
    );
  }

  static async getAll(): Promise<ApiResponse<LegalRelationshipResponse[]>> {
    const token = localStorage.getItem('token');
    return Connect.request<LegalRelationshipResponse[]>(
      `${this.api}/all`,
      'GET',
      null,
      token
    );
  }

  static async search(
    request: LegalRelationshipSearchRequest,
    page: number = 0,
    size: number = 10,
    sortBy: string = "legalRelationshipName"
  ): Promise<ApiResponse<PageResponse<LegalRelationshipResponse>>> {
    const token = localStorage.getItem('token');
    
    const queryParams = new URLSearchParams({
      page: page.toString(),
      size: size.toString(),
      sortBy: sortBy
    });
    
    const url = `${this.api}/search?${queryParams.toString()}`;
    
    return Connect.request<PageResponse<LegalRelationshipResponse>>(
      url,
      'POST',
      request,
      token
    );
  }

  static async create(request: LegalRelationshipRequest): Promise<ApiResponse<void>> {
    console.log(request)
    const token = localStorage.getItem('token');
    return Connect.request<void>(
      `${this.api}`,
      'POST',
      request,
      token
    );
  }

  static async update(id: string, request: LegalRelationshipRequest): Promise<ApiResponse<void>> {
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
}
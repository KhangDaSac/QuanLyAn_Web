import { type ApiResponse } from "../types/ApiResponse";
import { Connect } from "../connect/Connect";
import type { LegalRelationshipResponse } from "../types/response/legal-relationship/LegalRelationshipResponse";
import type { LegalRelationshipRequest } from "../types/request/legal-relationship/LegalRelationshipRequest";
import type { LegalRelationshipSearchRequest } from "../types/request/legal-relationship/LegalRelationshipSearchRequest";

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

  static async search(request: LegalRelationshipSearchRequest): Promise<ApiResponse<LegalRelationshipResponse[]>> {
    const token = localStorage.getItem('token');
    return Connect.request<LegalRelationshipResponse[]>(
      `${this.api}/search`,
      'POST',
      request,
      token
    );
  }

  static async create(request: LegalRelationshipRequest): Promise<ApiResponse<void>> {
    console.log(request)
    const token = localStorage.getItem('token');
    return Connect.request<void>(
      `${this.api}/`,
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
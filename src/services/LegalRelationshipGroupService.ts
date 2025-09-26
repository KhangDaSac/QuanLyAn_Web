import { type ApiResponse } from "../types/ApiResponse";
import { Connect } from "../connect/Connect";
import type { LegalRelationshipGroupResponse } from "../types/response/legal-relationship-group/LegalRelationshipGroupResponse";
import type { LegalRelationshipGroupRequest } from "../types/request/legal-relationship-group/LegalRelationshipGroupRequest";
import type { LegalRelationshipGroupSearchRequest } from "../types/request/legal-relationship-group/LegalRelationshipGroupSearchRequest";
import type { PageResponse } from "../types/response/PageResponse";

export class LegalRelationshipGroupService {
  static api: string = '/legal-relationship-group';
  static async top50(): Promise<ApiResponse<LegalRelationshipGroupResponse[]>> {
    const token = localStorage.getItem('token');
    return Connect.request<LegalRelationshipGroupResponse[]>(
      `${this.api}/limit-50`,
      'GET',
      null,
      token
    );
  }

  static async getAll(): Promise<ApiResponse<LegalRelationshipGroupResponse[]>> {
    const token = localStorage.getItem('token');
    return Connect.request<LegalRelationshipGroupResponse[]>(
      `${this.api}/all`,
      'GET',
      null,
      token
    );
  }

  static async search(
    request: LegalRelationshipGroupSearchRequest,
    page: number = 0,
    size: number = 10,
    sortBy: string = "legalRelationshipGroupName"
  ): Promise<ApiResponse<PageResponse<LegalRelationshipGroupResponse>>> {
    const token = localStorage.getItem('token');
    
    const queryParams = new URLSearchParams({
      page: page.toString(),
      size: size.toString(),
      sortBy: sortBy
    });
    
    const url = `${this.api}/search?${queryParams.toString()}`;
    
    return Connect.request<PageResponse<LegalRelationshipGroupResponse>>(
      url,
      'POST',
      request,
      token
    );
  }

  static async create(request: LegalRelationshipGroupRequest): Promise<ApiResponse<void>> {
    const token = localStorage.getItem('token');
    return Connect.request<void>(
      `${this.api}`,
      'POST',
      request,
      token
    );
  }

  static async update(id: string, request: LegalRelationshipGroupRequest): Promise<ApiResponse<void>> {
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
import { type ApiResponse } from "../types/ApiResponse";
import { Connect } from "../connect/Connect";
import type { LegalRelationshipGroupResponse } from "../types/response/legal-case/LegalRelationshipGroup"; 
import type { LegalRelationshipGroupRequest } from "../types/request/legal-relationship-group/LegalRelationshipGroupRequest";
import type { LegalRelationshipGroupSearchRequest } from "../types/request/legal-relationship-group/LegalRelationshipGroupSearchRequest"; 

export class LegalRelationshipGroupService {
  static async top50(): Promise<ApiResponse<LegalRelationshipGroupResponse[]>> {
    try {
      const token = localStorage.getItem('token');
      return Connect.request(
        '/legal-relationship-group/top-50',
        'GET',
        null,
        token
      );
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  }

    static async getAll(): Promise<ApiResponse<LegalRelationshipGroupResponse[]>> {
    try {
      const token = localStorage.getItem('token');
      return Connect.request(
        '/legal-relationship-group/all',
        'GET',
        null,
        token
      );
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  }

  static async getAllLegalRelationshipGroups(): Promise<ApiResponse<LegalRelationshipGroupResponse[]>> {
    return this.getAll();
  }

  static async searchLegalRelationshipGroups(request: LegalRelationshipGroupSearchRequest): Promise<ApiResponse<LegalRelationshipGroupResponse[]>> {
    try {
      const token = localStorage.getItem('token');
      return Connect.request(
        '/legal-relationship-group/search',
        'POST',
        request,
        token
      );
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  }

  static async createLegalRelationshipGroup(request: LegalRelationshipGroupRequest): Promise<ApiResponse<LegalRelationshipGroupResponse>> {
    try {
      const token = localStorage.getItem('token');
      return Connect.request(
        '/legal-relationship-group',
        'POST',
        request,
        token
      );
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  }

  static async updateLegalRelationshipGroup(id: string, request: LegalRelationshipGroupRequest): Promise<ApiResponse<LegalRelationshipGroupResponse>> {
    try {
      const token = localStorage.getItem('token');
      return Connect.request(
        `/legal-relationship-group/${id}`,
        'PUT',
        request,
        token
      );
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  }

  static async deleteLegalRelationshipGroup(id: string): Promise<ApiResponse<void>> {
    try {
      const token = localStorage.getItem('token');
      return Connect.request(
        `/legal-relationship-group/${id}`,
        'DELETE',
        null,
        token
      );
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  }
}
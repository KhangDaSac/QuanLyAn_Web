import { type ApiResponse } from "../types/ApiResponse";
import { Connect } from "../connect/Connect";
import type { LegalRelationshipResponse } from "../types/response/legal-case/LegalRelationshipResponse";
import type { LegalRelationshipRequest } from "../types/request/legal-relationship/LegalRelationshipRequest";
import type { LegalRelationshipSearchRequest } from "../types/request/legal-relationship/LegalRelationshipSearchRequest";

export class LegalRelationshipService {
  static async top50(): Promise<ApiResponse<LegalRelationshipResponse[]>> {
    try {
      const token = localStorage.getItem('token');
      return Connect.request(
        '/legal-relationship/top-50',
        'GET',
        null,
        token
      );
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  }

    static async getAll(): Promise<ApiResponse<LegalRelationshipResponse[]>> {
    try {
      const token = localStorage.getItem('token');
      return Connect.request(
        '/legal-relationship/all',
        'GET',
        null,
        token
      );
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  }

  static async getAllLegalRelationships(): Promise<ApiResponse<LegalRelationshipResponse[]>> {
    return this.getAll();
  }

  static async searchLegalRelationships(request: LegalRelationshipSearchRequest): Promise<ApiResponse<LegalRelationshipResponse[]>> {
    try {
      const token = localStorage.getItem('token');
      return Connect.request(
        '/legal-relationship/search',
        'POST',
        request,
        token
      );
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  }

  static async createLegalRelationship(request: LegalRelationshipRequest): Promise<ApiResponse<LegalRelationshipResponse>> {
    try {
      const token = localStorage.getItem('token');
      return Connect.request(
        '/legal-relationship',
        'POST',
        request,
        token
      );
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  }

  static async updateLegalRelationship(id: string, request: LegalRelationshipRequest): Promise<ApiResponse<LegalRelationshipResponse>> {
    try {
      const token = localStorage.getItem('token');
      return Connect.request(
        `/legal-relationship/${id}`,
        'PUT',
        request,
        token
      );
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  }

  static async deleteLegalRelationship(id: string): Promise<ApiResponse<void>> {
    try {
      const token = localStorage.getItem('token');
      return Connect.request(
        `/legal-relationship/${id}`,
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
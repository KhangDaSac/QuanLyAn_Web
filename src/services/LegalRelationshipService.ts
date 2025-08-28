import { type ApiResponse } from "../types/ApiResponse";
import { Connect } from "../connect/Connect";
import type { LegalRelationshipResponse } from "../types/response/legal-case/LegalRelationshipResponse";

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
}
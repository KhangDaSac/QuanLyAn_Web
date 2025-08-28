import { type ApiResponse } from "../types/ApiResponse";
import { Connect } from "../connect/Connect";
import type { LegalRelationshipGroupResponse } from "../types/response/legal-case/LegalRelationshipGroup"; 

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
}
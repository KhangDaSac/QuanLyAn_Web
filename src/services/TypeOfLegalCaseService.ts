import { type ApiResponse } from "../types/ApiResponse";
import { type TypeOfLegalCaseResponse } from "../types/response/legal-case/TypeOfLegalCaseResponse"; 
import { Connect }from "../connect/Connect";

export class TypeOfLegalCaseService {
  static async top50(): Promise<ApiResponse<TypeOfLegalCaseResponse[]>> {
    try {
      const token = localStorage.getItem('token');
      return Connect.request(
        '/type-of-legal-case/top-50',
        'GET',
        null,
        token
      );
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  }

    static async getAll(): Promise<ApiResponse<TypeOfLegalCaseResponse[]>> {
    try {
      const token = localStorage.getItem('token');
      return Connect.request(
        '/type-of-legal-case/all',
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
import { type ApiResponse } from "../types/ApiResponse";
import { type LegalCaseResponse } from "../types/response/legal-case/LegalCaseResponse";
import { type LegalCaseSearchRequest } from "../types/request/legal-case/LegalCaseSearchRequest";
import { Connect } from "../connect/Connect";

export class LegalCaseManagerService {
  static async top50(): Promise<ApiResponse<LegalCaseResponse[]>> {
    try {
      const token = localStorage.getItem('token');
      return Connect.request(
        '/legal-case/top-50',
        'GET',
        null,
        token
      );
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  }

  static async search(legalCaseSearch: LegalCaseSearchRequest): Promise<ApiResponse<LegalCaseResponse[]>> {
    try {
      const token = localStorage.getItem('token');
      console.log(legalCaseSearch)
      return Connect.request(
        '/legal-case/search',
        'POST',
        legalCaseSearch,
        token
      );
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  }
}
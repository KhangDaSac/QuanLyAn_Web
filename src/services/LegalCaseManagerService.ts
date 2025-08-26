import { type ApiResponse } from "../types/ApiResponse";
import { type LegalCase } from "../types/LegalCase";
import { type LegalCaseSearch } from "../types/request/LegalCaseSearch";
import { Connect } from "../connect/Connect";

const server_url = import.meta.env.SERVER_URL || 'https://localhost:8081';
export class LegalCaseManagerService {
  static async top50(): Promise<ApiResponse<LegalCase[]>> {
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

  static async search(legalCaseSearch: LegalCaseSearch): Promise<ApiResponse<LegalCase[]>> {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${server_url}/legal-case/search`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(legalCaseSearch),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  }
}
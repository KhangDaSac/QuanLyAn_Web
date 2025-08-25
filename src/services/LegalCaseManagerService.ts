import { type ApiResponse } from "../types/ApiResponse";
import { type LegalCase } from "../types/LegalCase";

const server_url = import.meta.env.SERVER_URL || 'https://localhost:8081';
export class LegalCaseManagerService {
  static async top_50(): Promise<ApiResponse<LegalCase[]>> {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${server_url}/legal-case/top-50`, {
        method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
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
import { type ApiResponse } from "../types/ApiResponse";
import { type LegalCaseResponse } from "../types/response/legal-case/LegalCaseResponse";
import { type LegalCaseSearchRequest } from "../types/request/legal-case/LegalCaseSearchRequest";
import { type LegalCaseRequest } from "../types/request/legal-case/LegalCaseRequest";
import { Connect } from "../connect/Connect";
import type { LegalCasesRequest } from "../types/request/legal-case/LegalCasesRequest";

export class LegalCaseService {
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

  static async create(createRequest: LegalCaseRequest): Promise<ApiResponse<LegalCaseResponse>> {
    try {
      const token = localStorage.getItem('token');
      console.log(createRequest)
      return Connect.request(
        '/legal-case/',
        'POST',
        createRequest,
        token
      );
    } catch (error) {
      console.error('Error creating legal case:', error);
      throw error;
    }
  }

  static async update(legalCaseId: string, updateRequest: LegalCaseRequest): Promise<ApiResponse<LegalCaseResponse>> {
    try {
      const token = localStorage.getItem('token');
      return Connect.request(
        `/legal-case/${legalCaseId}`,
        'PUT',
        updateRequest,
        token
      );
    } catch (error) {
      console.error('Error updating legal case:', error);
      throw error;
    }
  }

  static async delete(legalCaseId: string): Promise<ApiResponse<void>> {
    try {
      const token = localStorage.getItem('token');
      return Connect.request(
        `/legal-case/${legalCaseId}`,
        'DELETE',
        null,
        token
      );
    } catch (error) {
      console.error('Error deleting legal case:', error);
      throw error;
    }
  }

  static async importFromExcel(legalCases: LegalCasesRequest): Promise<ApiResponse<any>> {
    try {
      const token = localStorage.getItem('token');

      return Connect.request(
        `/legal-case/import-excel`,
        'POST',
        legalCases,
        token
      );
    } catch (error) {
      console.error('Error importing legal cases from Excel:', error);
      throw error;
    }
  }
}
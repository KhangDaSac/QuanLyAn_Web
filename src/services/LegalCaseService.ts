import { type ApiResponse } from "../types/ApiResponse";
import { type LegalCaseResponse } from "../types/response/legal-case/LegalCaseResponse";
import { type LegalCaseSearchRequest } from "../types/request/legal-case/LegalCaseSearchRequest";
import { type LegalCaseRequest } from "../types/request/legal-case/LegalCaseRequest";
import { type AssignAssignmentRequest } from "../types/request/legal-case/AssignAssignmentRequest";
import { Connect } from "../connect/Connect";
import type { LegalCasesRequest } from "../types/request/legal-case/LegalCasesRequest";
import type { RandomAssignmentRequest } from "../types/request/legal-case/RandomAssignmentRequest";

export class LegalCaseService {
  static api: string = '/legal-case';
  static async top50(): Promise<ApiResponse<LegalCaseResponse[]>> {
    const token = localStorage.getItem('token');
    return Connect.request<LegalCaseResponse[]>(
      `${this.api}/limit-50`,
      'GET',
      null,
      token
    );
  }

  static async search(request: LegalCaseSearchRequest): Promise<ApiResponse<LegalCaseResponse[]>> {
    const token = localStorage.getItem('token');
    return Connect.request<LegalCaseResponse[]>(
      `${this.api}/search`,
      'POST',
      request,
      token
    );
  }

  static async create(request: LegalCaseRequest): Promise<ApiResponse<void>> {
    const token = localStorage.getItem('token');
    return Connect.request<void>(
      `${this.api}/`,
      'POST',
      request,
      token
    );
  }

  static async update(id: string, updateRequest: LegalCaseRequest): Promise<ApiResponse<void>> {
    const token = localStorage.getItem('token');
    return Connect.request<void>(
      `${this.api}/${id}`,
      'PUT',
      updateRequest,
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

  static async importFromExcel(request: LegalCasesRequest): Promise<ApiResponse<void>> {
    const token = localStorage.getItem('token');
    return Connect.request<void>(
      `${this.api}/import-excel`,
      'POST',
      request,
      token
    );
  }

  static async assignAssignment(request: AssignAssignmentRequest): Promise<ApiResponse<any>> {
    const token = localStorage.getItem('token');
    return Connect.request<void>(
      `${this.api}/assign-assignment`,
      'POST',
      request,
      token
    );
  }

  static async getAssignAssignmentByLegalRelationshipGroup(request: LegalCaseSearchRequest): Promise<ApiResponse<LegalCaseResponse[]>> {
    const token = localStorage.getItem('token');
    return Connect.request<LegalCaseResponse[]>(
      `${this.api}/list-waiting-for-assignment`,
      'POST',
      request,
      token
    );
  }

  static async randomAssignment(request: RandomAssignmentRequest): Promise<ApiResponse<LegalCaseResponse[]>> {
    const token = localStorage.getItem('token');
    return Connect.request<LegalCaseResponse[]>(
      `${this.api}/random-assignment`,
      'POST',
      request,
      token
    );
  }
}
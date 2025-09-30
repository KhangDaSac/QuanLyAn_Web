import { type ApiResponse } from "../types/ApiResponse";
import { type LegalCaseResponse } from "../types/response/legal-case/LegalCaseResponse";
// import { type LegalCasesResponse } from "../types/response/legal-case/LegalCasesResponse";
import { type LegalCaseSearchRequest } from "../types/request/legal-case/LegalCaseSearchRequest";
import { type LegalCaseRequest } from "../types/request/legal-case/LegalCaseRequest";
import { type AssignAssignmentRequest } from "../types/request/legal-case/AssignAssignmentRequest";
import { Connect } from "../connect/Connect";
import type { LegalCasesRequest } from "../types/request/legal-case/LegalCasesRequest";
import type { RandomAssignmentRequest } from "../types/request/legal-case/RandomAssignmentRequest";
import type { AssignmentListRequest } from "../types/request/legal-case/AssignmentListReques";
import type { PageResponse } from "../types/response/PageResponse";

export class LegalCaseService {
  static api: string = "/legal-case";
  static async top50(): Promise<ApiResponse<LegalCaseResponse[]>> {
    const token = localStorage.getItem("token");
    return Connect.request<LegalCaseResponse[]>(
      `${this.api}/limit-50`,
      "GET",
      null,
      token
    );
  }

  static async search(
    request: LegalCaseSearchRequest,
    page: number = 0,
    size: number = 10,
    sortBy: string = "acceptanceDate"
  ): Promise<ApiResponse<PageResponse<LegalCaseResponse>>> {
    const token = localStorage.getItem("token");
    const queryParams = new URLSearchParams({
      page: page.toString(),
      size: size.toString(),
      sortBy: sortBy
    });
    
    const url = `${this.api}/search?${queryParams.toString()}`;
    
    return Connect.request<PageResponse<LegalCaseResponse>>(
      url,
      "POST",
      request,
      token
    );
  }

  static async create(request: LegalCaseRequest): Promise<ApiResponse<void>> {
    const token = localStorage.getItem("token");
    return Connect.request<void>(`${this.api}`, "POST", request, token);
  }

  static async getById(id: string): Promise<ApiResponse<LegalCaseResponse>> {
    const token = localStorage.getItem("token");
    return Connect.request<LegalCaseResponse>(
      `${this.api}/${id}`,
      "GET",
      null,
      token
    );
  }

  static async update(
    id: string,
    updateRequest: LegalCaseRequest
  ): Promise<ApiResponse<void>> {
    const token = localStorage.getItem("token");
    return Connect.request<void>(
      `${this.api}/${id}`,
      "PUT",
      updateRequest,
      token
    );
  }

  static async delete(id: string): Promise<ApiResponse<void>> {
    const token = localStorage.getItem("token");
    return Connect.request<void>(`${this.api}/${id}`, "DELETE", null, token);
  }

  static async importFromExcel(
    request: LegalCasesRequest
  ): Promise<ApiResponse<void>> {
    const token = localStorage.getItem("token");
    return Connect.request<void>(
      `${this.api}/import-excel`,
      "POST",
      request,
      token
    );
  }

  static async assignAssignment(
    request: AssignAssignmentRequest
  ): Promise<ApiResponse<any>> {
    const token = localStorage.getItem("token");
    return Connect.request<void>(
      `${this.api}/assign-assignment`,
      "POST",
      request,
      token
    );
  }

  static async randomAssignment(
    request: RandomAssignmentRequest
  ): Promise<ApiResponse<LegalCaseResponse[]>> {
    const token = localStorage.getItem("token");
    return Connect.request<LegalCaseResponse[]>(
      `${this.api}/random-assignment`,
      "POST",
      request,
      token
    );
  }

    static async getAssignmentList(request: AssignmentListRequest): Promise<ApiResponse<LegalCaseResponse[]>> {
    console.log("Requesting assignment list with request:", request);
    const token = localStorage.getItem("token");
    return Connect.request<LegalCaseResponse[]>(
      `${this.api}/assignment-list`,
      "POST",
      request,
      token
    );
  }
}

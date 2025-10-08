import { Connect } from "../connect/Connect";
import type { ApiResponse } from "../types/ApiResponse";
import type { BatchRequest } from "../types/request/batch/BatchRequest";
import type BatchSearchRequest from "../types/request/batch/BatchSearchRequest";
import type { BatchResponse } from "../types/response/batch/BatchResponse";
import type { PageResponse } from "../types/response/PageResponse";

export class BatchService {
  static api = "/batch";
  static async getAll(): Promise<ApiResponse<BatchResponse[]>> {
    const token = localStorage.getItem("token");
    // const batch = {
    //   batchId: null,
    //   batchName: null,
    //   note: null,
    //   startStorageDate: null,
    //   endStorageDate: null,
    // };
    return Connect.request<BatchResponse[]>(
      `${this.api}/all`,
      "GET",
      null,
      token
    );
  }
  static async getTop50(): Promise<ApiResponse<BatchResponse[]>> {
    const token = localStorage.getItem("token");
    return Connect.request<BatchResponse[]>(
      `${this.api}/limit-50`,
      "GET",
      null,
      token
    );
  }

  static async search(
    request: BatchSearchRequest
  ): Promise<ApiResponse<BatchResponse[]>> {
    const token = localStorage.getItem("token");
    return Connect.request<BatchResponse[]>(
      `${this.api}/search`,
      "POST",
      request,
      token
    );
  }

  // Pagination-enabled search method for future backend support
  static async searchWithPagination(
    request: BatchSearchRequest,
    page: number = 0,
    size: number = 10,
    sortBy: string = "batchId"
  ): Promise<ApiResponse<PageResponse<BatchResponse>>> {
    const token = localStorage.getItem("token");

    const queryParams = new URLSearchParams({
      page: page.toString(),
      size: size.toString(),
      sortBy: sortBy,
    });

    const url = `${this.api}/search?${queryParams.toString()}`;

    return Connect.request<PageResponse<BatchResponse>>(
      url,
      "POST",
      request,
      token
    );
  }

  static async update(
    id: string,
    request: BatchRequest
  ): Promise<ApiResponse<void>> {
    const token = localStorage.getItem("token");
    return Connect.request<void>(`${this.api}/${id}`, "PUT", request, token);
  }

  static async delete(id: string): Promise<ApiResponse<void>> {
    const token = localStorage.getItem("token");
    return Connect.request<void>(`${this.api}/${id}`, "DELETE", null, token);
  }

  static async create(request: BatchRequest): Promise<ApiResponse<void>> {
    const token = localStorage.getItem("token");
    return Connect.request<void>(`${this.api}`, "POST", request, token);
  }
}

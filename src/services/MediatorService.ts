import { Connect } from "../connect/Connect";
import type { ApiResponse } from "../types/ApiResponse";
import type { PageResponse } from "../types/response/PageResponse";
import type { MediatorSearchRequest } from "../types/request/mediator/MediatorSearchRequest";
import type { MediatorRequest } from "../types/request/mediator/MediatorRequest";
import type { MediatorResponse } from "../types/response/mediator/MediatorResponse";

export class MediatorService {
    static api: string = '/mediator';
    static async getAll(): Promise<ApiResponse<MediatorResponse[]>> {
      const token = localStorage.getItem('token');
      return Connect.request<MediatorResponse[]>(
        `${this.api}/all`,
        'GET',
        null,
        token
      );
    }
    static async getLimit50(): Promise<ApiResponse<MediatorResponse[]>> {
      const token = localStorage.getItem('token');
      return Connect.request<MediatorResponse[]>(
        `${this.api}/limit-50`,
        'GET',
        null,
        token
      );
    }

    static async search(
      request: MediatorSearchRequest,
      page: number = 0,
      size: number = 10,
      sort: string = "fullName"
    ): Promise<ApiResponse<PageResponse<MediatorResponse>>> {
      const token = localStorage.getItem('token');
      const params = new URLSearchParams();
      params.append('page', page.toString());
      params.append('size', size.toString());
      params.append('sort', sort);
      
      return Connect.request<PageResponse<MediatorResponse>>(
        `${this.api}/search?${params.toString()}`,
        'POST',
        request,
        token
      );
    }

    static async create(request: MediatorRequest): Promise<ApiResponse<void>> {
      const token = localStorage.getItem('token');
      return Connect.request<void>(
        `${this.api}`,
        'POST',
        request,
        token
      );
    }

    static async update(id: string, request: MediatorRequest): Promise<ApiResponse<void>> {
      const token = localStorage.getItem('token');
      return Connect.request<void>(
        `${this.api}/${id}`,
        'PUT',
        request,
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
}

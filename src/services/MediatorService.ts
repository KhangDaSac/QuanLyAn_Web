import { Connect } from "../connect/Connect";
import type { ApiResponse } from "../types/ApiResponse";
import type { MediatorSearchRequest } from "../types/request/mediator/MediatorSearchRequest";
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

    static async search(request: MediatorSearchRequest): Promise<ApiResponse<MediatorResponse[]>> {
      const token = localStorage.getItem('token');
      return Connect.request<MediatorResponse[]>(
        `${this.api}/search`,
        'POST',
        request,
        token
      )
    }

    static async create(request: MediatorResponse): Promise<ApiResponse<void>> {
      const token = localStorage.getItem('token');
      return Connect.request<void>(
        `${this.api}/`,
        'POST',
        request,
        token
      );
    }

    static async update(id: string, request: MediatorResponse): Promise<ApiResponse<void>> {
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

import { Connect } from "../connect/Connect";
import type { ApiResponse } from "../types/ApiResponse";
import type { BatchRequest } from "../types/request/batch/BatchRequest";
import type BatchSearchRequest from "../types/request/batch/BatchSearchRequest";
import type { BatchResponse } from "../types/response/batch/BatchResponse";

export class BatchService {
    static api = "/batch";
    static async getAll(): Promise<ApiResponse<BatchResponse[]>> {
        const token = localStorage.getItem("token");
        return Connect.request<BatchResponse[]>(
            `${this.api}/all`,
            'GET',
            null,
            token
        );
    }
    static async getTop50(): Promise<ApiResponse<BatchResponse[]>> {
        const token = localStorage.getItem("token");
        return Connect.request<BatchResponse[]>(
            `${this.api}/limit-50`,
            'GET',
            null,
            token
        );
    }

    static async search(request: BatchSearchRequest): Promise<ApiResponse<BatchResponse[]>> {
        const token = localStorage.getItem("token");
        return Connect.request<BatchResponse[]>(
            `${this.api}/search`,
            'POST',
            request,
            token
        );
    }

    static async update(id: string, request: BatchRequest): Promise<ApiResponse<void>> {
        const token = localStorage.getItem("token");
        return Connect.request<void>(
            `${this.api}/update/${id}`,
            'PUT',
            request,
            token
        );
    }

    static async delete(id: string): Promise<ApiResponse<void>> {
        const token = localStorage.getItem("token");
        return Connect.request<void>(
            `${this.api}/delete/${id}`,
            'DELETE',
            null,
            token
        );
    }

    static async create(request: BatchRequest): Promise<ApiResponse<void>> {
        const token = localStorage.getItem("token");
        return Connect.request<void>(
            `${this.api}`,
            'POST',
            request,
            token
        );
    }
}
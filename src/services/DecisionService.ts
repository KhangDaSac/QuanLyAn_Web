import { Connect } from "../connect/Connect";
import type { ApiResponse } from "../types/ApiResponse";
import type DecisionRequest from "../types/request/decision/DecisionRequest";
import type DecisionResponse from "../types/response/decision/DecisionResponse";

export class DecisionService {
    static api = '/decision';
    static async create(request: DecisionRequest): Promise<ApiResponse<void>> {
        const token = localStorage.getItem("token");
        return Connect.request<void>(
            `${this.api}/`,
            'POST',
            request,
            token
        );
    }

    static async update(id: string, request: DecisionRequest): Promise<ApiResponse<void>> {
        const token = localStorage.getItem("token");
        return Connect.request<void>(
            `${this.api}/${id}`,
            'PUT',
            request,
            token
        );
    }

    static async delete(id: string): Promise<ApiResponse<void>> {
        const token = localStorage.getItem("token");
        return Connect.request<void>(
            `${this.api}/${id}`,
            'DELETE',
            undefined,
            token
        );
    }

    static async getByLegalCase(legalCaseId: string): Promise<ApiResponse<DecisionResponse[]>> {
        const token = localStorage.getItem("token");
        return Connect.request<DecisionResponse[]>(
            `${this.api}/by-legal-case/${legalCaseId}`,
            'GET',
            null,
            token
        );
    }
}
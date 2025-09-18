import { Connect } from "../connect/Connect";
import type { ApiResponse } from "../types/ApiResponse";
import type { StatusOfLegalCase } from "../types/enum/StatusOfLegalCase";
import type { HandleTypeOfDecisionRequest } from "../types/request/handle-type-of-decision/HandleTypeOfDecisionRequest";
import type HandleTypeOfDecisionResponse from "../types/response/handle-type-of-decision/HandleTypeOfDecisionResponse";


export class HandleTypeOfDecisionService{
    static api = '/handle-type-of-decision';

    static async create(request: HandleTypeOfDecisionRequest): Promise<ApiResponse<void>> {
        const token = localStorage.getItem("token");
        return Connect.request<void>(
            `${this.api}/`,
            'POST',
            request,
            token
        );
    }

    static async update(typeOfDecisionId: string, preStatusOfLegalCase: StatusOfLegalCase, request: HandleTypeOfDecisionRequest): Promise<ApiResponse<void>> {
        const token = localStorage.getItem("token");
        return Connect.request<void>(
            `${this.api}/${typeOfDecisionId}/${preStatusOfLegalCase}`,
            'PUT',
            request,
            token
        );
    }

    static async delete(typeOfDecisionId: string, preStatusOfLegalCase: StatusOfLegalCase): Promise<ApiResponse<void>> {
        const token = localStorage.getItem("token");
        return Connect.request<void>(
            `${this.api}/${typeOfDecisionId}/${preStatusOfLegalCase}`,
            'DELETE',
            null,
            token
        );
    }
    
    static async getByTypeOfDecision(typeOfDecisionId: string): Promise<ApiResponse<HandleTypeOfDecisionResponse[]>> {
        const token = localStorage.getItem("token");
        return Connect.request<HandleTypeOfDecisionResponse[]>(
            `${this.api}/by-type-of-decision/${typeOfDecisionId}`,
            'GET',
            null,
            token
        );
    }
}
import { Connect } from "../connect/Connect";
import type { ApiResponse } from "../types/ApiResponse";
import type { LegalCaseStatus } from "../types/enum/LegalCaseStatus";
import type { HandleDecisionTypeRequest } from "../types/request/handle-decision-type/HandleDecisionTypeReques";
import type HandleDecisionTypeResponse from "../types/response/handle-decision-type/HandleDecisionTypeResponse";


export class HandleDecisionTypeService{
    static api = '/handle-decision-type';

    static async create(request: HandleDecisionTypeRequest): Promise<ApiResponse<void>> {
        const token = localStorage.getItem("token");
        return Connect.request<void>(
            `${this.api}`,
            'POST',
            request,
            token
        );
    }

    static async update(typeOfDecisionId: string, preStatusOfLegalCase: LegalCaseStatus, request: HandleDecisionTypeRequest): Promise<ApiResponse<void>> {
        const token = localStorage.getItem("token");
        return Connect.request<void>(
            `${this.api}/${typeOfDecisionId}/${preStatusOfLegalCase}`,
            'PUT',
            request,
            token
        );
    }

    static async delete(typeOfDecisionId: string, preStatusOfLegalCase: LegalCaseStatus): Promise<ApiResponse<void>> {
        const token = localStorage.getItem("token");
        return Connect.request<void>(
            `${this.api}/${typeOfDecisionId}/${preStatusOfLegalCase}`,
            'DELETE',
            null,
            token
        );
    }
    
    static async getByTypeOfDecision(typeOfDecisionId: string): Promise<ApiResponse<HandleDecisionTypeResponse[]>> {
        const token = localStorage.getItem("token");
        return Connect.request<HandleDecisionTypeResponse[]>(
            `${this.api}/by-type-of-decision/${typeOfDecisionId}`,
            'GET',
            null,
            token
        );
    }
}
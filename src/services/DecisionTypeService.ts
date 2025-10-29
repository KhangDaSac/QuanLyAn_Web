import { Connect } from "../connect/Connect";
import type { ApiResponse } from "../types/ApiResponse";
import type DecisionTypeRequest from "../types/request/decision-type/DecisionTypeRequest";
import type DecisionTypeSearchRequest from "../types/request/decision-type/DecisionTypeSearchRequest";
import type DecisionTypeResponse from "../types/response/decision-type/DecisionTypeResponse";
import type { PageResponse } from "../types/response/PageResponse";

export class DecisionTypeService {
    static api = '/type-of-decision';
    static async getAll(): Promise<ApiResponse<DecisionTypeResponse[]>> {
        const token = localStorage.getItem("token");
        return Connect.request<DecisionTypeResponse[]>(
            `${this.api}/all`,
            'GET',
            null,
            token
        );
    }

    static async getTop50(): Promise<ApiResponse<DecisionTypeResponse[]>> {
        const token = localStorage.getItem("token");
        return Connect.request<DecisionTypeResponse[]>(
            `${this.api}/limit-50`,
            'GET',
            null,
            token
        );
    }

    static async create(request: DecisionTypeRequest): Promise<ApiResponse<void>> {
        const token = localStorage.getItem("token");
        return Connect.request<void>(
            `${this.api}`,
            'POST',
            request,
            token
        );
    }

    static async update(id: string, request: DecisionTypeRequest): Promise<ApiResponse<void>> {
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
            null,
            token
        );
    }

    static async getById(id: string): Promise<ApiResponse<DecisionTypeResponse>> {
        const token = localStorage.getItem("token");
        return Connect.request<DecisionTypeResponse>(
            `${this.api}/${id}`,
            'GET',
            null,
            token
        );
    }

    // static async search(request: TypeOfDecisionSearchRequest): Promise<ApiResponse<TypeOfDecisionResponse[]>> {
    //     const token = localStorage.getItem("token");
    //     return Connect.request<TypeOfDecisionResponse[]>(
    //         `${this.api}/search`,
    //         'POST',
    //         request,
    //         token
    //     );
    // }

    // Pagination-enabled search method for future backend support
    static async search(
        request: DecisionTypeSearchRequest,
        page: number = 0,
        size: number = 10,
        sortBy: string = "typeOfDecisionId"
    ): Promise<ApiResponse<PageResponse<DecisionTypeResponse>>> {
        const token = localStorage.getItem("token");
        
        // Build query parameters
        const queryParams = new URLSearchParams({
            page: page.toString(),
            size: size.toString(),
            sortBy: sortBy
        });
        
        const url = `${this.api}/search?${queryParams.toString()}`;
        
        return Connect.request<PageResponse<DecisionTypeResponse>>(
            url,
            'POST',
            request,
            token
        );
    }
}
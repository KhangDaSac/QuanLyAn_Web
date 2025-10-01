import { Connect } from "../connect/Connect";
import type { ApiResponse } from "../types/ApiResponse";
import type TypeOfDecisionRequest from "../types/request/type-of-decision/TypeOfDecisionRequest";
import type TypeOfDecisionSearchRequest from "../types/request/type-of-decision/TypeOfDecisionSearchRequest";
import type TypeOfDecisionResponse from "../types/response/type-of-decision/TypeOfDecisionResponse";
import type { PageResponse } from "../types/response/PageResponse";

export class TypeOfDecisionService {
    static api = '/type-of-decision';
    static async getAll(): Promise<ApiResponse<TypeOfDecisionResponse[]>> {
        const token = localStorage.getItem("token");
        return Connect.request<TypeOfDecisionResponse[]>(
            `${this.api}/all`,
            'GET',
            null,
            token
        );
    }

    static async getTop50(): Promise<ApiResponse<TypeOfDecisionResponse[]>> {
        const token = localStorage.getItem("token");
        return Connect.request<TypeOfDecisionResponse[]>(
            `${this.api}/limit-50`,
            'GET',
            null,
            token
        );
    }

    static async create(request: TypeOfDecisionRequest): Promise<ApiResponse<void>> {
        const token = localStorage.getItem("token");
        return Connect.request<void>(
            `${this.api}`,
            'POST',
            request,
            token
        );
    }

    static async update(id: string, request: TypeOfDecisionRequest): Promise<ApiResponse<void>> {
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

    static async getById(id: string): Promise<ApiResponse<TypeOfDecisionResponse>> {
        const token = localStorage.getItem("token");
        return Connect.request<TypeOfDecisionResponse>(
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
        request: TypeOfDecisionSearchRequest,
        page: number = 0,
        size: number = 10,
        sortBy: string = "typeOfDecisionId"
    ): Promise<ApiResponse<PageResponse<TypeOfDecisionResponse>>> {
        const token = localStorage.getItem("token");
        
        // Build query parameters
        const queryParams = new URLSearchParams({
            page: page.toString(),
            size: size.toString(),
            sortBy: sortBy
        });
        
        const url = `${this.api}/search?${queryParams.toString()}`;
        
        return Connect.request<PageResponse<TypeOfDecisionResponse>>(
            url,
            'POST',
            request,
            token
        );
    }
}
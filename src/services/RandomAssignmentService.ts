import { Connect } from "../connect/Connect";
import type { ApiResponse } from "../types/ApiResponse";
import type { LegalCaseResponse } from "../types/response/legal-case/LegalCaseResponse";
import type { JudgeResponse } from "../types/response/judge/JudgeResponse";
import type { LegalCaseSearchRequest } from "../types/request/legal-case/LegalCaseSearchRequest";

class RandomAssignmentService {
    private static readonly BASE_URL = "/legal-case";
    private static readonly JUDGE_URL = "/judge";

    // Tìm kiếm án chờ phân công
    static async searchPendingCases(searchRequest: LegalCaseSearchRequest): Promise<ApiResponse<LegalCaseResponse[]>> {
        try {
            const response = await Connect.request<LegalCaseResponse[]>(
                `${this.BASE_URL}/search`,
                "POST",
                searchRequest
            );
            return response;
        } catch (error) {
            console.error("Error searching pending cases:", error);
            throw error;
        }
    }

    // Lấy danh sách thẩm phán đủ điều kiện phân công
    static async getAssignableJudges(): Promise<ApiResponse<JudgeResponse[]>> {
        try {
            const response = await Connect.request<JudgeResponse[]>(
                `${this.JUDGE_URL}/list-assignment`,
                "GET"
            );
            return response;
        } catch (error) {
            console.error("Error getting assignable judges:", error);
            throw error;
        }
    }

    // Phân công án ngẫu nhiên
    static async assignRandomly(caseIds: string[]): Promise<ApiResponse<LegalCaseResponse[]>> {
        try {
            const response = await Connect.request<LegalCaseResponse[]>(
                `${this.BASE_URL}/assign-random`,
                "POST",
                { caseIds }
            );
            return response;
        } catch (error) {
            console.error("Error assigning cases randomly:", error);
            throw error;
        }
    }
}

export default RandomAssignmentService;

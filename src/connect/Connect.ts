import { type ApiResponse } from "../types/ApiResponse";
const server_url = "http://localhost:8080";

export class Connect {
    static async request<T>(
        endpoint: string,
        method: "GET" | "POST" | "PUT" | "DELETE",
        body?: any,
        token?: string | null
    ): Promise<ApiResponse<T>> {
        try {
            const accessToken = token ?? localStorage.getItem("token");
            console.log(body)
            const response = await fetch(`${server_url}${endpoint}`, {
                method,
                headers: {
                    "Content-Type": "application/json",
                    ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
                },
                body: body ? JSON.stringify(body) : undefined,
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || `Error ${response.status}`);
            }

            return await response.json() as ApiResponse<T>;
        } catch (error: unknown) {
            if (error instanceof Error) {
                console.error("API Error:", error.message);
                throw error;
            }
            throw new Error("Đã xảy ra lỗi không xác định!");
        }
    }
}

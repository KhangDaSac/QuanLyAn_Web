import { type ApiResponse } from "../types/ApiResponse";
// const server_url = "http://192.168.2.131:8080";
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
            const response = await fetch(`${server_url}${endpoint}`, {
                method,
                headers: {
                    "Content-Type": "application/json",
                    ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
                },
                body: body ? JSON.stringify(body) : undefined,
            });

            // Xử lý response cho cả trường hợp thành công và thất bại
            const responseData = await response.json().catch(() => ({}));
            
            // if (!response.ok) {
            //     // Trả về response với thông tin lỗi thay vì ném exception
            //     return {
            //         success: false,
            //         status: response.status,
            //         message: responseData.message || `HTTP Error ${response.status}`,
            //         error: responseData.error || responseData.message || `Lỗi ${response.status}: ${response.statusText}`,
            //         data: {} as T,
            //         timestamp: responseData.timestamp || new Date().toISOString()
            //     };
            // }

            return responseData as ApiResponse<T>;
        } catch (error: unknown) {
            // Xử lý lỗi network hoặc lỗi khác
            let errorMessage = "Không thể kết nối đến máy chủ";
            
            if (error instanceof Error) {
                console.error("API Error:", error.message);
                if (error.message.includes('fetch')) {
                    errorMessage = "Lỗi kết nối mạng. Vui lòng kiểm tra kết nối internet.";
                } else {
                    errorMessage = error.message;
                }
            }
            
            return {
                success: false,
                status: 500,
                message: "Lỗi kết nối",
                error: errorMessage,
                timestamp: new Date().toISOString()
            } as ApiResponse<T>;
        }
    }
}

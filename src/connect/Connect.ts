import { type ApiResponse } from "../types/ApiResponse";
// const server_url = "http://192.168.222.189:8081"; //KhangDaSac
// const server_url = "http://192.168.2.43:8081" // 1_5G
const server_url = import.meta.env.VITE_SERVER_URL as string;
// const server_url = "http://localhost:8081"

export class Connect {
    static async request<T>(
        endpoint: string,
        method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH",
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

            if (response.status === 401) {
                localStorage.removeItem("token");
                window.location.href = "/login";
            }

            const responseData = await response.json().catch(() => ({}));
            console.log(method + " - " + endpoint +  " - " + JSON.stringify(body, null, 2) +  " - Response data" + JSON.stringify({responseData}, null, 2) );
            return responseData as ApiResponse<T>;
        } catch (error: unknown) {
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

import { Connect } from "../connect/Connect";
import type { ApiResponse } from "../types/ApiResponse";
import type { NotificationResponse } from "../types/response/notification/NotificationResponse";
import type { PageResponse } from "../types/response/PageResponse";

export class NotificationService {
  private static api = "/notification";

  static async getMyNotifications(
    page: number = 0,
    size: number = 10
  ): Promise<ApiResponse<PageResponse<NotificationResponse>>> {
    const token = localStorage.getItem("token");
    return Connect.request<PageResponse<NotificationResponse>>(
      `${this.api}/my-notifications?page=${page}&size=${size}`,
      "GET",
      null,
      token
    );
  }

  static async getNotificationById(
    notificationId: string
  ): Promise<ApiResponse<NotificationResponse>> {
    const token = localStorage.getItem("token");
    return Connect.request<NotificationResponse>(
      `${this.api}/my-notifications/${notificationId}`,
      "GET",
      null,
      token
    );
  }
}

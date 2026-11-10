import api from "@/services/api";

import type {
  NotificationsResponse,
  MarkNotificationAsReadResponse,
  MarkAllNotificationsAsReadResponse,
} from "./notification.types";

export const notificationService = {
  async getNotifications() {
    const response = await api.get<NotificationsResponse>(
      "/notifications",
    );

    return response.data;
  },

  async markAsRead(notificationId: string) {
    const response =
      await api.patch<MarkNotificationAsReadResponse>(
        `/notifications/${notificationId}/read`,
      );

    return response.data;
  },

  async markAllAsRead() {
    const response =
      await api.patch<MarkAllNotificationsAsReadResponse>(
        "/notifications/read-all",
      );

    return response.data;
  },
};
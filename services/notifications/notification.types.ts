export type NotificationRecipientType = "USER" | "ADMIN";

export type NotificationType =
  | "NEW_APPLICATION"
  | "APPLICATION_UPDATED"
  | "APPLICATION_STATUS_CHANGED"
  | "APPLICATION_RESPONSE"
  | "STARTUP_PANEL_ACTIVATED"
  | "TICKET_CREATED"
  | "TICKET_MESSAGE"
  | "STARTUP_DOCUMENT_UPLOADED"
  | "STARTUP_REPORT"
  | "MENTOR_COLLABORATION_REQUEST"
  | "CONTACT_MESSAGE"
  | "SYSTEM";

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  data?: Record<string, unknown> | null;

  isRead: boolean;
  readAt: string | null;
  recipientRecordId: string;

  createdAt: string;
  updatedAt: string;
}

export interface NotificationSocketUser {
  userType: NotificationRecipientType;
  userId: string;
}

export interface NotificationsResponse {
  success: boolean;
  data: Notification[];
}

export interface MarkNotificationAsReadResponse {
  success: boolean;
  message: string;
  data: Notification;
}

export interface MarkAllNotificationsAsReadResponse {
  success: boolean;
  message: string;
  updatedCount: number;
}
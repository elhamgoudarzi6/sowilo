import { io, Socket } from "socket.io-client";

import type {
  Notification,
  NotificationSocketUser,
} from "./notification.types";

type NotificationHandler = (
  notification: Notification,
) => void;

class NotificationSocketService {
  private socket: Socket | null = null;

  private currentUser: NotificationSocketUser | null = null;

  private notificationHandlers = new Set<NotificationHandler>();

  connect(user: NotificationSocketUser) {
    // اگر سوکت با همین کاربر وجود دارد، همان را برگردان
    if (
      this.socket &&
      this.currentUser?.userId === user.userId &&
      this.currentUser?.userType === user.userType
    ) {
      return this.socket;
    }

    // اگر کاربر تغییر کرده، اتصال قبلی را ببند
    this.disconnect();

    const socketUrl =
      process.env.NEXT_PUBLIC_SOCKET_URL ||
      "http://localhost:3001";

    this.currentUser = user;

    this.socket = io(`${socketUrl}/notifications`, {
      transports: ["websocket"],
      autoConnect: true,
      auth: {
        userId: user.userId,
        userType: user.userType,
      },
    });

    this.socket.on("connect", () => {
      console.log(
        "Notification socket connected:",
        this.socket?.id,
      );
    });

    this.socket.on("joined", (data: { room: string }) => {
      console.log(
        "Notification socket joined room:",
        data.room,
      );
    });

    this.socket.on(
      "notification",
      (notification: Notification) => {
        this.notificationHandlers.forEach((handler) => {
          handler(notification);
        });
      },
    );

    this.socket.on("disconnect", (reason) => {
      console.log(
        "Notification socket disconnected:",
        reason,
      );
    });

    this.socket.on("connect_error", (error) => {
      console.error(
        "Notification socket connection error:",
        error.message,
      );
    });

    return this.socket;
  }

  onNotification(handler: NotificationHandler) {
    this.notificationHandlers.add(handler);

    return () => {
      this.notificationHandlers.delete(handler);
    };
  }

  disconnect() {
    if (!this.socket) return;

    this.socket.removeAllListeners();
    this.socket.disconnect();
    this.socket = null;
    this.currentUser = null;
  }

  getSocket() {
    return this.socket;
  }

  isConnected() {
    return this.socket?.connected ?? false;
  }
}

export const notificationSocket =
  new NotificationSocketService();
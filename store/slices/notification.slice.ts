import {
  createSlice,
  PayloadAction,
} from "@reduxjs/toolkit";

import type { Notification } from "@/services/notifications/notification.types";

interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  isConnected: boolean;
}

const initialState: NotificationState = {
  notifications: [],
  unreadCount: 0,
  isConnected: false,
};

const notificationSlice = createSlice({
  name: "notifications",

  initialState,

  reducers: {
    addNotification(
      state,
      action: PayloadAction<Notification>,
    ) {
      const notification = action.payload;

      const exists = state.notifications.some(
        (item) => item.id === notification.id,
      );

      if (exists) {
        return;
      }

      state.notifications.unshift(notification);

      if (!notification.isRead) {
        state.unreadCount += 1;
      }
    },

    setNotifications(
      state,
      action: PayloadAction<Notification[]>,
    ) {
      state.notifications = action.payload;

      state.unreadCount =
        action.payload.filter(
          (notification) => !notification.isRead,
        ).length;
    },

    setNotificationConnected(
      state,
      action: PayloadAction<boolean>,
    ) {
      state.isConnected = action.payload;
    },

    markNotificationAsRead(
      state,
      action: PayloadAction<string>,
    ) {
      const notification =
        state.notifications.find(
          (item) => item.id === action.payload,
        );

      if (!notification || notification.isRead) {
        return;
      }

      notification.isRead = true;
      notification.readAt =
        new Date().toISOString();

      if (state.unreadCount > 0) {
        state.unreadCount -= 1;
      }
    },

    markAllNotificationsAsRead(state) {
      state.notifications.forEach(
        (notification) => {
          notification.isRead = true;
          notification.readAt =
            new Date().toISOString();
        },
      );

      state.unreadCount = 0;
    },

    clearNotifications(state) {
      state.notifications = [];
      state.unreadCount = 0;
    },
  },
});

export const {
  addNotification,
  setNotifications,
  setNotificationConnected,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  clearNotifications,
} = notificationSlice.actions;

export default notificationSlice.reducer;
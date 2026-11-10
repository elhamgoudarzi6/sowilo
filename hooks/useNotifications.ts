"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import type { AppDispatch, RootState } from "@/store";

import {
  addNotification,
  clearNotifications,
  markAllNotificationsAsRead,
  markNotificationAsRead,
  setNotificationConnected,
  setNotifications,
} from "@/store/slices/notification.slice";

import { notificationSocket } from "@/services/notifications";
import { notificationService } from "@/services/notifications/notification.service";

export function useNotifications() {
  const dispatch = useDispatch<AppDispatch>();

  const { user, isAuthenticated, initialized } = useSelector(
    (state: RootState) => state.auth,
  );

  const notifications = useSelector(
    (state: RootState) => state.notifications.notifications,
  );

  const unreadCount = useSelector(
    (state: RootState) => state.notifications.unreadCount,
  );

  const isConnected = useSelector(
    (state: RootState) => state.notifications.isConnected,
  );

  const userId = user?.id;
  const userType = user?.type;

  /**
   * Load existing notifications
   */
  useEffect(() => {
    if (!initialized) return;

    if (
      !isAuthenticated ||
      !userId ||
      (userType !== "user" && userType !== "admin")
    ) {
      dispatch(clearNotifications());
      return;
    }

    let cancelled = false;

    const loadNotifications = async () => {
      try {
        const response = await notificationService.getNotifications();

        if (!cancelled) {
          dispatch(setNotifications(response.data ?? []));
        }
      } catch (error) {
        if (!cancelled) {
          console.error(
            "[Notifications] Failed to load notifications:",
            error,
          );
        }
      }
    };

    void loadNotifications();

    return () => {
      cancelled = true;
    };
  }, [
    initialized,
    isAuthenticated,
    userId,
    userType,
    dispatch,
  ]);

  /**
   * WebSocket connection
   */
  useEffect(() => {
    if (!initialized) return;

    if (
      !isAuthenticated ||
      !userId ||
      (userType !== "user" && userType !== "admin")
    ) {
      notificationSocket.disconnect();
      dispatch(setNotificationConnected(false));
      return;
    }

    // Register notification handler before connecting
    const unsubscribe = notificationSocket.onNotification(
      (notification) => {
        dispatch(addNotification(notification));
      },
    );

    const socket = notificationSocket.connect({
      userType: userType === "admin" ? "ADMIN" : "USER",
      userId,
    });

    const handleConnect = () => {
      dispatch(setNotificationConnected(true));
    };

    const handleDisconnect = () => {
      dispatch(setNotificationConnected(false));
    };

    const handleConnectError = (error: Error) => {
      dispatch(setNotificationConnected(false));

      console.error(
        "[Notifications] WebSocket connection error:",
        error.message,
      );
    };

    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);
    socket.on("connect_error", handleConnectError);

    dispatch(setNotificationConnected(socket.connected));

    return () => {
      unsubscribe();

      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
      socket.off("connect_error", handleConnectError);

      // Keep the shared socket connection alive.
    };
  }, [
    initialized,
    isAuthenticated,
    userId,
    userType,
    dispatch,
  ]);

  /**
   * Mark one notification as read
   */
  const markAsRead = async (notificationId: string) => {
    try {
      await notificationService.markAsRead(notificationId);

      dispatch(markNotificationAsRead(notificationId));
    } catch (error) {
      console.error(
        "[Notifications] Failed to mark notification as read:",
        error,
      );
    }
  };

  /**
   * Mark all notifications as read
   */
  const markAllAsRead = async () => {
    try {
      await notificationService.markAllAsRead();

      dispatch(markAllNotificationsAsRead());
    } catch (error) {
      console.error(
        "[Notifications] Failed to mark all notifications as read:",
        error,
      );
    }
  };

  /**
   * Clear local notifications
   */
  const clearAll = () => {
    dispatch(clearNotifications());
  };

  return {
    notifications,
    unreadCount,
    isConnected,
    markAsRead,
    markAllAsRead,
    clearAll,
  };
}
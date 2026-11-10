
"use client";

import { useEffect } from "react";
import {
    FiBell,
    FiCheck,
    FiCheckCircle,
    FiX,
} from "react-icons/fi";

import type { Notification } from "@/services/notifications/notification.types";

interface NotificationModalProps {
    open: boolean;
    notifications: Notification[];
    unreadCount: number;
    onClose: () => void;
    onRead: (notificationId: string) => void;
    onReadAll: () => void;
}

export default function NotificationModal({
    open,
    notifications,
    unreadCount,
    onClose,
    onRead,
    onReadAll,
}: NotificationModalProps) {
    useEffect(() => {
        if (!open) return;

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                onClose();
            }
        };

        document.addEventListener("keydown", handleKeyDown);

        return () => {
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [open, onClose]);

    if (!open) {
        return null;
    }

    const unreadNotifications = notifications.filter(
        (notification) => !notification.isRead,
    );

    const formatDate = (date: string) => {
        const notificationDate = new Date(date);

        return notificationDate.toLocaleString("fa-IR", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 backdrop-blur-[3px]"
            onMouseDown={onClose}
        >
            <div
         
                className="w-full max-w-xl overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-[0_20px_60px_rgba(0,0,0,0.15)]"
                onMouseDown={(event) => {
                    event.stopPropagation();
                }}
            >
                {/* Header */}
                <div className="relative overflow-hidden border-b border-gray-100">
                    <div className="absolute inset-0 bg-(--primary-color) opacity-[0.06]" />

                    <div className="relative flex items-center justify-between px-5 py-5">
                        <div className="flex items-center gap-3">
                            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-(--primary-color) text-white shadow-sm">
                                <FiBell size={20} />
                            </div>

                            <div>
                                <h3 className="text-base font-bold text-gray-800">
                                    اعلان‌ها
                                </h3>

                                <p className="mt-1 text-xs text-gray-400">
                                    {unreadNotifications.length} اعلان جدید
                                </p>
                            </div>
                        </div>

                        <button
                            type="button"
                            onClick={onClose}
                            className="flex h-9 w-9 items-center justify-center rounded-xl text-gray-400 transition hover:bg-white hover:text-gray-700 hover:shadow-sm"
                            aria-label="بستن"
                        >
                            <FiX size={19} />
                        </button>
                    </div>
                </div>

                {/* Actions */}
                {unreadNotifications.length > 0 && (
                    <div className="flex items-center justify-between border-b border-gray-100 bg-gray-50/70 px-5 py-3">
                        <span className="text-xs text-gray-700">
                            {unreadNotifications.length} اعلان جدید دارید
                        </span>

                        <button
                            type="button"
                            onClick={onReadAll}
                            className="cursor-pointer rounded-lg px-3 py-1.5 text-xs font-semibold text-(--primary-color) transition hover:bg-(--primary-color)/10"
                        >
                            خواندن همه
                        </button>
                    </div>
                )}

                {/* Notifications */}
                <div className="max-h-[65vh] overflow-y-auto">
                    {unreadNotifications.length === 0 ? (
                        <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
                            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-(--primary-color)/10 text-(--primary-color)">
                                <FiCheckCircle size={27} />
                            </div>

                            <h4 className="text-sm font-bold text-gray-700">
                                اعلان جدیدی ندارید
                            </h4>

                            <p className="mt-2 max-w-xs text-xs leading-5 text-gray-400">
                                همه اعلان‌های شما مشاهده شده‌اند.
                            </p>
                        </div>
                    ) : (
                        <div className="divide-y divide-gray-100">
                            {unreadNotifications.map((notification) => (
                                <div
                                    key={notification.id}
                                    className="group relative  bg-(--primary-color)/[0.035] px-5 py-4 transition hover:bg-(--primary-color)/[0.07]"
                                >
                                    {/* Unread Line */}
                                    <span className="absolute right-0 top-0 h-full w-1 bg-(--primary-color)" />

                                    <div className="grid grid-cols-[1fr_auto] items-center gap-5">
                                        {/* Content */}
                                        <div className="min-w-0">
                                            {/* Title + New */}
                                            <div className="flex items-center gap-2">
                                                <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-(--primary-color) shadow-[0_0_0_3px_var(--primary-color)]/10" />
                                                <h4 className="min-w-0 truncate text-sm font-bold text-gray-800">
                                                    {notification.title}
                                                </h4>
                                            </div>

                                            {/* Message */}
                                            <p className="mt-2 text-xs leading-5 text-gray-500">
                                                {notification.message}
                                            </p>

                                            {/* Date */}
                                            <p className="mt-2 text-[10px] text-gray-400">
                                                {formatDate(
                                                    notification.createdAt,
                                                )}
                                            </p>
                                        </div>

                                        {/* Action */}
                                        <div className="shrink-0">
                                            <button
                                                type="button"
                                                onClick={() => onRead(notification.id)}
                                                aria-label="علامت‌گذاری به‌عنوان خوانده‌شده"
                                                className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg text-(--primary-color) transition hover:bg-(--primary-color) hover:text-white active:scale-[0.98]"
                                            >
                                                <FiCheck size={20} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

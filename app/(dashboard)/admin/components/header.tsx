"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import {
    TbLogout,
    TbMenu,
    TbBell,
    TbUser,
} from "react-icons/tb";

import type { AuthUser } from "@/auth/types";
import { authService } from "@/services/auth.service";
import { token } from "@/auth/token";

import { clearAuth } from "@/store/slices/auth.slice";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";

import type { RootState } from "@/store";

import NotificationModal from "../../notification-modal";
import { useNotifications } from "@/hooks/useNotifications";

interface AdminHeaderProps {
    user: AuthUser;
    onMenuClick: () => void;
}

export default function Header({
    user,
    onMenuClick,
}: AdminHeaderProps) {
    const router = useRouter();
    const dispatch = useDispatch();

    const [isNotificationOpen, setIsNotificationOpen] =
        useState(false);

    const [avatarError, setAvatarError] = useState(false);

    const {
        notifications,
        unreadCount,
        markAsRead,
        markAllAsRead,
    } = useNotifications();

    const isAuthenticated = useSelector(
        (state: RootState) => state.auth.isAuthenticated
    );

    // Reset avatar fallback when the avatar URL changes
    useEffect(() => {
        setAvatarError(false);
    }, [user.avatar]);

    const handleLogout = async () => {
        try {
            await authService.logout();
        } catch (error) {
            console.error("LOGOUT FAILED:", error);
        } finally {
            token.remove();
            dispatch(clearAuth());
            router.replace("/admin-login");
        }
    };

    const displayName = user.name?.trim() || "Administrator";
    const hasAvatar = Boolean(user.avatar) && !avatarError;

    return (
        <>
            <header className="flex h-20 items-center justify-between border-b border-(--color-border) bg-(--color-surface) px-5 sm:px-6 lg:px-8">

                {/* Left Side */}
                <div className="flex items-center gap-5">

                    {/* Mobile Menu */}
                    <button
                        type="button"
                        onClick={onMenuClick}
                        aria-label="Open navigation menu"
                        className="flex cursor-pointer items-center justify-center rounded-xl p-2 text-2xl text-(--color-text-secondary) transition-colors hover:bg-(--color-primary)/10 hover:text-(--color-primary) lg:hidden"
                    >
                        <TbMenu />
                    </button>

                    {/* Admin Profile */}
                    <div className="hidden items-center gap-3 md:flex">

                        {/* Avatar */}
                        <div className="relative flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full border border-(--color-primary)/50 bg-(--color-primary)/10">

                            {hasAvatar ? (
                                <Image
                                    src={user.avatar!}
                                    alt={displayName}
                                    fill
                                    unoptimized
                                    sizes="48px"
                                    onError={() => setAvatarError(true)}
                                    className="object-cover"
                                />
                            ) : (
                                <TbUser
                                    size={34}
                                    strokeWidth={1.3}
                                    className="text-(--color-primary)"
                                />
                            )}
                        </div>

                        {/* User Information */}
                        <div>
                            <p className="text-xs text-(--color-text-secondary)">
                                Welcome back,
                            </p>

                            <h4 className="mt-1 text-sm font-semibold text-(--color-text)">
                                {displayName}
                            </h4>
                        </div>
                    </div>
                </div>

                {/* Right Side */}
                <div className="flex items-center gap-3">

                    {/* Notifications */}
                    <button
                        type="button"
                        onClick={() => setIsNotificationOpen(true)}
                        aria-label="Notifications"
                        title="Notifications"
                        className="relative flex h-11 w-11 cursor-pointer items-center justify-center rounded-xl border border-(--color-border) bg-(--color-surface) text-(--color-text-secondary) transition-all duration-300 hover:border-(--color-primary) hover:bg-(--color-primary)/10 hover:text-(--color-primary)"
                    >
                        <TbBell size={20} />

                        {/* Unread Badge */}
                        {unreadCount > 0 && (
                            <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-(--color-primary) px-1 text-[10px] font-bold leading-none text-(--color-text-inverse) shadow-sm">
                                {unreadCount > 99
                                    ? "99+"
                                    : unreadCount}
                            </span>
                        )}
                    </button>

                    {/* Logout */}
                    <button
                        type="button"
                        onClick={handleLogout}
                        aria-label="Sign out"
                        title="Sign out"
                        className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-xl border border-(--color-border) bg-(--color-surface) text-(--color-text-secondary) transition-all duration-300 hover:border-(--color-primary) hover:bg-(--color-primary)/10 hover:text-(--color-primary)"
                    >
                        <TbLogout size={20} />
                    </button>
                </div>
            </header>

            {/* Notification Modal */}
            {isAuthenticated && (
                <NotificationModal
                    open={isNotificationOpen}
                    notifications={notifications}
                    unreadCount={unreadCount}
                    onClose={() => setIsNotificationOpen(false)}
                    onRead={markAsRead}
                    onReadAll={markAllAsRead}
                />
            )}
        </>
    );
}
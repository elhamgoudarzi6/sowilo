"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import type { ReactNode } from "react";

import { authService } from "@/services/auth.service";
import { token } from "@/auth/token";
import { clearAuth } from "@/store/slices/auth.slice";
import { usePermissions } from "@/hooks/usePermissions";

import {
    TbLayout,
    TbUsers,
    TbPhoto,
    TbVideo,
    TbChevronDown,
    TbChevronRight,
    TbShieldLock,
    TbKey,
    TbLockAccess,
    TbX,
    TbLogout,
    TbSettings,
} from "react-icons/tb";

interface AdminSidebarProps {
    isOpen: boolean;
    onClose: () => void;
}

interface MenuItem {
    title: string;
    icon: ReactNode;
    href: string;
    modules?: string[];
}

interface MenuGroup {
    label: string;
    items: MenuItem[];
    collapsible?: boolean;
}

const adminMenu: MenuGroup[] = [
    {
        label: "Main",
        items: [
            {
                title: "Dashboard",
                icon: <TbLayout />,
                href: "/admin",
            },
            {
                title: "Users",
                icon: <TbUsers />,
                href: "/admin/users",
                modules: ["users"],
            },
            {
                title: "Gallery",
                icon: <TbPhoto />,
                href: "/admin/gallery",
                modules: ["gallery"],
            },
            {
                title: "Videos",
                icon: <TbVideo />,
                href: "/admin/videos",
                modules: ["videos"],
            },
        ],
    },
    {
        label: "Admins & Access",
        collapsible: true,
        items: [
            {
                title: "Administrators",
                icon: <TbUsers />,
                href: "/admin/admins",
                modules: ["admins"],
            },
            {
                title: "Roles",
                icon: <TbShieldLock />,
                href: "/admin/roles",
                modules: ["roles"],
            },
            {
                title: "Permissions",
                icon: <TbKey />,
                href: "/admin/permissions",
                modules: ["permissions"],
            },
            {
                title: "Role Permissions",
                icon: <TbLockAccess />,
                href: "/admin/role-permissions",
                modules: ["role"],
            },
        ],
    },
    {
        label: "System",
        items: [
            {
                title: "Settings",
                icon: <TbSettings />,
                href: "/admin/settings",
                modules: ["admins"],
            },
        ],
    },
];

const isItemActive = (pathname: string, href: string) => {
    if (href === "/admin") {
        return pathname === "/admin";
    }

    return pathname === href || pathname.startsWith(`${href}/`);
};

export default function Sidebar({
    isOpen,
    onClose,
}: AdminSidebarProps) {
    const pathname = usePathname();
    const router = useRouter();
    const dispatch = useDispatch();

    const { hasModule } = usePermissions();

    const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({
        "Admin Management & Access": false,
    });

    // Filter menu items based on admin permissions
    const visibleMenu: MenuGroup[] = adminMenu
        .map((group) => ({
            ...group,
            items: group.items.filter((item) => {
                if (!item.modules || item.modules.length === 0) {
                    return true;
                }

                return item.modules.some((module) =>
                    hasModule(module)
                );
            }),
        }))
        .filter((group) => group.items.length > 0);

    // Automatically open the active collapsible group
    useEffect(() => {
        const activeGroup = adminMenu.find((group) =>
            group.collapsible &&
            group.items.some((item) =>
                isItemActive(pathname, item.href)
            )
        );

        if (!activeGroup) return;

        setOpenGroups((prev) => ({
            ...prev,
            [activeGroup.label]: true,
        }));
    }, [pathname]);

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

    const toggleGroup = (label: string) => {
        setOpenGroups((prev) => ({
            ...Object.fromEntries(
                Object.keys(prev).map((key) => [key, false])
            ),
            [label]: !prev[label],
        }));
    };

    return (
        <>
            {/* Mobile Overlay */}
            {isOpen && (
                <div
                    onClick={onClose}
                    className="fixed inset-0 z-40 bg-(--color-overlay)/60 backdrop-blur-sm lg:hidden"
                />
            )}

            {/* Sidebar */}
            <aside
                dir="ltr"
                className={`
                    fixed top-0 right-0 z-50
                    flex h-screen w-72 flex-col
                    border-l border-(--color-border)
                    bg-(--color-surface)
                    transition-transform duration-300
                    lg:static lg:translate-x-0
                    ${isOpen ? "translate-x-0" : "translate-x-full"}
                `}
            >
                {/* Mobile Close Button */}
                <div className="flex justify-end p-4 lg:hidden">
                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="Close menu"
                        className="flex h-9 w-9 items-center justify-center rounded-lg text-(--color-text-secondary) transition hover:bg-(--color-primary)/10 hover:text-(--color-primary)"
                    >
                        <TbX size={20} />
                    </button>
                </div>

                {/* Brand */}
                <div className="border-b border-(--color-border) px-6 py-6">
                    <Link
                        href="/admin"
                        onClick={onClose}
                        className="inline-flex flex-col"
                    >
                        <span className="text-3xl font-black tracking-tight text-(--color-text)">
                            sowilo<span className="text-(--color-primary)">.</span>
                        </span>

                        <span className="mt-1 text-[9px] font-semibold uppercase tracking-[0.25em] text-(--color-text-secondary)">
                            Administration Panel
                        </span>
                    </Link>
                </div>

                {/* Navigation */}
                <nav
                    aria-label="Admin navigation"
                    className="flex-1 overflow-y-auto px-4 py-6"
                >
                    {visibleMenu.map((group) => {
                        const isOpenGroup = group.collapsible
                            ? Boolean(openGroups[group.label])
                            : true;

                        return (
                            <div
                                key={group.label}
                                className="mb-7 last:mb-0"
                            >
                                {/* Group Heading */}
                                {group.collapsible ? (
                                    <button
                                        type="button"
                                        onClick={() =>
                                            toggleGroup(group.label)
                                        }
                                        aria-expanded={isOpenGroup}
                                        className="mb-2 flex h-11 w-full items-center justify-between rounded-lg px-3 text-(--color-text) transition hover:bg-(--color-primary)/10 hover:text-(--color-primary)"
                                    >
                                        <span className="text-xs font-semibold uppercase tracking-[0.12em]">
                                            {group.label}
                                        </span>

                                        {isOpenGroup ? (
                                            <TbChevronDown size={18} />
                                        ) : (
                                            <TbChevronRight size={18} />
                                        )}
                                    </button>
                                ) : (
                                    <h3 className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[0.2em] text-(--color-text-secondary)">
                                        {group.label}
                                    </h3>
                                )}

                                {/* Group Items */}
                                <div
                                    className={`
                                        space-y-1 overflow-hidden
                                        transition-all duration-300
                                        ${
                                            isOpenGroup
                                                ? "max-h-[1000px] opacity-100"
                                                : "max-h-0 opacity-0"
                                        }
                                    `}
                                >
                                    {group.items.map((item) => {
                                        const active = isItemActive(
                                            pathname,
                                            item.href
                                        );

                                        return (
                                            <Link
                                                key={item.href}
                                                href={item.href}
                                                onClick={onClose}
                                                aria-current={
                                                    active ? "page" : undefined
                                                }
                                                className={`
                                                    group flex h-11 items-center gap-3
                                                    rounded-lg px-3
                                                    transition-all duration-200
                                                    ${
                                                        active
                                                            ? "bg-(--color-primary) text-(--color-text-inverse)"
                                                            : "text-(--color-text-secondary) hover:bg-(--color-primary)/10 hover:text-(--color-primary)"
                                                    }
                                                `}
                                            >
                                                <span
                                                    className={`
                                                        flex shrink-0 items-center justify-center
                                                        text-xl
                                                        ${
                                                            active
                                                                ? "text-(--color-text-inverse)"
                                                                : "text-(--color-text-secondary) group-hover:text-(--color-primary)"
                                                        }
                                                    `}
                                                >
                                                    {item.icon}
                                                </span>

                                                <span className="text-sm font-medium">
                                                    {item.title}
                                                </span>
                                            </Link>
                                        );
                                    })}
                                </div>
                            </div>
                        );
                    })}
                </nav>

                {/* Logout */}
                <div className="border-t border-(--color-border) p-4">
                    <button
                        type="button"
                        onClick={handleLogout}
                        className="flex h-11 w-full cursor-pointer items-center gap-3 rounded-lg px-3 text-(--color-text-secondary) transition hover:bg-(--color-primary)/10 hover:text-(--color-primary)"
                    >
                        <TbLogout size={19} />

                        <span className="text-sm font-medium">
                            Sign Out
                        </span>
                    </button>
                </div>
            </aside>
        </>
    );
}
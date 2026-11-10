"use client";

import Link from "next/link";
import {
    TbUsers,
    TbVideo,
    TbPhoto,
    TbSettings,
    TbShieldLock,
    TbKey,
    TbArrowUpRight,
} from "react-icons/tb";

import { usePermissions } from "@/hooks/usePermissions";

const QUICK_LINKS = [
    {
        title: "Users",
        description: "Manage user accounts and user information.",
        category: "Management",
        href: "/admin/users",
        icon: TbUsers,
        module: "users",
    },
    {
        title: "Gallery",
        description: "Manage photos, collections and visual content.",
        category: "Content",
        href: "/admin/gallery",
        icon: TbPhoto,
        module: "gallery",
    },
    {
        title: "Videos",
        description: "Manage video content and featured media.",
        category: "Content",
        href: "/admin/videos",
        icon: TbVideo,
        module: "videos",
    },
    {
        title: "Settings",
        description: "Configure your website and system preferences.",
        category: "System",
        href: "/admin/settings",
        icon: TbSettings,
        module: "admins",
    },

];

function QuickAccess() {
    const { hasModule } = usePermissions();

    const visibleLinks = QUICK_LINKS.filter((item) =>
        hasModule(item.module)
    );

    return (
        <section className="space-y-7">

            {/* Section Heading */}
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-5">

                <div>
                    <div className="mb-4 flex items-center gap-3">
                        <span className="h-px w-8 bg-(--color-primary)" />

                        <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-(--color-text-secondary)">
                            SOWILO / Workspace
                        </span>
                    </div>

                    <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-(--color-text)">
                        Dashboard
                        <span className="text-(--color-primary)">.</span>
                    </h1>

                    <p className="mt-3 text-sm leading-6 text-(--color-text-secondary)">
                        Manage your website, content and administration.
                    </p>
                </div>

                <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-(--color-text-secondary)">
                    <span className="h-2 w-2 rounded-full bg-(--color-success)" />
                    Workspace
                </div>
            </div>
{/* Quick Access Grid */}
<div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
    {visibleLinks.map((item) => {
        const Icon = item.icon;

        return (
            <Link
                key={item.href}
                href={item.href}
                className="group flex items-center gap-3 rounded-xl border border-(--color-border) bg-(--color-surface) px-4 py-3 transition-all duration-300 hover:border-(--color-primary)/50 hover:bg-(--color-primary)/5"
            >
                {/* Icon */}
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-(--color-background) text-(--color-primary) transition-colors duration-300 group-hover:bg-(--color-primary) group-hover:text-(--color-text-inverse)">
                    <Icon size={21} strokeWidth={1.7} />
                </div>

                {/* Title */}
                <span className="flex-1 text-sm font-semibold text-(--color-text) transition-colors group-hover:text-(--color-primary)">
                    {item.title}
                </span>
                

                {/* Arrow */}
                <TbArrowUpRight
                    size={17}
                    className="shrink-0 text-(--color-text-secondary) transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-(--color-primary)"
                />
            </Link>
        );
    })}
</div>



        </section>
    );
}

export default function DashboardPage() {
    return (
        <div className="mx-auto w-full max-w-7xl space-y-8 pb-10">
            <QuickAccess />
        </div>
    );
}
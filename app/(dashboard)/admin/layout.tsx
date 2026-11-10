
"use client";

import {
  useEffect,
  useState,
  type ReactNode,
} from "react";

import {
  usePathname,
  useRouter,
} from "next/navigation";

import { LockKeyhole } from "lucide-react";

import { useAuth } from "@/hooks/useAuth";
import { usePermissions } from "@/hooks/usePermissions";
import { useNotifications } from "@/hooks/useNotifications";

import Header from "./components/header";
import Sidebar from "./components/sidebar";

interface Props {
  children: ReactNode;
}

/**
 * نگاشت مسیرهای پنل به ماژول‌های موجود در سایدبار.
 * نام ماژول‌ها مطابق ساختار فعلی Sidebar انتخاب شده‌اند.
 */
const ADMIN_ROUTE_MODULES: Record<string, string> = {
  "/admin/users": "users",
  "/admin/messages": "tickets",
  "/admin/blogs": "blogs",
  "/admin/admins": "admins",
  "/admin/roles": "roles",
  "/admin/permissions": "permissions",
  "/admin/role-permissions": "role",
  "/admin/settings": "admins",
};

function matchesRoute(
  pathname: string,
  route: string,
): boolean {
  return (
    pathname === route ||
    pathname.startsWith(`${route}/`)
  );
}

function getRequiredModule(
  pathname: string,
): string | null {
  // داشبورد اصلی برای ادمین‌های واردشده مجاز است.
  if (pathname === "/admin") {
    return null;
  }

  // مسیر دقیق‌تر اول بررسی شود تا در صورت اضافه‌شدن
  // مسیرهای تو در تو، مسیر خاص‌تر اولویت داشته باشد.
  const matchedRoute = Object.keys(ADMIN_ROUTE_MODULES)
    .sort((a, b) => b.length - a.length)
    .find((route) => matchesRoute(pathname, route));

  // مسیر تعریف‌نشده مجوز مشخصی ندارد.
  if (!matchedRoute) {
    return "__UNMAPPED_ROUTE__";
  }

  return ADMIN_ROUTE_MODULES[matchedRoute];
}

export default function AdminLayout({
  children,
}: Props) {
  const [isOpen, setIsOpen] = useState(false);

  const router = useRouter();
  const pathname = usePathname();

  const {
    user,
    initialized,
    isAuthenticated,
  } = useAuth();

  const {
    hasModule,
    isSuperAdmin,
    hasFullAccess,
  } = usePermissions();

  const isAdmin =
    isAuthenticated &&
    user?.type === "admin";

  const requiredModule = getRequiredModule(pathname);

  const isRouteAllowed =
    isAdmin &&
    (
      pathname === "/admin" ||
      isSuperAdmin ||
      hasFullAccess ||
      (
        requiredModule !== null &&
        requiredModule !== "__UNMAPPED_ROUTE__" &&
        hasModule(requiredModule)
      )
    );

  useEffect(() => {
    if (!initialized) {
      return;
    }

    if (!isAuthenticated || !user) {
      router.replace("/admin-login");
      return;
    }

    if (user.type !== "admin") {
      router.replace("/user");
    }
  }, [
    initialized,
    isAuthenticated,
    user,
    router,
  ]);

  // بررسی اولیه احراز هویت
  if (!initialized) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-(--color-background) text-(--color-text-secondary)">
        در حال بررسی وضعیت ورود...
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return null;
  }

  if (user.type !== "admin") {
    return null;
  }

  // جلوگیری از نمایش صفحه قبل از تأیید مجوز مسیر
  if (!isRouteAllowed) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-(--color-background) p-6">
        <div className="w-full max-w-md rounded-2xl border border-(--color-border) bg-(--color-surface) p-6 text-center shadow-sm">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-(--color-accent) text-(--color-primary)">
            <LockKeyhole
              size={26}
              strokeWidth={1.8}
            />
          </div>

          <h1 className="mt-4 text-lg font-bold text-(--color-text)">
            دسترسی به این بخش محدود است
          </h1>

          <p className="mt-3 text-sm leading-7 text-(--color-text-secondary)">
            شما مجوز مشاهده این صفحه را ندارید یا مسیر موردنظر
            در تنظیمات دسترسی پنل تعریف نشده است.
            برای دریافت دسترسی بیشتر با مدیر سیستم تماس بگیرید.
          </p>

          <button
            type="button"
            onClick={() => router.replace("/admin")}
            className="mt-5 rounded-xl bg-(--color-primary) px-5 py-3 text-sm font-semibold text-(--color-text-inverse) transition-colors hover:bg-(--color-primary-hover)"
          >
            بازگشت به داشبورد
          </button>
        </div>
      </div>
    );
  }

  return (
    <AdminLayoutContent
      user={user}
      isOpen={isOpen}
      setIsOpen={setIsOpen}
    >
      {children}
    </AdminLayoutContent>
  );
}

function AdminLayoutContent({
  user,
  isOpen,
  setIsOpen,
  children,
}: {
  user: NonNullable<
    ReturnType<typeof useAuth>["user"]
  >;
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  children: ReactNode;
}) {
  useNotifications();

  return (
    <div className="admin-theme  flex h-screen overflow-hidden bg-(--color-background)">
      <Sidebar
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      />

      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <Header
          user={user}
          onMenuClick={() => setIsOpen(true)}
        />

        <main className="min-h-0 flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}

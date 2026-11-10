
"use client";

import { useAuth } from "@/hooks/useAuth";

import type { GroupedPermission } from "@/auth/types";

export function usePermissions() {
  const { user } = useAuth();

  const permissions: GroupedPermission[] =
    (user?.permissions as GroupedPermission[] | undefined) ?? [];

  const isAdmin = user?.type === "admin" && user.isActive === true;

  const isSuperAdmin =
    isAdmin && user?.role === "SUPER_ADMIN";

  const hasFullAccess =
    permissions.some((item) =>
      item.actions.includes("full.access"),
    );

  const can = (permissionCode: string): boolean => {
    if (!isAdmin) {
      return false;
    }

    // دسترسی کامل، بر اساس مجوز دیتابیس
    if (hasFullAccess || isSuperAdmin) {
      return true;
    }

    // بررسی کد کامل مجوز؛ مثل applications.read
    return permissions.some((item) =>
      item.actions.includes(permissionCode),
    );
  };

  const hasModule = (module: string): boolean => {
    if (!isAdmin) {
      return false;
    }

    if (hasFullAccess || isSuperAdmin) {
      return true;
    }

    return permissions.some(
      (item) =>
        item.module === module && item.actions.length > 0,
    );
  };

  return {
    can,
    hasModule,
    permissions,
    isSuperAdmin,
    hasFullAccess,
  };
}

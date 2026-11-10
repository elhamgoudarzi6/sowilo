import type { AuthUser } from "./types";

export const canAccessAdmin = (
  user: AuthUser | null,
): boolean => {
  return user?.type === "admin" && user.isActive !== false;
};

export const canAccessUser = (
  user: AuthUser | null,
): boolean => {
  return user?.type === "user" && user.isActive !== false;
};

export const hasPermission = (
  user: AuthUser | null,
  requiredPermission: string,
): boolean => {
  if (!user || user.isActive === false) return false;

  return user.permissions.some(
    (group) =>
      group.actions.includes("full.access") ||
      group.actions.includes(requiredPermission),
  );
};

export const hasAllPermissions = (
  user: AuthUser | null,
  requiredPermissions: string[],
): boolean => {
  if (!user || user.isActive === false) return false;

  if (requiredPermissions.length === 0) return true;

  if (
    user.permissions.some((group) =>
      group.actions.includes("full.access"),
    )
  ) {
    return true;
  }

  return requiredPermissions.every((permission) =>
    hasPermission(user, permission),
  );
};
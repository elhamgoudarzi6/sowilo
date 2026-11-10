"use client";

import { useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";

import type { RootState } from "@/store";
import { canAccessAdmin, canAccessUser } from "./permissions";
import { ROUTES } from "./constants";

interface AuthGuardProps {
  role: "admin" | "user";
  children: ReactNode;
}

export default function AuthGuard({
  role,
  children,
}: AuthGuardProps) {
  const router = useRouter();

  const { user, initialized } = useSelector(
    (state: RootState) => state.auth,
  );

  const hasAccess =
    role === "admin"
      ? canAccessAdmin(user)
      : canAccessUser(user);

  useEffect(() => {
    if (!initialized) return;

    if (!user) {
      router.replace(
        role === "admin" ? ROUTES.ADMIN_LOGIN : ROUTES.LOGIN,
      );
      return;
    }

    if (!hasAccess) {
      router.replace(
        user.type === "admin" ? ROUTES.ADMIN_LOGIN : ROUTES.LOGIN,
      );
    }
  }, [initialized, user, hasAccess, role, router]);

  if (!initialized || !user || !hasAccess) {
    return null;
  }

  return <>{children}</>;
}
export type UserType = "user" | "admin";
export type AdminRole = string;

export interface GroupedPermission {
  module: string;
  actions: string[];
}

interface AuthUserBase {
  id: string;
  type: UserType;
  name: string | null;
  avatar: string | null;
  role: string;
  roleId?: string;
  isActive?: boolean;
  permissions: GroupedPermission[];
}

export interface UserAuth extends AuthUserBase {
  type: "user";
  mobile: string;
}

export interface AdminAuth extends AuthUserBase {
  type: "admin";
  username?: string;
  mobile?: never;
}

export type AuthUser = UserAuth | AdminAuth;

export interface AuthState {
  user: AuthUser | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  initialized: boolean;
}
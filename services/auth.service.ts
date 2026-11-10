import api from "./api";

import type {
  AdminAuth,
  AuthUser,
  UserAuth,
} from "@/auth/types";

interface ApiProfile {
  id: string;
  type?: "user" | "admin";
  mobile?: string;
  username?: string;
  name?: string | null;
  avatar?: string | null;
  role?: string | { code?: string };
  roleId?: string;
  isActive?: boolean;
  permissions?: Array<{
    module: string;
    actions: string[];
  }>;
}

interface AuthApiResponse {
  success: boolean;
  message: string;
  data: {
    user?: ApiProfile;
    admin?: ApiProfile;
    accessToken?: string;
  };
}

export interface RestoreResponse {
  user: AuthUser;
  accessToken: string;
}

const normalizeProfile = (
  profile: ApiProfile,
  expectedType?: "user" | "admin",
): AuthUser => {
  const type = profile.type ?? expectedType;

  if (type !== "user" && type !== "admin") {
    throw new Error("نوع حساب در پاسخ API معتبر نیست.");
  }

  if (expectedType && type !== expectedType) {
    throw new Error("نوع حساب پاسخ API با درخواست مطابقت ندارد.");
  }

  const role =
    typeof profile.role === "string"
      ? profile.role
      : profile.role?.code;

  if (!role) {
    throw new Error("کد نقش در پاسخ API وجود ندارد.");
  }

  const permissions = profile.permissions ?? [];

  const common = {
    id: profile.id,
    type,
    name: profile.name ?? null,
    avatar: profile.avatar ?? null,
    role,
    roleId: profile.roleId,
    isActive: profile.isActive,
    permissions,
  };

  if (type === "user") {
    if (!profile.mobile) {
      throw new Error("شماره موبایل در پاسخ API وجود ندارد.");
    }

    return {
      ...common,
      type: "user",
      mobile: profile.mobile,
    } satisfies UserAuth;
  }

  return {
    ...common,
    type: "admin",
    username: profile.username,
  } satisfies AdminAuth;
};

const getAuthData = (
  data: AuthApiResponse["data"],
  expectedType?: "user" | "admin",
): RestoreResponse => {
  if (
    typeof data.accessToken !== "string" ||
    data.accessToken.length === 0
  ) {
    throw new Error("Access Token در پاسخ API وجود ندارد.");
  }

  if (data.user && data.admin) {
    throw new Error("پاسخ API شامل دو حساب است.");
  }

  const profile = data.user ?? data.admin;

  if (!profile) {
    throw new Error("اطلاعات حساب در پاسخ API وجود ندارد.");
  }

  return {
    user: normalizeProfile(profile, expectedType),
    accessToken: data.accessToken,
  };
};

export const authService = {
  async requestOtp(data: { mobile: string }): Promise<void> {
    await api.post("/auth/user/request-otp", data);
  },

  async verifyOtp(data: {
    mobile: string;
    code: string;
  }): Promise<RestoreResponse> {
    const response = await api.post<AuthApiResponse>(
      "/auth/user/verify-otp",
      data,
    );

    return getAuthData(response.data.data, "user");
  },

  async adminLogin(data: {
    username: string;
    password: string;
  }): Promise<RestoreResponse> {
    const response = await api.post<AuthApiResponse>(
      "/auth/admin/login",
      data,
    );

    return getAuthData(response.data.data, "admin");
  },

  async refresh(): Promise<RestoreResponse> {
    const response = await api.post<AuthApiResponse>(
      "/auth/refresh",
    );

    return getAuthData(response.data.data);
  },

  async restore(): Promise<RestoreResponse> {
    return this.refresh();
  },

  async getUserMe() {
    const response = await api.get("/users/me");
    return response.data;
  },

  async getAdminMe() {
    const response = await api.get("/admins/me");
    return response.data;
  },

  async logout(): Promise<void> {
    await api.post("/auth/logout");
  },
};
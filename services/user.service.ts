import api from "./api";

/* =========================================================
   TYPES
========================================================= */

export interface UserRole {
  id: string;
  name: string;
  code: string;
}

export interface UserProfile {
  id?: string;
  userId?: string;
  businessName?: string | null;
  contactName?: string | null;
  contactPosition?: string | null;
  contactPhone?: string | null;
  organizationEmail?: string | null;
  website?: string | null;
  city?: string | null;
  country?: string | null;
  address?: string | null;
  logo?: string | null;
}

export interface User {
  id: string;
  email: string;
  name: string | null;
  avatar: string | null;
  googleId: string | null;
  isActive: boolean;
  roleId?: string | null;
  roleRelation?: UserRole | null;
  createdAt: string;
  updatedAt: string;
  profile?: UserProfile | null;
}

export interface AdminUser extends User {
  profile: UserProfile | null;
}

export interface AdminUpdateUserData {
  email?: string;
  name?: string;
  avatar?: string;
  password?: string;
  isActive?: boolean;
  roleId?: string;
}

export interface UpdateUserData {
  email?: string;
  name?: string;
  avatar?: string;
}

export interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
}

export interface DeleteUserResponse {
  id: string;
}

/* =========================================================
   RESPONSE HANDLER
========================================================= */

function unwrapResponse<T>(responseData: unknown): T {
  if (
    responseData !== null &&
    typeof responseData === "object" &&
    "data" in responseData
  ) {
    return (responseData as { data: T }).data;
  }

  return responseData as T;
}

/* =========================================================
   USER SERVICE
========================================================= */

export const userService = {
  // دریافت تمام کاربران برای پنل ادمین
  async getAll(): Promise<AdminUser[]> {
    const response = await api.get("/admin/users");
    return unwrapResponse<AdminUser[]>(response.data);
  },

  // دریافت جزئیات یک کاربر
  async getOne(id: string): Promise<AdminUser> {
    const response = await api.get(`/admin/users/${id}`);
    return unwrapResponse<AdminUser>(response.data);
  },

  // ویرایش کاربر توسط ادمین
  async updateByAdmin(
    id: string,
    data: AdminUpdateUserData,
  ): Promise<AdminUser> {
    const response = await api.patch(`/admin/users/${id}`, data);
    return unwrapResponse<AdminUser>(response.data);
  },

  // حذف کاربر توسط ادمین
  async deleteByAdmin(id: string): Promise<DeleteUserResponse> {
    const response = await api.delete(`/admin/users/${id}`);
    return unwrapResponse<DeleteUserResponse>(response.data);
  },

  // دریافت اطلاعات کاربر واردشده
  async getMe(): Promise<User> {
    const response = await api.get("/users/me");
    return unwrapResponse<User>(response.data);
  },

  // ویرایش اطلاعات کاربر واردشده
  async updateMe(data: UpdateUserData): Promise<User> {
    const response = await api.patch("/users/me", data);
    return unwrapResponse<User>(response.data);
  },

  // تغییر رمز عبور کاربر واردشده
  async changePassword(data: ChangePasswordData): Promise<void> {
    await api.patch("/users/me/password", data);
  },
};

/* =========================================================
   LOGIN METHOD
========================================================= */

// وجود googleId یعنی حساب به گوگل متصل است؛
// لزوماً به معنی انحصاری بودن روش ورود با گوگل نیست.
export function getUserLoginMethod(
  user: Pick<User, "googleId">,
): string {
  return user.googleId
    ? "حساب متصل به گوگل"
    : "ایمیل و رمز عبور";
}
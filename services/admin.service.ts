
import api from "./api";

// =========================================================
// TYPES
// =========================================================

export interface AdminRole {
  id: string;
  code: string;
  name: string;
}

export interface Admin {
  id: string;
  username: string;
  name: string;
  avatar: string | null;
  bio: string | null;
  categories: string[] | null;
  socialLinks: Record<string, string> | null;
  roleId: string;
  roleRelation?: AdminRole | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateAdminData {
  username: string;
  password: string;
  name: string;
  roleId: string;
  avatar?: string;
  bio?: string;
  categories?: string[];
  socialLinks?: Record<string, string>;
}

export interface UpdateAdminData {
  name?: string;
  avatar?: string;
  roleId?: string;
  bio?: string;
  categories?: string[];
  socialLinks?: Record<string, string>;
  isActive?: boolean;
}

// اطلاعات عمومی منتور
export interface Mentor {
  id: string;
  name: string;
  avatar: string | null;
  bio: string | null;
  categories: string[] | null;
  socialLinks: Record<string, string> | null;
}


// تغییر نام کاربری
export interface ChangeUsernameData {
  username: string;
}

// تغییر رمز عبور
export interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
}

// =========================================================
// ADMIN SERVICE
// =========================================================

export const adminService = {
  // -------------------------------------------------------
  // دریافت فهرست تمام ادمین‌ها
  // GET /admins
  // -------------------------------------------------------

  async getAll(): Promise<Admin[]> {
    const response = await api.get("/admins");
    return response.data.data;
  },

  // -------------------------------------------------------
  // دریافت فهرست ادمین‌هایی که نقش منتور دارند
  // GET /admins/mentors
  // -------------------------------------------------------

async getAllMentorAdmins(): Promise<Admin[]> {
  const response = await api.get("/admins/mentors");
  return response.data.data;
},

  // -------------------------------------------------------
  // دریافت اطلاعات یک ادمین
  // GET /admins/:id
  // -------------------------------------------------------

  async getOne(id: string): Promise<Admin> {
    const response = await api.get(`/admins/${id}`);
    return response.data.data;
  },

  // -------------------------------------------------------
  // ایجاد ادمین
  // POST /admins
  // -------------------------------------------------------

  async create(data: CreateAdminData): Promise<Admin> {
    const response = await api.post("/admins", data);
    return response.data.data;
  },

  // -------------------------------------------------------
  // ویرایش ادمین
  // PATCH /admins/:id
  // -------------------------------------------------------

  async update(
    id: string,
    data: UpdateAdminData,
  ): Promise<Admin> {
    const response = await api.patch(
      `/admins/${id}`,
      data,
    );

    return response.data.data;
  },

  // -------------------------------------------------------
  // تغییر نام کاربری ادمین
  // PATCH /admins/:id/username
  // -------------------------------------------------------

  async changeUsername(
    id: string,
    data: ChangeUsernameData,
  ): Promise<Admin> {
    const response = await api.patch(
      `/admins/${id}/username`,
      data,
    );

    return response.data.data;
  },

  // -------------------------------------------------------
  // تغییر رمز عبور ادمین
  // PATCH /admins/:id/password
  // -------------------------------------------------------

  async changePassword(
    id: string,
    data: ChangePasswordData,
  ): Promise<void> {
    await api.patch(
      `/admins/${id}/password`,
      data,
    );
  },

  // -------------------------------------------------------
  // فعال یا غیرفعال کردن ادمین
  // PATCH /admins/:id/status
  // -------------------------------------------------------

  async setActive(
    id: string,
    isActive: boolean,
  ): Promise<Admin> {
    const response = await api.patch(
      `/admins/${id}/status`,
      { isActive },
    );

    return response.data.data;
  },

  // -------------------------------------------------------
  // حذف ادمین
  // DELETE /admins/:id
  // -------------------------------------------------------

  async remove(id: string): Promise<Admin> {
    const response = await api.delete(`/admins/${id}`);
    return response.data.data;
  },

  // =======================================================
  // MENTORS
  // =======================================================

  // -------------------------------------------------------
  // دریافت منتورها برای پنل کاربر
  // GET /mentors
  // نیازمند توکن کاربر
  // -------------------------------------------------------

  async getAllMentors(): Promise<Mentor[]> {
    const response = await api.get("/mentors");
    return response.data.data;
  },

  // -------------------------------------------------------
  // دریافت عمومی فهرست منتورها
  // GET /public/mentors
  // بدون نیاز به توکن
  // -------------------------------------------------------

  async getPublicMentors(): Promise<Mentor[]> {
    const response = await api.get("/public/mentors");
    return response.data.data;
  },
};

export default adminService;

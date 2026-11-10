import api from "./api";

// =========================
// Permission
// =========================

export interface Permission {
  id: string;

  code: string;

  name: string;

  module: string;

  description: string | null;

  isSystem: boolean;

  isActive: boolean;

  createdAt: string;

  updatedAt: string;

  _count?: {
    roles: number;
  };
}

// =========================
// Create Permission
// =========================

export interface CreatePermissionData {
  code: string;

  name: string;

  module: string;

  description?: string;

  isActive?: boolean;
}

// =========================
// Update Permission
// =========================

export interface UpdatePermissionData {
  code?: string;

  name?: string;

  module?: string;

  description?: string;

  isActive?: boolean;
}

// =========================
// Permission Service
// =========================

export const permissionService = {
  // =========================
  // Admin
  // =========================

  /**
   * Get all permissions
   *
   * Returns:
   * Permission[]
   */
  async getAll(): Promise<Permission[]> {
    const response = await api.get("/admin/permissions");

    return response.data.data;
  },

  /**
   * Get one permission by ID
   *
   * Returns:
   * Permission
   */
  async getOne(id: string): Promise<Permission> {
    const response = await api.get(
      `/admin/permissions/${id}`,
    );

    return response.data.data;
  },

  /**
   * Create a new permission
   *
   * Data:
   * code
   * name
   * module
   * description?
   * isActive?
   */
  async create(
    data: CreatePermissionData,
  ): Promise<Permission> {
    const response = await api.post(
      "/admin/permissions",
      data,
    );

    return response.data.data;
  },

  /**
   * Update an existing permission
   *
   * System permissions cannot be updated.
   */
  async update(
    id: string,
    data: UpdatePermissionData,
  ): Promise<Permission> {
    const response = await api.patch(
      `/admin/permissions/${id}`,
      data,
    );

    return response.data.data;
  },

  /**
   * Delete a permission
   *
   * System permissions cannot be deleted.
   */
  async remove(id: string): Promise<Permission> {
    const response = await api.delete(
      `/admin/permissions/${id}`,
    );

    return response.data.data;
  },
};
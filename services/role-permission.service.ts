import api from "./api";

// =========================
// Role
// =========================

export interface RolePermissionRole {
  id: string;

  code: string;

  name: string;

  description: string | null;

  isSystem: boolean;

  isActive: boolean;
}

// =========================
// Permission
// =========================

export interface RolePermissionPermission {
  id: string;

  code: string;

  name: string;

  module: string;

  description: string | null;

  isSystem: boolean;

  isActive: boolean;
}

// =========================
// Role Permission
// =========================

export interface RolePermission {
  roleId: string;

  permissionId: string;

  createdAt: string;

  role?: RolePermissionRole;

  permission?: RolePermissionPermission;
}

// =========================
// Create Role Permission
// =========================

export interface CreateRolePermissionData {
  roleId: string;

  permissionId: string;
}

// =========================
// Delete Role Permission
// =========================

export interface DeleteRolePermissionData {
  roleId: string;

  permissionId: string;
}

// =========================
// Role Permissions Service
// =========================

export const rolePermissionService = {
  // =========================
  // Assign Permission To Role
  // =========================

  /**
   * Assign a permission to a role
   *
   * POST /admin/role-permissions
   */
  async create(
    data: CreateRolePermissionData,
  ): Promise<RolePermission> {
    const response = await api.post(
      "/admin/role-permissions",
      data,
    );

    return response.data.data;
  },

  // =========================
  // Get Permissions Of A Role
  // =========================

  /**
   * Get all permissions assigned to a role
   *
   * GET /admin/role-permissions/role/:roleId
   */
  async getByRole(
    roleId: string,
  ): Promise<RolePermission[]> {
    const response = await api.get(
      `/admin/role-permissions/role/${roleId}`,
    );

    return response.data.data;
  },

  // =========================
  // Get Roles Of A Permission
  // =========================

  /**
   * Get all roles assigned to a permission
   *
   * GET /admin/role-permissions/permission/:permissionId
   */
  async getByPermission(
    permissionId: string,
  ): Promise<RolePermission[]> {
    const response = await api.get(
      `/admin/role-permissions/permission/${permissionId}`,
    );

    return response.data.data;
  },

  // =========================
  // Remove Permission From Role
  // =========================

  /**
   * Remove a permission from a role
   *
   * DELETE /admin/role-permissions
   */
  async remove(
    data: DeleteRolePermissionData,
  ): Promise<{
    roleId: string;
    permissionId: string;
  }> {
    const response = await api.delete(
      "/admin/role-permissions",
      {
        data,
      },
    );

    return response.data.data;
  },
};

export default rolePermissionService;
import api from "./api";

// =========================
// Role
// =========================

export interface Role {
    id: string;

    code: string;

    name: string;

    description: string | null;

    isSystem: boolean;

    isActive: boolean;

    createdAt: string;

    updatedAt: string;

    _count?: {
        users: number;

        admins: number;

        permissions: number;
    };
}

// =========================
// Create Role
// =========================

export interface CreateRoleData {
    code: string;

    name: string;

    description?: string;

    isActive?: boolean;
}

// =========================
// Update Role
// =========================

export interface UpdateRoleData {
    code?: string;

    name?: string;

    description?: string;

    isActive?: boolean;
}

// =========================
// Role Service
// =========================

export const roleService = {
    // =========================
    // Admin
    // =========================

    /**
     * Get all roles
     *
     * Returns:
     * Role[]
     */
    async getAll(): Promise<Role[]> {
        const response = await api.get("/admin/roles");

        return response.data.data;
    },

    /**
     * Get one role by ID
     *
     * Returns:
     * Role + users count + admins count + permissions count
     */
    async getOne(id: string): Promise<Role> {
        const response = await api.get(`/admin/roles/${id}`);

        return response.data.data;
    },

    /**
     * Create a new role
     *
     * Data:
     * code
     * name
     * description?
     * isActive?
     */
    async create(data: CreateRoleData): Promise<Role> {
        const response = await api.post(
            "/admin/roles",
            data,
        );

        return response.data.data;
    },

    /**
     * Update an existing role
     *
     * System roles cannot be updated.
     */
    async update(
        id: string,
        data: UpdateRoleData,
    ): Promise<Role> {
        const response = await api.patch(
            `/admin/roles/${id}`,
            data,
        );

        return response.data.data;
    },

    /**
     * Delete a role
     *
     * System roles cannot be deleted.
     */
    async remove(id: string): Promise<Role> {
        const response = await api.delete(
            `/admin/roles/${id}`,
        );

        return response.data.data;
    },
};
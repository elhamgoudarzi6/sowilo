
"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
    Plus,
    Search,
    Eye,
    Pencil,
    Trash2,
    ChevronLeft,
    ChevronRight,
    ShieldCheck,
    KeyRound,
    Layers3,
    LockKeyhole,
    RefreshCw,
} from "lucide-react";

import BaseModal from "@/app/ui/base-modal";
import BaseSelect from "@/app/ui/base-select";
import BaseMultiSelect from "@/app/ui/base-multi-select";

import { roleService, type Role } from "@/services/role.service";
import {
    permissionService,
    type Permission,
} from "@/services/permission.service";
import rolePermissionService, {
    type RolePermission,
} from "@/services/role-permission.service";

type ModalMode = "create" | "edit" | "view" | "delete" | null;

interface AssignmentRow {
    roleId: string;
    permissionId: string;
    createdAt: string;
    role: Role;
    permission: Permission;
}

const PAGE_SIZE = 10;

function formatDate(date?: string) {
    if (!date) return "—";

    return new Intl.DateTimeFormat("fa-IR", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
    }).format(new Date(date));
}

function getErrorMessage(error: unknown): string {
    if (
        typeof error === "object" &&
        error !== null &&
        "response" in error
    ) {
        const response = (error as {
            response?: { data?: { message?: string } };
        }).response;

        if (response?.data?.message) {
            return response.data.message;
        }
    }

    if (error instanceof Error) return error.message;

    return "خطایی رخ داد. لطفاً دوباره تلاش کنید.";
}

function StatCard({
    title,
    value,
    icon: Icon,
    description,
}: {
    title: string;
    value: number;
    icon: typeof ShieldCheck;
    description: string;
}) {
    return (
        <div className="flex items-center gap-4 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-(--primary-color)/10 text-(--primary-color)">
                <Icon size={22} />
            </div>
            <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                    <p className="text-sm font-semibold text-gray-900">{title}</p>
                    <span className="text-xl font-bold text-gray-900">
                        {value.toLocaleString("fa-IR")}
                    </span>
                </div>
                <p className="mt-1 text-xs text-gray-400">{description}</p>
            </div>
        </div>
    );
}

function StatusBadge({ active }: { active: boolean }) {
    return (
        <span
            className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${active
                ? "bg-green-50 text-green-700"
                : "bg-gray-100 text-gray-600"
                }`}
        >
            {active ? "فعال" : "غیرفعال"}
        </span>
    );
}

function RoleTypeBadge({ isSystem }: { isSystem: boolean }) {
    return (
        <span
            className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${isSystem
                ? "bg-amber-50 text-amber-700"
                : "bg-blue-50 text-blue-700"
                }`}
        >
            {isSystem ? "سیستمی" : "سفارشی"}
        </span>
    );
}

function ActionButton({
    title,
    onClick,
    children,
    disabled = false,
}: {
    title: string;
    onClick: () => void;
    children: React.ReactNode;
    disabled?: boolean;
}) {
    return (
        <button
            type="button"
            title={title}
            aria-label={title}
            onClick={onClick}
            disabled={disabled}
            className="rounded-lg p-2 text-gray-500 transition hover:bg-gray-100 hover:text-gray-900 disabled:cursor-not-allowed disabled:opacity-40"
        >
            {children}
        </button>
    );
}

export default function AdminRolePermissionsPage() {
    const [roles, setRoles] = useState<Role[]>([]);
    const [permissions, setPermissions] = useState<Permission[]>([]);
    const [assignments, setAssignments] = useState<AssignmentRow[]>([]);

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [loadingRolePermissions, setLoadingRolePermissions] =
        useState(false);

    const [pageError, setPageError] = useState("");
    const [modalError, setModalError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    const [modalMode, setModalMode] = useState<ModalMode>(null);
    const [activeRow, setActiveRow] = useState<AssignmentRow | null>(null);

    const [selectedRoleId, setSelectedRoleId] = useState("");
    const [selectedPermissionIds, setSelectedPermissionIds] = useState<
        string[]
    >([]);
    const [initialPermissionIds, setInitialPermissionIds] = useState<
        string[]
    >([]);

    const [search, setSearch] = useState("");
    const [roleTypeFilter, setRoleTypeFilter] = useState("all");
    const [statusFilter, setStatusFilter] = useState("all");
    const [moduleFilter, setModuleFilter] = useState("all");
    const [currentPage, setCurrentPage] = useState(1);

    const loadData = useCallback(async () => {
        setLoading(true);
        setPageError("");

        try {
            // دریافت همه Roleها و Permissionها
            const [rolesData, permissionsData] = await Promise.all([
                roleService.getAll(),
                permissionService.getAll(),
            ]);

            setRoles(rolesData);
            setPermissions(permissionsData);

            // چون سرویس RolePermission متد getAll ندارد،
            // انتساب‌های هر Role را با getByRole دریافت می‌کنیم.
            const assignmentsByRole = await Promise.all(
                rolesData.map((role) => rolePermissionService.getByRole(role.id)),
            );

            const roleMap = new Map(rolesData.map((role) => [role.id, role]));
            const permissionMap = new Map(
                permissionsData.map((permission) => [
                    permission.id,
                    permission,
                ]),
            );

            const rows: AssignmentRow[] = assignmentsByRole
                .flat()
                .flatMap((item: RolePermission) => {
                    const role = roleMap.get(item.roleId);
                    const permission = permissionMap.get(item.permissionId);

                    if (!role || !permission) return [];

                    return [
                        {
                            roleId: item.roleId,
                            permissionId: item.permissionId,
                            createdAt: item.createdAt,
                            role,
                            permission,
                        },
                    ];
                });

            setAssignments(rows);
        } catch (error) {
            setPageError(getErrorMessage(error));
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        void loadData();
    }, [loadData]);

    const selectedRole = useMemo(
        () => roles.find((role) => role.id === selectedRoleId),
        [roles, selectedRoleId],
    );

    const modules = useMemo(
        () =>
            Array.from(
                new Set(permissions.map((permission) => permission.module)),
            ).sort(),
        [permissions],
    );

    const filteredAssignments = useMemo(() => {
        const normalizedSearch = search.trim().toLowerCase();

        return assignments.filter((item) => {
            const matchesSearch =
                !normalizedSearch ||
                item.role.name.toLowerCase().includes(normalizedSearch) ||
                item.role.code.toLowerCase().includes(normalizedSearch) ||
                item.permission.name.toLowerCase().includes(normalizedSearch) ||
                item.permission.code.toLowerCase().includes(normalizedSearch) ||
                item.permission.module.toLowerCase().includes(normalizedSearch);

            const matchesRoleType =
                roleTypeFilter === "all" ||
                (roleTypeFilter === "system" && item.role.isSystem) ||
                (roleTypeFilter === "custom" && !item.role.isSystem);

            const isActive = item.role.isActive && item.permission.isActive;

            const matchesStatus =
                statusFilter === "all" ||
                (statusFilter === "active" && isActive) ||
                (statusFilter === "inactive" && !isActive);

            const matchesModule =
                moduleFilter === "all" ||
                item.permission.module === moduleFilter;

            return (
                matchesSearch &&
                matchesRoleType &&
                matchesStatus &&
                matchesModule
            );
        });
    }, [
        assignments,
        search,
        roleTypeFilter,
        statusFilter,
        moduleFilter,
    ]);

    const totalPages = Math.max(
        1,
        Math.ceil(filteredAssignments.length / PAGE_SIZE),
    );

    const paginatedAssignments = filteredAssignments.slice(
        (currentPage - 1) * PAGE_SIZE,
        currentPage * PAGE_SIZE,
    );

    const stats = useMemo(() => {
        const assignedRoleIds = new Set(
            assignments.map((item) => item.roleId),
        );

        return {
            total: assignments.length,
            roles: assignedRoleIds.size,
            system: assignments.filter((item) => item.role.isSystem).length,
            custom: assignments.filter((item) => !item.role.isSystem).length,
        };
    }, [assignments]);

    function resetModal() {
        setModalMode(null);
        setActiveRow(null);
        setSelectedRoleId("");
        setSelectedPermissionIds([]);
        setInitialPermissionIds([]);
        setModalError("");
        setLoadingRolePermissions(false);
    }

    function openCreateModal() {
        setActiveRow(null);
        setSelectedRoleId("");
        setSelectedPermissionIds([]);
        setInitialPermissionIds([]);
        setModalError("");
        setSuccessMessage("");
        setModalMode("create");
    }

    function openEditModal(row: AssignmentRow) {
        if (row.role.isSystem) return;

        const assignedIds = assignments
            .filter((item) => item.roleId === row.roleId)
            .map((item) => item.permissionId);

        setActiveRow(row);
        setSelectedRoleId(row.roleId);
        setSelectedPermissionIds(assignedIds);
        setInitialPermissionIds(assignedIds);
        setModalError("");
        setSuccessMessage("");
        setModalMode("edit");
    }

    function openViewModal(row: AssignmentRow) {
        setActiveRow(row);
        setModalError("");
        setModalMode("view");
    }

    function openDeleteModal(row: AssignmentRow) {
        if (row.role.isSystem) return;

        setActiveRow(row);
        setModalError("");
        setSuccessMessage("");
        setModalMode("delete");
    }

    async function handleRoleChange(roleId: string) {
        setSelectedRoleId(roleId);
        setModalError("");

        if (!roleId) {
            setSelectedPermissionIds([]);
            setInitialPermissionIds([]);
            return;
        }

        setLoadingRolePermissions(true);

        try {
            // Permissionهای فعلی Role انتخاب‌شده را می‌خوانیم
            const existingAssignments =
                await rolePermissionService.getByRole(roleId);

            const existingIds = existingAssignments.map(
                (item) => item.permissionId,
            );

            setSelectedPermissionIds(existingIds);
            setInitialPermissionIds(existingIds);
        } catch (error) {
            setModalError(getErrorMessage(error));
        } finally {
            setLoadingRolePermissions(false);
        }
    }

    async function handleSaveAssignments() {
        if (!selectedRoleId) {
            setModalError("ابتدا یک نقش انتخاب کنید.");
            return;
        }

        if (selectedRole?.isSystem) {
            setModalError("امکان تغییر انتساب‌های نقش سیستمی وجود ندارد.");
            return;
        }

        if (modalMode === "create" && selectedPermissionIds.length === 0) {
            setModalError("حداقل یک مجوز انتخاب کنید.");
            return;
        }

        setSaving(true);
        setModalError("");
        setSuccessMessage("");

        try {
            // اطلاعات فعلی را دوباره از API می‌گیریم تا اختلاف‌ها دقیق باشد.
            const currentAssignments =
                await rolePermissionService.getByRole(selectedRoleId);

            const currentIds = new Set(
                currentAssignments.map((item) => item.permissionId),
            );
            const selectedIds = new Set(selectedPermissionIds);

            const permissionIdsToAdd = [...selectedIds].filter(
                (id) => !currentIds.has(id),
            );

            const permissionIdsToRemove = [...currentIds].filter(
                (id) => !selectedIds.has(id),
            );

            // ثبت انتساب‌های جدید
            await Promise.all(
                permissionIdsToAdd.map((permissionId) =>
                    rolePermissionService.create({
                        roleId: selectedRoleId,
                        permissionId,
                    }),
                ),
            );

            // حذف انتساب‌هایی که از انتخاب خارج شده‌اند
            await Promise.all(
                permissionIdsToRemove.map((permissionId) =>
                    rolePermissionService.remove({
                        roleId: selectedRoleId,
                        permissionId,
                    }),
                ),
            );

            resetModal();
            setSuccessMessage("انتساب مجوزها با موفقیت ذخیره شد.");
            await loadData();
        } catch (error) {
            setModalError(getErrorMessage(error));

            // اگر بخشی از عملیات موفق شده باشد، جدول را با سرور هماهنگ می‌کنیم.
            await loadData();
        } finally {
            setSaving(false);
        }
    }

    async function handleDeleteAssignment() {
        if (!activeRow) return;
        if (activeRow.role.isSystem) return;

        setSaving(true);
        setModalError("");

        try {
            await rolePermissionService.remove({
                roleId: activeRow.roleId,
                permissionId: activeRow.permissionId,
            });

            resetModal();
            setSuccessMessage("انتساب مجوز با موفقیت حذف شد.");
            await loadData();
        } catch (error) {
            setModalError(getErrorMessage(error));
        } finally {
            setSaving(false);
        }
    }

    const roleOptions = roles.map((role) => ({
        value: role.id,
        label: `${role.name} (${role.code})${role.isSystem ? " — سیستمی" : ""}`,
    }));

    const permissionOptions = permissions.map((permission) => ({
        value: permission.id,
        label: `${permission.name} (${permission.code}) — ${permission.module}`,
    }));

    const isFormModal = modalMode === "create" || modalMode === "edit";

    return (
        <div dir="rtl" className="space-y-6">
            {/* Header */}
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">
                        مدیریت انتساب نقش و مجوز
                    </h1>
                    <p className="mt-1 text-sm text-gray-500">
                        انتخاب نقش و تعیین مجوزهایی که به آن دسترسی دارد.
                    </p>
                </div>

                <div className="flex flex-wrap gap-2">
                    <button
                        type="button"
                        onClick={() => void loadData()}
                        disabled={loading}
                        className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:opacity-50"
                    >
          
                           <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
                    </button>

                    <button
                        type="button"
                        onClick={openCreateModal}
                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-(--primary-color) px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:opacity-90"
                    >
                        <Plus size={18} />
                        ایجاد انتساب جدید
                    </button>
                </div>
            </div>

            {/* Messages */}
            {pageError && (
                <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {pageError}
                </div>
            )}

            {successMessage && (
                <div className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
                    {successMessage}
                </div>
            )}

            {/* Statistics */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <StatCard
                    title="کل انتساب‌ها"
                    value={stats.total}
                    icon={KeyRound}
                    description="ارتباط‌ ثبت‌شده بین نقش و مجوز"
                />
                <StatCard
                    title="نقش‌های دارای مجوز"
                    value={stats.roles}
                    icon={Layers3}
                    description="نقش‌های دارای مجوز "
                />
                <StatCard
                    title="انتساب‌های سیستمی"
                    value={stats.system}
                    icon={LockKeyhole}
                    description="انتساب‌های غیرقابل ویرایش "
                />
                <StatCard
                    title="انتساب‌های سفارشی"
                    value={stats.custom}
                    icon={ShieldCheck}
                    description="انتساب‌های قابل ویرایش"
                />
            </div>

            {/* Filters */}
            <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
                <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
                    <div className="relative">
                        <Search
                            size={18}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                        />
                        <input
                            value={search}
                            onChange={(event) => {
                                setSearch(event.target.value);
                                setCurrentPage(1);
                            }}
                            placeholder="جستجوی نقش یا مجوز..."
                            className="w-full rounded-xl border border-gray-200 bg-white py-2.5 pr-10 pl-3 text-sm outline-none transition focus:border-(--primary-color)"
                        />
                    </div>

                    <BaseSelect
                        value={roleTypeFilter}
                        onChange={(value) => {
                            setRoleTypeFilter(value);
                            setCurrentPage(1);
                        }}
                        options={[
                            { value: "all", label: "همه نقش‌ها" },
                            { value: "system", label: "نقش‌های سیستمی" },
                            { value: "custom", label: "نقش‌های سفارشی" },
                        ]}
                        placeholder="نوع نقش"
                    />

                    <BaseSelect
                        value={statusFilter}
                        onChange={(value) => {
                            setStatusFilter(value);
                            setCurrentPage(1);
                        }}
                        options={[
                            { value: "all", label: "همه وضعیت‌ها" },
                            { value: "active", label: "فعال" },
                            { value: "inactive", label: "غیرفعال" },
                        ]}
                        placeholder="وضعیت"
                    />

                    <BaseSelect
                        value={moduleFilter}
                        onChange={(value) => {
                            setModuleFilter(value);
                            setCurrentPage(1);
                        }}
                        options={[
                            { value: "all", label: "همه ماژول‌ها" },
                            ...modules.map((module) => ({
                                value: module,
                                label: module,
                            })),
                        ]}
                        placeholder="ماژول مجوز"
                    />
                </div>
            </div>

            {/* Table */}
            <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        
                <div className="overflow-x-auto">
                    <table className="w-full min-w-237.5 text-right text-sm">
                        <thead className="bg-gray-50 text-xs text-gray-500">
                            <tr>
                                <th className="px-5 py-4 font-medium">نقش</th>
                                <th className="px-5 py-4 font-medium">کد نقش</th>
                                <th className="px-5 py-4 font-medium">مجوز</th>
                                <th className="px-5 py-4 font-medium">ماژول</th>
                                <th className="px-5 py-4 font-medium">نوع نقش</th>
                                <th className="px-5 py-4 font-medium">وضعیت</th>
                                <th className="px-5 py-4 font-medium">تاریخ انتساب</th>
                                <th className="px-5 py-4 text-center font-medium">
                                    عملیات
                                </th>
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-gray-100">
                            {loading ? (
                                <tr>
                                    <td
                                        colSpan={8}
                                        className="px-5 py-12 text-center text-gray-500"
                                    >
                                        در حال دریافت اطلاعات...
                                    </td>
                                </tr>
                            ) : paginatedAssignments.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan={8}
                                        className="px-5 py-12 text-center text-gray-500"
                                    >
                                        انتسابی پیدا نشد.
                                    </td>
                                </tr>
                            ) : (
                                paginatedAssignments.map((item) => (
                                    <tr
                                        key={`${item.roleId}-${item.permissionId}`}
                                        className="transition hover:bg-gray-50/70"
                                    >
                                        <td className="px-5 py-4">
                                            <div className="font-medium text-gray-900">
                                                {item.role.name}
                                            </div>
                                            <div className="mt-1 text-xs text-gray-400">
                                                {item.role.description || "بدون توضیحات"}
                                            </div>
                                        </td>

                                        <td className="px-5 py-4">
                                            <code className="rounded-md bg-gray-100 px-2 py-1 text-xs text-gray-700">
                                                {item.role.code}
                                            </code>
                                        </td>

                                        <td className="px-5 py-4">
                                            <div className="font-medium text-gray-900">
                                                {item.permission.name}
                                            </div>
                                            <div className="mt-1 text-xs text-gray-400">
                                                {item.permission.code}
                                            </div>
                                        </td>

                                        <td className="px-5 py-4 text-gray-600">
                                            {item.permission.module}
                                        </td>

                                        <td className="px-5 py-4">
                                            <RoleTypeBadge isSystem={item.role.isSystem} />
                                        </td>

                                        <td className="px-5 py-4">
                                            <StatusBadge
                                                active={
                                                    item.role.isActive && item.permission.isActive
                                                }
                                            />
                                        </td>

                                        <td className="px-5 py-4 text-gray-500">
                                            {formatDate(item.createdAt)}
                                        </td>

                                        <td className="px-5 py-4">
                                            <div className="flex items-center justify-center gap-1">
                                                <ActionButton
                                                    title="مشاهده انتساب"
                                                    onClick={() => openViewModal(item)}
                                                >
                                                    <Eye size={17} />
                                                </ActionButton>

                                                {!item.role.isSystem && (
                                                    <>
                                                        <ActionButton
                                                            title="ویرایش مجوزهای نقش"
                                                            onClick={() => openEditModal(item)}
                                                        >
                                                            <Pencil size={17} />
                                                        </ActionButton>

                                                        <ActionButton
                                                            title="حذف انتساب"
                                                            onClick={() => openDeleteModal(item)}
                                                        >
                                                            <Trash2 size={17} />
                                                        </ActionButton>
                                                    </>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>


                {/* Pagination */}
                <div className="flex flex-col items-center justify-between gap-4 border-t border-gray-100 px-5 py-4 sm:flex-row">
                    <div className="text-sm text-gray-500">
                        نمایش{" "}
                        <span className="font-medium text-gray-900">
                            {filteredAssignments.length === 0
                                ? 0
                                : (currentPage - 1) * PAGE_SIZE + 1}
                        </span>
                        {" تا "}
                        <span className="font-medium text-gray-900">
                            {Math.min(currentPage * PAGE_SIZE, filteredAssignments.length)}
                        </span>
                        {" از "}
                        <span className="font-medium text-gray-900">
                            {filteredAssignments.length}
                        </span>
                        {" انتساب"}
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            onClick={() =>
                                setCurrentPage((page) => Math.max(1, page - 1))
                            }
                            disabled={currentPage === 1 || loading}
                            className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-600 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
                            aria-label="صفحه قبلی"
                        >
                            <ChevronRight size={18} />
                        </button>

                        {Array.from({ length: totalPages }, (_, index) => index + 1)
                            .filter(
                                (page) =>
                                    page === 1 ||
                                    page === totalPages ||
                                    Math.abs(page - currentPage) <= 1,
                            )
                            .reduce<(number | "...")[]>((pages, page, index, visiblePages) => {
                                if (index > 0 && page - visiblePages[index - 1] > 1) {
                                    pages.push("...");
                                }

                                pages.push(page);
                                return pages;
                            }, [])
                            .map((page, index) =>
                                page === "..." ? (
                                    <span
                                        key={`ellipsis-${index}`}
                                        className="px-1 text-sm text-gray-400"
                                    >
                                        ...
                                    </span>
                                ) : (
                                    <button
                                        key={page}
                                        type="button"
                                        onClick={() => setCurrentPage(page)}
                                        disabled={loading}
                                        className={`flex h-9 min-w-9 items-center justify-center rounded-lg border px-3 text-sm transition ${currentPage === page
                                            ? "border-(--primary-color) bg-(--primary-color) text-white"
                                            : "border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
                                            }`}
                                    >
                                        {page}
                                    </button>
                                ),
                            )}

                        <button
                            type="button"
                            onClick={() =>
                                setCurrentPage((page) => Math.min(totalPages, page + 1))
                            }
                            disabled={currentPage === totalPages || loading}
                            className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-600 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
                            aria-label="صفحه بعدی"
                        >
                            <ChevronLeft size={18} />
                        </button>
                    </div>
                </div>

            </div>

            {/* Create / Edit Modal */}
            {isFormModal && (
                <BaseModal
                    open
                    onClose={resetModal}
                    title={
                        modalMode === "create"
                            ? "ایجاد انتساب نقش و مجوز"
                            : "ویرایش مجوزهای نقش"
                    }
                    description="نقش را انتخاب کنید و مجوزهای موردنظر را به آن اختصاص دهید."
                    size="md"
                    dir="rtl"
                    isBusy={saving}
                    closeOnBackdrop={!saving}
                    closeOnEscape={!saving}
                    bodyClassName="p-6"
                    footer={
                        <div className="flex items-center justify-start gap-3">
                            <button
                                type="button"
                                onClick={() => void handleSaveAssignments()}
                                disabled={
                                    saving ||
                                    loadingRolePermissions ||
                                    !selectedRoleId ||
                                    Boolean(selectedRole?.isSystem)
                                }
                                className="inline-flex items-center justify-center gap-2 rounded-xl bg-(--primary-color) px-5 py-2.5 text-sm font-medium text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                {saving ? "در حال ذخیره..." : "ذخیره انتساب‌ها"}
                            </button>

                            <button
                                type="button"
                                onClick={resetModal}
                                disabled={saving}
                                className="rounded-xl border border-gray-200 px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                            >
                                انصراف
                            </button>
                        </div>
                    }
                >
                    <div className="space-y-5">
                        {modalError && (
                            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                                {modalError}
                            </div>
                        )}

                        <div>
                            <label className="mb-2 block text-sm font-medium text-gray-700">
                                نقش
                            </label>

                            <BaseSelect
                                value={selectedRoleId}
                                onChange={(value) => void handleRoleChange(value)}
                                options={roleOptions}
                                placeholder="انتخاب نقش..."
                            />

                            <p className="mt-2 text-xs text-gray-500">
                                همه نقش‌ها در فهرست نمایش داده می‌شوند. نقش‌های سیستمی
                                قابل تغییر نیستند.
                            </p>
                        </div>

                        {selectedRole?.isSystem && (
                            <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
                                این نقش سیستمی است و امکان تغییر انتساب‌های آن وجود ندارد.
                            </div>
                        )}

                        <div>
                            <div className="mb-2 flex items-center justify-between gap-3">
                                <label className="block text-sm font-medium text-gray-700">
                                    مجوزها
                                </label>

                                <span className="text-xs text-gray-500">
                                    {selectedPermissionIds.length} مجوز انتخاب شده
                                </span>
                            </div>

                            <BaseMultiSelect
                                value={selectedPermissionIds}
                                onChange={setSelectedPermissionIds}
                                options={permissionOptions}
                                placeholder={
                                    loadingRolePermissions
                                        ? "در حال دریافت مجوزهای نقش..."
                                        : "انتخاب مجوزها..."
                                }
                                disabled={
                                    !selectedRoleId ||
                                    loadingRolePermissions ||
                                    Boolean(selectedRole?.isSystem)
                                }
                                ariaLabel="انتخاب مجوزهای نقش"
                            />

                            <p className="mt-2 text-xs leading-5 text-gray-500">
                                با انتخاب نقش، مجوزهای فعلی آن بارگذاری می‌شوند. بعد از
                                تغییر انتخاب‌ها، مجوزهای جدید ثبت و مجوزهای حذف‌شده از
                                انتساب خارج می‌شوند.
                            </p>
                        </div>

                        {loadingRolePermissions && (
                            <p className="text-sm text-gray-500">
                                در حال دریافت انتساب‌های فعلی نقش...
                            </p>
                        )}
                    </div>
                </BaseModal>
            )}

            {/* View Modal */}
            {modalMode === "view" && activeRow && (
                <BaseModal
                    open
                    onClose={resetModal}
                    title="جزئیات انتساب"
                    description="اطلاعات نقش و مجوز مرتبط با این انتساب"
                    size="md"
                    dir="rtl"
                    bodyClassName="p-6"
                    footer={
                        <button
                            type="button"
                            onClick={resetModal}
                            className="rounded-xl border border-gray-200 px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
                        >
                            بستن
                        </button>
                    }
                >
                    <div className="space-y-4">
                        <div className="rounded-xl border border-gray-200 p-4">
                            <p className="mb-3 text-xs font-medium text-gray-500">
                                اطلاعات نقش
                            </p>

                            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                                <div>
                                    <p className="text-xs text-gray-500">نام نقش</p>
                                    <p className="mt-1 font-medium text-gray-900">
                                        {activeRow.role.name}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-xs text-gray-500">کد نقش</p>
                                    <p className="mt-1 text-gray-800">
                                        {activeRow.role.code}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-xs text-gray-500">نوع نقش</p>
                                    <div className="mt-1">
                                        <RoleTypeBadge isSystem={activeRow.role.isSystem} />
                                    </div>
                                </div>

                                <div>
                                    <p className="text-xs text-gray-500">وضعیت نقش</p>
                                    <div className="mt-1">
                                        <StatusBadge active={activeRow.role.isActive} />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="rounded-xl border border-gray-200 p-4">
                            <p className="mb-3 text-xs font-medium text-gray-500">
                                اطلاعات مجوز
                            </p>

                            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                                <div>
                                    <p className="text-xs text-gray-500">نام مجوز</p>
                                    <p className="mt-1 font-medium text-gray-900">
                                        {activeRow.permission.name}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-xs text-gray-500">کد مجوز</p>
                                    <p className="mt-1 break-all text-gray-800">
                                        {activeRow.permission.code}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-xs text-gray-500">ماژول</p>
                                    <p className="mt-1 text-gray-800">
                                        {activeRow.permission.module}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-xs text-gray-500">وضعیت مجوز</p>
                                    <div className="mt-1">
                                        <StatusBadge active={activeRow.permission.isActive} />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div>
                            <p className="text-xs text-gray-500">تاریخ ایجاد انتساب</p>
                            <p className="mt-1 text-sm text-gray-800">
                                {formatDate(activeRow.createdAt)}
                            </p>
                        </div>
                    </div>
                </BaseModal>
            )}

            {/* Delete Confirmation Modal */}
            {modalMode === "delete" && activeRow && (
                <BaseModal
                    open
                    onClose={resetModal}
                    title="حذف انتساب"
                    description="این عملیات فقط ارتباط این مجوز با نقش انتخاب‌شده را حذف می‌کند."
                    size="sm"
                    dir="rtl"
                    isBusy={saving}
                    closeOnBackdrop={!saving}
                    closeOnEscape={!saving}
                    bodyClassName="p-6"
                    footer={
                        <div className="flex items-center gap-3">
                            <button
                                type="button"
                                onClick={() => void handleDeleteAssignment()}
                                disabled={saving}
                                className="rounded-xl bg-red-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50"
                            >
                                {saving ? "در حال حذف..." : "حذف انتساب"}
                            </button>

                            <button
                                type="button"
                                onClick={resetModal}
                                disabled={saving}
                                className="rounded-xl border border-gray-200 px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                            >
                                انصراف
                            </button>
                        </div>
                    }
                >
                    <div className="space-y-3">
                        {modalError && (
                            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                                {modalError}
                            </div>
                        )}

                        <p className="text-sm leading-6 text-gray-600">
                            آیا می‌خواهید مجوز{" "}
                            <strong className="text-gray-900">
                                {activeRow.permission.name}
                            </strong>{" "}
                            را از نقش{" "}
                            <strong className="text-gray-900">
                                {activeRow.role.name}
                            </strong>{" "}
                            حذف کنید؟
                        </p>
                    </div>
                </BaseModal>
            )}
        </div>
    );
}
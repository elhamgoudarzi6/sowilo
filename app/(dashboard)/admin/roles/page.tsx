"use client";

import {
  useEffect,
  useMemo,
  useState,
  type FormEvent,
  type ReactNode,
} from "react";

import {
  Plus,
  Search,
  Eye,
  Pencil,
  Trash2,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Shield,
  UserCog,
  KeyRound,
  RefreshCw,
} from "lucide-react";

import BaseModal from "@/app/ui/base-modal";
import BaseSelect from "@/app/ui/base-select";

import {
  roleService,
  type Role,
  type CreateRoleData,
  type UpdateRoleData,
} from "@/services/role.service";

// ======================================================
// TYPES
// ======================================================

type RoleModalMode = "create" | "edit" | "view" | "delete";
type RoleTypeFilter = "all" | "system" | "custom";
type RoleStatusFilter = "all" | "active" | "inactive";

interface RoleForm {
  code: string;
  name: string;
  description: string;
  isActive: boolean;
}

interface RoleModalProps {
  mode: "create" | "edit" | "view";
  role?: Role | null;
  onClose: () => void;
  onSave: (
    data: CreateRoleData | UpdateRoleData,
  ) => Promise<void>;
  externalError?: string;
}

const PER_PAGE = 10;

// ======================================================
// OPTIONS
// ======================================================

const roleTypeOptions = [
  { value: "all", label: "همه رول‌ها" },
  { value: "system", label: "رول‌های سیستمی" },
  { value: "custom", label: "رول‌های سفارشی" },
];

const roleStatusOptions = [
  { value: "all", label: "همه وضعیت‌ها" },
  { value: "active", label: "فعال" },
  { value: "inactive", label: "غیرفعال" },
];

// ======================================================
// HELPERS
// ======================================================

function getErrorMessage(error: unknown): string {
  const err = error as {
    response?: {
      data?: {
        message?: string | string[];
      };
    };
    message?: string;
  };

  const message = err?.response?.data?.message;

  if (Array.isArray(message)) {
    return message[0] ?? "عملیات ناموفق بود.";
  }

  return (
    message ??
    err?.message ??
    "عملیات ناموفق بود. لطفاً دوباره تلاش کنید."
  );
}

function formatDate(date?: string | null): string {
  if (!date) return "—";

  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) {
    return "—";
  }

  return parsed.toLocaleDateString("fa-IR");
}

function createRoleForm(role?: Role | null): RoleForm {
  return {
    code: role?.code ?? "",
    name: role?.name ?? "",
    description: role?.description ?? "",
    isActive: role?.isActive ?? true,
  };
}

// ======================================================
// SMALL COMPONENTS
// ======================================================

function ActionButton({
  children,
  danger = false,
  onClick,
  ariaLabel,
}: {
  children: ReactNode;
  danger?: boolean;
  onClick: () => void;
  ariaLabel: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={ariaLabel}
      title={ariaLabel}
      className={`flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 transition ${danger
        ? "hover:border-red-200 hover:bg-red-50 hover:text-red-500"
        : "hover:border-(--primary-color) hover:bg-(--primary-color)/5 hover:text-(--primary-color)"
        }`}
    >
      {children}
    </button>
  );
}

function StatCard({
  title,
  value,
  icon,
  description,
}: {
  title: string;
  value: number;
  icon: ReactNode;
  description: string;
}) {
  return (

    <div className="flex items-center gap-4 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-(--primary-color)/10 text-(--primary-color)">
        {icon}
      </div>

      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <p className="text-sm font-semibold text-gray-900">
            {title}
          </p>

          <span className="text-xl font-bold text-gray-900">
            {value.toLocaleString("fa-IR")}
          </span>
        </div>

        <p className="mt-1 text-xs text-gray-400">
          {description}
        </p>
      </div>
    </div>
  );
}

function StatusBadge({ active }: { active: boolean }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium ${active
        ? "bg-emerald-50 text-emerald-700"
        : "bg-gray-100 text-gray-500"
        }`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${active ? "bg-emerald-500" : "bg-gray-400"
          }`}
      />
      {active ? "فعال" : "غیرفعال"}
    </span>
  );
}

function RoleTypeBadge({ isSystem }: { isSystem: boolean }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium ${isSystem
        ? "bg-violet-50 text-violet-700"
        : "bg-sky-50 text-sky-700"
        }`}
    >
      {isSystem ? "سیستمی" : "سفارشی"}
    </span>
  );
}

// ======================================================
// ROLE MODAL
// ======================================================

function RoleModal({
  mode,
  role,
  onClose,
  onSave,
  externalError = "",
}: RoleModalProps) {
  const isView = mode === "view";
  const isEdit = mode === "edit";

  const [form, setForm] = useState<RoleForm>(() =>
    createRoleForm(role),
  );

  const [isSaving, setIsSaving] = useState(false);
  const [submitError, setSubmitError] = useState("");

  useEffect(() => {
    setForm(createRoleForm(role));
    setSubmitError("");
  }, [role, mode]);

  const handleChange = <K extends keyof RoleForm>(
    field: K,
    value: RoleForm[K],
  ) => {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitError("");

    if (isView) return;

    const code = form.code.trim();
    const name = form.name.trim();
    const description = form.description.trim();

    if (!code) {
      setSubmitError("کد رول را وارد کنید.");
      return;
    }

    if (!/^[a-zA-Z0-9_-]+$/.test(code)) {
      setSubmitError(
        "کد رول فقط می‌تواند شامل حروف انگلیسی، عدد، خط تیره و زیرخط باشد.",
      );
      return;
    }

    if (!name) {
      setSubmitError("نام رول را وارد کنید.");
      return;
    }

    const payload = {
      code,
      name,
      description: description || undefined,
      isActive: form.isActive,
    };

    try {
      setIsSaving(true);
      await onSave(payload);
    } catch (error) {
      setSubmitError(getErrorMessage(error));
    } finally {
      setIsSaving(false);
    }
  };

  const modalTitle = isView
    ? "مشاهده رول"
    : isEdit
      ? "ویرایش رول"
      : "ایجاد رول جدید";

  return (
    <BaseModal
      open
      onClose={onClose}
      title={modalTitle}
      description={
        isView
          ? "اطلاعات و مشخصات رول انتخاب‌شده"
          : "اطلاعات رول را وارد و ذخیره کنید."
      }
      size="md"
      dir="rtl"
      isBusy={isSaving}
      closeOnBackdrop={!isSaving}
      closeOnEscape={!isSaving}
      bodyClassName="p-6"
      footer={
        <>
          <button
            type="button"
            onClick={onClose}
            disabled={isSaving}
            className="h-11 rounded-xl border border-gray-200 bg-white px-5 text-sm font-medium text-gray-600 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isView ? "بستن" : "انصراف"}
          </button>

          {!isView && (
            <button
              type="submit"
              form="role-form"
              disabled={isSaving}
              className="h-11 rounded-xl bg-(--primary-color) px-5 text-sm font-medium text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSaving
                ? "در حال ذخیره..."
                : isEdit
                  ? "ذخیره تغییرات"
                  : "ایجاد رول"}
            </button>
          )}
        </>
      }
    >
      <form
        id="role-form"
        onSubmit={handleSubmit}
        className="space-y-5"
      >
        {isView && role ? (
          <>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
                <p className="text-xs text-gray-400">نام رول</p>
                <p className="mt-2 text-sm font-semibold text-gray-800">
                  {role.name}
                </p>
              </div>

              <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
                <p className="text-xs text-gray-400">کد رول</p>
                <p
                  className="mt-2 break-all text-left text-sm font-semibold text-gray-800"
                >
                  {role.code}
                </p>
              </div>

              <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
                <p className="text-xs text-gray-400">نوع رول</p>
                <div className="mt-2">
                  <RoleTypeBadge isSystem={role.isSystem} />
                </div>
              </div>

              <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
                <p className="text-xs text-gray-400">وضعیت</p>
                <div className="mt-2">
                  <StatusBadge active={role.isActive} />
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
              <p className="text-xs text-gray-400">توضیحات</p>
              <p className="mt-2 whitespace-pre-wrap text-sm leading-7 text-gray-700">
                {role.description || "توضیحاتی ثبت نشده است."}
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="rounded-xl border border-gray-200 p-4">
                <p className="text-xs text-gray-400">کاربران</p>
                <p className="mt-2 text-lg font-semibold text-gray-800">
                  {role._count?.users?.toLocaleString("fa-IR") ?? "—"}
                </p>
              </div>

              <div className="rounded-xl border border-gray-200 p-4">
                <p className="text-xs text-gray-400">ادمین‌ها</p>
                <p className="mt-2 text-lg font-semibold text-gray-800">
                  {role._count?.admins?.toLocaleString("fa-IR") ?? "—"}
                </p>
              </div>

              <div className="rounded-xl border border-gray-200 p-4">
                <p className="text-xs text-gray-400">مجوزها</p>
                <p className="mt-2 text-lg font-semibold text-gray-800">
                  {role._count?.permissions?.toLocaleString("fa-IR") ?? "—"}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <p className="text-xs text-gray-400">تاریخ ایجاد</p>
                <p className="mt-2 text-sm text-gray-700">
                  {formatDate(role.createdAt)}
                </p>
              </div>

              <div>
                <p className="text-xs text-gray-400">آخرین به‌روزرسانی</p>
                <p className="mt-2 text-sm text-gray-700">
                  {formatDate(role.updatedAt)}
                </p>
              </div>
            </div>
          </>
        ) : (
          <>
            <div>
              <label className="mb-2 block text-xs font-medium text-gray-600">
                نام رول <span className="text-red-500">*</span>
              </label>

              <input
                type="text"
                value={form.name}
                onChange={(event) =>
                  handleChange("name", event.target.value)
                }
                disabled={isSaving}
                maxLength={100}
                placeholder="مثلاً مدیر محتوا"
                className="h-12 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 text-sm text-gray-700 outline-none transition placeholder:text-gray-400 focus:border-(--primary-color) focus:bg-white disabled:opacity-60"
              />
            </div>

            <div>
              <label className="mb-2 block text-xs font-medium text-gray-600">
                کد رول <span className="text-red-500">*</span>
              </label>

              <input
                type="text"
                value={form.code}
                onChange={(event) =>
                  handleChange(
                    "code",
                    event.target.value.replace(/\s/g, "").toUpperCase(),
                  )
                }
                disabled={isSaving}
                maxLength={100}
                placeholder="مثلاً content_manager"
                className="h-12 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 text-sm text-gray-700 outline-none transition placeholder:text-gray-400 focus:border-(--primary-color) focus:bg-white disabled:opacity-60"
              />

              <p className="mt-2 text-xs leading-5 text-gray-400">
                کد رول باید یکتا باشد و فقط از حروف انگلیسی، عدد،
                خط تیره یا زیرخط تشکیل شود.
              </p>
            </div>

            <div>
              <label className="mb-2 block text-xs font-medium text-gray-600">
                توضیحات
              </label>

              <textarea
                value={form.description}
                onChange={(event) =>
                  handleChange("description", event.target.value)
                }
                disabled={isSaving}
                rows={4}
                placeholder="توضیح کوتاهی درباره مسئولیت‌های این رول بنویسید."
                className="w-full resize-none rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm leading-6 text-gray-700 outline-none transition placeholder:text-gray-400 focus:border-(--primary-color) focus:bg-white disabled:opacity-60"
              />
            </div>

            <label className="flex cursor-pointer items-center justify-between gap-4 rounded-xl border border-gray-200 p-4">
              <div>
                <p className="text-sm font-medium text-gray-700">
                  فعال بودن رول
                </p>
                <p className="mt-1 text-xs leading-5 text-gray-400">
                  رول فعال می‌تواند مطابق منطق دسترسی سیستم استفاده شود.
                </p>
              </div>

              <input
                type="checkbox"
                checked={form.isActive}
                onChange={(event) =>
                  handleChange("isActive", event.target.checked)
                }
                disabled={isSaving}
                className="h-4 w-4 accent-(--primary-color)"
              />
            </label>
          </>
        )}

        {(submitError || externalError) && (
          <p
            role="alert"
            className="rounded-lg bg-red-50 px-3 py-2 text-sm leading-6 text-red-600"
          >
            {submitError || externalError}
          </p>
        )}
      </form>
    </BaseModal>
  );
}

// ======================================================
// ADMIN ROLES PAGE
// ======================================================

export default function AdminRolesPage() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [roleType, setRoleType] =
    useState<RoleTypeFilter>("all");
  const [status, setStatus] =
    useState<RoleStatusFilter>("all");
  const [page, setPage] = useState(1);

  const [selected, setSelected] = useState<Role | null>(null);
  const [mode, setMode] = useState<RoleModalMode | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // ----------------------------------------------------
  // FETCH
  // ----------------------------------------------------

  useEffect(() => {
    let active = true;

    async function fetchRoles() {
      try {
        setLoading(true);
        setError("");

        const data = await roleService.getAll();

        if (active) {
          setRoles(data ?? []);
        }
      } catch (err) {
        if (active) {
          setError(getErrorMessage(err));
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    void fetchRoles();

    return () => {
      active = false;
    };
  }, []);

  async function handleRefresh() {
    try {
      setRefreshing(true);
      setLoading(true);
      setError("");

      const data = await roleService.getAll();
      setRoles(data ?? []);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  // ----------------------------------------------------
  // FILTERS & PAGINATION
  // ----------------------------------------------------

  const filteredRoles = useMemo(() => {
    const query = search.trim().toLowerCase();

    return roles.filter((role) => {
      const matchesSearch =
        !query ||
        role.name.toLowerCase().includes(query) ||
        role.code.toLowerCase().includes(query) ||
        role.description?.toLowerCase().includes(query);

      const matchesType =
        roleType === "all" ||
        (roleType === "system" && role.isSystem) ||
        (roleType === "custom" && !role.isSystem);

      const matchesStatus =
        status === "all" ||
        (status === "active" && role.isActive) ||
        (status === "inactive" && !role.isActive);

      return matchesSearch && matchesType && matchesStatus;
    });
  }, [roles, search, roleType, status]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredRoles.length / PER_PAGE),
  );

  const currentPage = Math.min(page, totalPages);

  const paginatedRoles = useMemo(() => {
    const start = (currentPage - 1) * PER_PAGE;

    return filteredRoles.slice(start, start + PER_PAGE);
  }, [filteredRoles, currentPage]);

  // ----------------------------------------------------
  // STATS
  // ----------------------------------------------------

  const stats = useMemo(
    () => ({
      total: roles.length,
      system: roles.filter((role) => role.isSystem).length,
      active: roles.filter((role) => role.isActive).length,
      custom: roles.filter((role) => !role.isSystem).length,
    }),
    [roles],
  );

  // ----------------------------------------------------
  // MODAL CONTROL
  // ----------------------------------------------------

  function openModal(nextMode: RoleModalMode, role?: Role) {
    setError("");
    setSelected(role ?? null);
    setMode(nextMode);
  }

  function closeModal() {
    if (isDeleting) return;

    setMode(null);
    setSelected(null);
    setError("");
  }

  // ----------------------------------------------------
  // CREATE / UPDATE
  // ----------------------------------------------------

  async function handleSave(
    data: CreateRoleData | UpdateRoleData,
  ) {
    setError("");

    try {
      if (mode === "create") {
        const created = await roleService.create(
          data as CreateRoleData,
        );

        setRoles((previous) => [created, ...previous]);
        setPage(1);
      } else if (mode === "edit" && selected) {
        if (selected.isSystem) {
          throw new Error("ویرایش رول سیستمی مجاز نیست.");
        }

        const updated = await roleService.update(
          selected.id,
          data as UpdateRoleData,
        );

        setRoles((previous) =>
          previous.map((role) =>
            role.id === updated.id ? updated : role,
          ),
        );
      }

      setMode(null);
      setSelected(null);
    } catch (err) {
      const message = getErrorMessage(err);
      setError(message);
      throw err;
    }
  }

  // ----------------------------------------------------
  // DELETE
  // ----------------------------------------------------

  async function handleDelete() {
    if (!selected || selected.isSystem || isDeleting) {
      return;
    }

    try {
      setIsDeleting(true);
      setError("");

      await roleService.remove(selected.id);

      setRoles((previous) =>
        previous.filter((role) => role.id !== selected.id),
      );

      setMode(null);
      setSelected(null);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsDeleting(false);
    }
  }

  // ----------------------------------------------------
  // RENDER
  // ----------------------------------------------------

  return (
    <div className="space-y-6 pb-8">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            مدیریت رول‌ها
          </h1>
          <p className="mt-2 text-sm leading-6 text-gray-500">
            ایجاد و مدیریت رول‌ها و مشاهده وضعیت آن‌ها در سیستم.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={handleRefresh}
            disabled={refreshing || loading}
            title="بروزرسانی رول‌ها"
            aria-label="بروزرسانی رول‌ها"
            className="flex h-12 items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 text-sm font-medium text-gray-600 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <RefreshCw
              size={16}
              className={refreshing ? "animate-spin" : ""}
            />
          </button>

          <button
            type="button"
            onClick={() => openModal("create")}
            className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-(--primary-color) px-5 text-sm font-medium text-white transition hover:opacity-90"
          >
            <Plus size={18} />
            ایجاد رول جدید
          </button>
        </div>
      </div>

      {/* Error */}
      {error && !mode && (
        <div
          role="alert"
          className="flex items-center justify-between gap-3 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600"
        >
          <span>{error}</span>

          <button
            type="button"
            onClick={() => setError("")}
            className="font-medium hover:underline"
          >
            بستن
          </button>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="همه رول‌ها"
          value={stats.total}
          icon={<Shield size={22} />}
          description="تعداد کل رول‌های ثبت‌شده"
        />

        <StatCard
          title="رول‌های سیستمی"
          value={stats.system}
          icon={<ShieldCheck size={22} />}
          description="رول‌های اصلی سیستم"
        />

        <StatCard
          title="رول‌های سفارشی"
          value={stats.custom}
          icon={<UserCog size={22} />}
          description="رول‌های ایجادشده توسط مدیر"
        />

        <StatCard
          title="رول‌های فعال"
          value={stats.active}
          icon={<KeyRound size={22} />}
          description="رول‌هایی که در وضعیت فعال هستند"
        />
      </div>

      {/* Search & Filters */}
      <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
          <div className="relative">
            <Search
              size={18}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              type="text"
              value={search}
              onChange={(event) => {
                setSearch(event.target.value);
                setPage(1);
              }}
              placeholder="جستجو در نام، کد یا توضیحات رول..."
              className="h-12 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 pr-11 text-sm outline-none transition placeholder:text-gray-400 focus:border-(--primary-color) focus:bg-white focus:ring-4 focus:ring-(--primary-color)/10"
            />
          </div>

          <BaseSelect
            value={roleType}
            onChange={(value) => {
              setRoleType(value as RoleTypeFilter);
              setPage(1);
            }}
            options={roleTypeOptions}
          />

          <BaseSelect
            value={status}
            onChange={(value) => {
              setStatus(value as RoleStatusFilter);
              setPage(1);
            }}
            options={roleStatusOptions}
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-250 text-right">
            <thead className="border-b border-gray-200 bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500">
                  رول
                </th>

                <th className="px-6 py-4 text-xs font-semibold text-gray-500">
                  نوع
                </th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500">
                  کاربران
                </th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500">
                  ادمین‌ها
                </th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500">
                  مجوزها
                </th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500">
                  وضعیت
                </th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500">
                  آخرین تغییر
                </th>
                <th className="px-6 py-4 text-center text-xs font-semibold text-gray-500">
                  عملیات
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td
                    colSpan={9}
                    className="px-6 py-16 text-center text-sm text-gray-500"
                  >
                    در حال دریافت رول‌ها...
                  </td>
                </tr>
              ) : paginatedRoles.length > 0 ? (
                paginatedRoles.map((role) => (
                  <tr
                    key={role.id}
                    className="transition hover:bg-gray-50/70"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-(--primary-color)/10 text-(--primary-color)">
                          {role.isSystem ? (
                            <ShieldCheck size={20} />
                          ) : (
                            <Shield size={20} />
                          )}
                        </div>

                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-gray-800">
                            {role.name}
                          </p>
                          <p className="mt-1 text-xs font-semibold text-gray-500">
                            {role.code}
                          </p>
                          <p className="mt-1 max-w-52 truncate text-[11px] text-gray-400">
                            {role.description || "بدون توضیحات"}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <RoleTypeBadge isSystem={role.isSystem} />
                    </td>

                    <td className="px-6 py-4 text-sm text-gray-600">
                      {role._count?.users?.toLocaleString("fa-IR") ?? "—"}
                    </td>

                    <td className="px-6 py-4 text-sm text-gray-600">
                      {role._count?.admins?.toLocaleString("fa-IR") ?? "—"}
                    </td>

                    <td className="px-6 py-4 text-sm text-gray-600">
                      {role._count?.permissions?.toLocaleString("fa-IR") ?? "—"}
                    </td>

                    <td className="px-6 py-4">
                      <StatusBadge active={role.isActive} />
                    </td>

                    <td className="px-6 py-4 text-sm text-gray-500">
                      {formatDate(role.updatedAt)}
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <ActionButton
                          ariaLabel="مشاهده رول"
                          onClick={() => openModal("view", role)}
                        >
                          <Eye size={16} />
                        </ActionButton>

                        {!role.isSystem && (
                          <>
                            <ActionButton
                              ariaLabel="ویرایش رول"
                              onClick={() => openModal("edit", role)}
                            >
                              <Pencil size={16} />
                            </ActionButton>

                            <ActionButton
                              ariaLabel="حذف رول"
                              danger
                              onClick={() => openModal("delete", role)}
                            >
                              <Trash2 size={16} />
                            </ActionButton>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={9}
                    className="px-6 py-16 text-center text-sm text-gray-500"
                  >
                    رولی پیدا نشد.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination — same layout as Blog */}
        <div className="flex items-center justify-between border-t border-gray-200 px-6 py-4">
          <span className="text-sm text-gray-500">
            {filteredRoles.length.toLocaleString("fa-IR")} رول
          </span>

          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={currentPage <= 1}
              onClick={() =>
                setPage((previous) => Math.max(1, previous - 1))
              }
              aria-label="صفحه قبلی"
              className="rounded-lg border border-gray-200 p-2 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ChevronRight size={16} />
            </button>

            <span className="min-w-10 rounded-lg bg-(--primary-color) px-4 py-2 text-center text-sm text-white">
              {currentPage.toLocaleString("fa-IR")}
            </span>

            <button
              type="button"
              disabled={currentPage >= totalPages}
              onClick={() =>
                setPage((previous) =>
                  Math.min(totalPages, previous + 1),
                )
              }
              aria-label="صفحه بعدی"
              className="rounded-lg border border-gray-200 p-2 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ChevronLeft size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Create / Edit / View Modal */}
      {(mode === "create" ||
        mode === "edit" ||
        mode === "view") && (
          <RoleModal
            key={`${mode}-${selected?.id ?? "new"}`}
            mode={mode}
            role={selected}
            onClose={closeModal}
            onSave={handleSave}
            externalError={error}
          />
        )}

      {/* Delete Confirmation */}
      {mode === "delete" && selected && (
        <BaseModal
          open
          onClose={closeModal}
          title="حذف رول"
          description={`آیا از حذف رول «${selected.name}» مطمئن هستید؟`}
          size="sm"
          dir="rtl"
          isBusy={isDeleting}
          closeOnBackdrop={!isDeleting}
          closeOnEscape={!isDeleting}
          bodyClassName="p-6"
          footer={
            <>
              <button
                type="button"
                onClick={closeModal}
                disabled={isDeleting}
                className="h-11 rounded-xl border border-gray-200 px-5 text-sm text-gray-600 transition hover:bg-gray-50 disabled:opacity-50"
              >
                انصراف
              </button>

              <button
                type="button"
                onClick={() => void handleDelete()}
                disabled={isDeleting || selected.isSystem}
                className="h-11 rounded-xl bg-red-500 px-5 text-sm font-medium text-white transition hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isDeleting ? "در حال حذف..." : "حذف رول"}
              </button>
            </>
          }
        >
          <div className="space-y-3">
            <div className="flex items-start gap-3 rounded-xl bg-red-50 p-4 text-red-600">
              <Trash2 size={20} className="mt-0.5 shrink-0" />

              <p className="text-sm leading-6">
                این عملیات قابل بازگشت نیست. پیش از حذف، مطمئن شوید
                که این رول به کاربران یا ادمین‌ها اختصاص داده نشده
                است.
              </p>
            </div>

            {error && (
              <p
                role="alert"
                className="rounded-lg bg-red-50 px-3 py-2 text-sm leading-6 text-red-600"
              >
                {error}
              </p>
            )}
          </div>
        </BaseModal>
      )}
    </div>
  );
}
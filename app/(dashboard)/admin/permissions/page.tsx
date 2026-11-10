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
  KeyRound,
  Layers3,
  LockKeyhole,
  RefreshCw
} from "lucide-react";
import { PERMISSION_CATALOG } from "@/constants/permission-catalog";
import BaseModal from "@/app/ui/base-modal";
import BaseSelect from "@/app/ui/base-select";
import {
  permissionService,
  type Permission,
  type CreatePermissionData,
  type UpdatePermissionData,
} from "@/services/permission.service";

type ModalMode = "create" | "edit" | "view" | "delete";
type TypeFilter = "all" | "system" | "custom";
type StatusFilter = "all" | "active" | "inactive";

interface PermissionForm {
  code: string;
  name: string;
  module: string;
  description: string;
  isActive: boolean;
}

interface PermissionModalProps {
  mode: "create" | "edit" | "view";
  permission?: Permission | null;
  onClose: () => void;
  onSave: (
    data: CreatePermissionData | UpdatePermissionData,
  ) => Promise<void>;
  externalError?: string;
}

const PER_PAGE = 10;

const typeOptions = [
  { value: "all", label: "همه مجوزها" },
  { value: "system", label: "مجوزهای سیستمی" },
  { value: "custom", label: "مجوزهای سفارشی" },
];

const statusOptions = [
  { value: "all", label: "همه وضعیت‌ها" },
  { value: "active", label: "فعال" },
  { value: "inactive", label: "غیرفعال" },
];

function getErrorMessage(error: unknown): string {
  const err = error as {
    response?: { data?: { message?: string | string[] } };
    message?: string;
  };
  const message = err?.response?.data?.message;

  if (Array.isArray(message)) {
    return message[0] ?? "عملیات ناموفق بود.";
  }

  return message ?? err?.message ?? "عملیات ناموفق بود. لطفاً دوباره تلاش کنید.";
}

function formatDate(date?: string | null): string {
  if (!date) return "—";
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return "—";
  return parsed.toLocaleDateString("fa-IR");
}

function createPermissionForm(permission?: Permission | null): PermissionForm {
  return {
    code: permission?.code ?? "",
    name: permission?.name ?? "",
    module: permission?.module ?? "",
    description: permission?.description ?? "",
    isActive: permission?.isActive ?? true,
  };
}

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
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium ${active ? "bg-emerald-50 text-emerald-700" : "bg-gray-100 text-gray-500"
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

function PermissionTypeBadge({ isSystem }: { isSystem: boolean }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium ${isSystem ? "bg-violet-50 text-violet-700" : "bg-sky-50 text-sky-700"
        }`}
    >
      {isSystem ? "سیستمی" : "سفارشی"}
    </span>
  );
}


function PermissionModal({
  mode,
  permission,
  onClose,
  onSave,
  externalError = "",
}: PermissionModalProps) {
  const isView = mode === "view";
  const isEdit = mode === "edit";

  const [form, setForm] = useState<PermissionForm>(() =>
    createPermissionForm(permission),
  );

  const [selectedPermissionCode, setSelectedPermissionCode] = useState(
    permission?.code ?? "",
  );

  const [isSaving, setIsSaving] = useState(false);
  const [submitError, setSubmitError] = useState("");

  useEffect(() => {
    setForm(createPermissionForm(permission));
    setSelectedPermissionCode(permission?.code ?? "");
    setSubmitError("");
  }, [permission, mode]);

  const handleChange = <K extends keyof PermissionForm>(
    field: K,
    value: PermissionForm[K],
  ) => {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  // فهرست ماژول‌ها مستقیماً از کاتالوگ گرفته می‌شود.
  const moduleOptions = useMemo(
    () =>
      PERMISSION_CATALOG.map((item) => ({
        value: item.module,
        label: item.moduleLabel,
      })),
    [],
  );

  // ماژول انتخاب‌شده
  const selectedModule = PERMISSION_CATALOG.find(
    (item) => item.module === form.module,
  );

  // فقط مجوزهای متعلق به ماژول انتخاب‌شده نمایش داده می‌شوند.
  const permissionOptions = useMemo(
    () =>
      selectedModule?.permissions.map((item) => ({
        value: item.code,
        label: `${item.name} (${item.code})`,
      })) ?? [],
    [selectedModule],
  );

  // با تغییر ماژول، مجوز قبلی پاک می‌شود.
  const handleModuleChange = (module: string) => {
    setSelectedPermissionCode("");
    setSubmitError("");

    setForm((previous) => ({
      ...previous,
      module,
      code: "",
      name: "",
      description: "",
    }));
  };
  // اطلاعات مجوز از کاتالوگ پر می‌شوند، نه از دیتابیس.
  const handlePermissionSelect = (code: string) => {
    const moduleItem = PERMISSION_CATALOG.find(
      (item) => item.module === form.module,
    );

    if (!moduleItem) return;

    const catalogPermission = moduleItem.permissions.find(
      (item) => item.code === code,
    );

    if (!catalogPermission) return;

    setSelectedPermissionCode(catalogPermission.code);
    setSubmitError("");

    setForm((previous) => ({
      ...previous,
      module: moduleItem.module,
      code: catalogPermission.code,
      name: catalogPermission.name,
      description: catalogPermission.description,
    }));
  };
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitError("");

    if (isView) return;

    const module = form.module.trim();
    const code = form.code.trim();

    // مجوز باید واقعاً در کاتالوگ و زیر ماژول انتخاب‌شده وجود داشته باشد.
    const catalogPermission = PERMISSION_CATALOG
      .find((item) => item.module === module)
      ?.permissions.find((item) => item.code === code);

    if (!module) {
      setSubmitError("ابتدا ماژول را انتخاب کنید.");
      return;
    }

    if (!catalogPermission) {
      setSubmitError("لطفاً یک مجوز معتبر از فهرست انتخاب کنید.");
      return;
    }

    const payload = {
      code: catalogPermission.code,
      name: catalogPermission.name,
      module,
      description:
        form.description.trim() || undefined,
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
    ? "مشاهده مجوز"
    : isEdit
      ? "ویرایش مجوز"
      : "ایجاد مجوز جدید";

  return (
    <BaseModal
      open
      onClose={onClose}
      title={modalTitle}
      description={
        isView
          ? "اطلاعات و مشخصات مجوز انتخاب‌شده"
          : "اطلاعات مجوز را انتخاب و ذخیره کنید."
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
              form="permission-form"
              disabled={isSaving}
              className="h-11 rounded-xl bg-(--primary-color) px-5 text-sm font-medium text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSaving
                ? "در حال ذخیره..."
                : isEdit
                  ? "ذخیره تغییرات"
                  : "ایجاد مجوز"}
            </button>
          )}
        </>
      }
    >
      <form
        id="permission-form"
        onSubmit={handleSubmit}
        className="space-y-5"
      >
        {isView && permission ? (
          <>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
                <p className="text-xs text-gray-400">نام مجوز</p>
                <p className="mt-2 text-sm font-semibold text-gray-800">
                  {permission.name}
                </p>
              </div>

              <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
                <p className="text-xs text-gray-400">کد مجوز</p>
                <p

                  className="mt-2 break-all text-left text-sm font-semibold text-gray-800"
                >
                  {permission.code}
                </p>
              </div>

              <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
                <p className="text-xs text-gray-400">ماژول</p>
                <p className="mt-2 text-sm font-semibold text-gray-800">
                  {permission.module}
                </p>
              </div>

              <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
                <p className="text-xs text-gray-400">نوع مجوز</p>
                <div className="mt-2">
                  <PermissionTypeBadge isSystem={permission.isSystem} />
                </div>
              </div>

              <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
                <p className="text-xs text-gray-400">وضعیت</p>
                <div className="mt-2">
                  <StatusBadge active={permission.isActive} />
                </div>
              </div>

              <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
                <p className="text-xs text-gray-400">
                  تعداد رول‌های مرتبط
                </p>
                <p className="mt-2 text-lg font-semibold text-gray-800">
                  {permission._count?.roles?.toLocaleString("fa-IR") ?? "—"}
                </p>
              </div>
            </div>

            <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
              <p className="text-xs text-gray-400">توضیحات</p>
              <p className="mt-2 whitespace-pre-wrap text-sm leading-7 text-gray-700">
                {permission.description || "توضیحاتی ثبت نشده است."}
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <p className="text-xs text-gray-400">تاریخ ایجاد</p>
                <p className="mt-2 text-sm text-gray-700">
                  {formatDate(permission.createdAt)}
                </p>
              </div>

              <div>
                <p className="text-xs text-gray-400">
                  آخرین به‌روزرسانی
                </p>
                <p className="mt-2 text-sm text-gray-700">
                  {formatDate(permission.updatedAt)}
                </p>
              </div>
            </div>
          </>
        ) : (
          <>
            {/* ماژول: اولین فیلد فرم */}
            <div>
              <label className="mb-2 block text-xs font-medium text-gray-600">
                ماژول <span className="text-red-500">*</span>
              </label>

              <BaseSelect
                value={form.module}
                onChange={(value) =>
                  handleModuleChange(String(value))
                }
                options={moduleOptions}
                placeholder="ابتدا ماژول را انتخاب کنید"
              />
            </div>

            {/* کد مجوز: گزینه‌ها وابسته به ماژول انتخاب‌شده هستند */}
            <div>
              <label className="mb-2 block text-xs font-medium text-gray-600">
                کد مجوز <span className="text-red-500">*</span>
              </label>

              <BaseSelect
                value={selectedPermissionCode}
                onChange={(value) =>
                  handlePermissionSelect(String(value))
                }
                options={permissionOptions}
                placeholder={
                  form.module
                    ? "مجوز موردنظر را انتخاب کنید"
                    : "ابتدا ماژول را انتخاب کنید"
                }
              />

              {form.code && (
                <p
                  dir="ltr"
                  className="mt-2 text-left text-xs text-gray-400"
                >
                  {form.code}
                </p>
              )}
            </div>

            {/* نام مجوز از کاتالوگ پر می‌شود */}
            <div>
              <label className="mb-2 block text-xs font-medium text-gray-600">
                نام مجوز
              </label>

              <input
                type="text"
                value={form.name}
                readOnly
                disabled={isSaving}
                placeholder="پس از انتخاب مجوز تکمیل می‌شود"
                className="h-12 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 text-sm text-gray-700 outline-none placeholder:text-gray-400 disabled:opacity-60"
              />
            </div>

            {/* توضیحات نیز با انتخاب مجوز پر می‌شود */}
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
                placeholder="توضیحات مجوز"
                className="w-full resize-none rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm leading-6 text-gray-700 outline-none transition placeholder:text-gray-400 focus:border-(--primary-color) focus:bg-white disabled:opacity-60"
              />
            </div>

            <label className="flex cursor-pointer items-center justify-between gap-4 rounded-xl border border-gray-200 p-4">
              <div>
                <p className="text-sm font-medium text-gray-700">
                  فعال بودن مجوز
                </p>
                <p className="mt-1 text-xs leading-5 text-gray-400">
                  وضعیت فعال بودن این مجوز
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

function DeletePermissionModal({
  permission,
  onClose,
  onConfirm,
  isDeleting,
  error,
}: {
  permission: Permission;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  isDeleting: boolean;
  error: string;
}) {
  return (
    <BaseModal
      open
      onClose={onClose}
      title="حذف مجوز"
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
            onClick={onClose}
            disabled={isDeleting}
            className="h-11 rounded-xl border border-gray-200 bg-white px-5 text-sm font-medium text-gray-600 hover:bg-gray-50 disabled:opacity-50"
          >
            انصراف
          </button>
          <button
            type="button"
            onClick={() => void onConfirm()}
            disabled={isDeleting}
            className="h-11 rounded-xl bg-red-600 px-5 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50"
          >
            {isDeleting ? "در حال حذف..." : "حذف مجوز"}
          </button>
        </>
      }
    >
      <div className="space-y-4">

        <p className="text-sm leading-7 text-gray-600">
          آیا از حذف مجوز <strong className="text-gray-900">{permission.name}</strong>{" "}
          با کد <code dir="ltr">{permission.code}</code> مطمئن هستید؟
        </p>
        {permission._count?.roles ? (
          <p className="rounded-lg bg-amber-50 px-3 py-2 text-sm leading-6 text-amber-700">
            این مجوز در {permission._count.roles.toLocaleString("fa-IR")} رول
            استفاده شده است. ممکن است حذف آن با محدودیت سمت سرور مواجه شود.
          </p>
        ) : null}
        {error && (
          <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
            {error}
          </p>
        )}
      </div>
    </BaseModal>
  );
}

export default function AdminPermissionsPage() {
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [moduleFilter, setModuleFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState<TypeFilter>("all");
  const [status, setStatus] = useState<StatusFilter>("all");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<Permission | null>(null);
  const [mode, setMode] = useState<ModalMode | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    try {
      setRefreshing(true);
      await fetchPermissions();
    } finally {
      setRefreshing(false);
    }
  };
  const fetchPermissions = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await permissionService.getAll();
      setPermissions(data ?? []);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let active = true;

    async function load() {
      try {
        setLoading(true);
        setError("");
        const data = await permissionService.getAll();
        if (active) setPermissions(data ?? []);
      } catch (err) {
        if (active) setError(getErrorMessage(err));
      } finally {
        if (active) setLoading(false);
      }
    }

    void load();
    return () => {
      active = false;
    };
  }, []);

  const modules = useMemo(
    () => Array.from(new Set(permissions.map((item) => item.module).filter(Boolean))).sort((a, b) => a.localeCompare(b)),
    [permissions],
  );

  const moduleOptions = useMemo(
    () => [
      { value: "all", label: "همه ماژول‌ها" },
      ...modules.map((module) => ({ value: module, label: module })),
    ],
    [modules],
  );

  const filteredPermissions = useMemo(() => {
    const query = search.trim().toLowerCase();

    return permissions.filter((permission) => {
      const matchesSearch =
        !query ||
        permission.name.toLowerCase().includes(query) ||
        permission.code.toLowerCase().includes(query) ||
        permission.module.toLowerCase().includes(query) ||
        permission.description?.toLowerCase().includes(query);

      const matchesModule =
        moduleFilter === "all" || permission.module === moduleFilter;
      const matchesType =
        typeFilter === "all" ||
        (typeFilter === "system" && permission.isSystem) ||
        (typeFilter === "custom" && !permission.isSystem);
      const matchesStatus =
        status === "all" ||
        (status === "active" && permission.isActive) ||
        (status === "inactive" && !permission.isActive);

      return matchesSearch && matchesModule && matchesType && matchesStatus;
    });
  }, [permissions, search, moduleFilter, typeFilter, status]);

  const totalPages = Math.max(1, Math.ceil(filteredPermissions.length / PER_PAGE));
  const currentPage = Math.min(page, totalPages);
  const paginatedPermissions = filteredPermissions.slice(
    (currentPage - 1) * PER_PAGE,
    currentPage * PER_PAGE,
  );

  const stats = useMemo(
    () => ({
      total: permissions.length,
      active: permissions.filter((item) => item.isActive).length,
      system: permissions.filter((item) => item.isSystem).length,
      modules: new Set(permissions.map((item) => item.module).filter(Boolean)).size,
    }),
    [permissions],
  );

  const openModal = (nextMode: ModalMode, permission?: Permission) => {
    setSelected(permission ?? null);
    setMode(nextMode);
    setDeleteError("");
  };

  const closeModal = () => {
    if (isDeleting) return;
    setMode(null);
    setSelected(null);
    setDeleteError("");
  };

  const handleSave = async (
    data: CreatePermissionData | UpdatePermissionData,
  ) => {
    if (mode === "edit" && selected) {
      if (selected.isSystem) throw new Error("مجوز سیستمی قابل ویرایش نیست.");
      await permissionService.update(selected.id, data as UpdatePermissionData);
    } else {
      await permissionService.create(data as CreatePermissionData);
    }
    setMode(null);
    setSelected(null);
    await fetchPermissions();
  };

  const handleDelete = async () => {
    if (!selected) return;
    if (selected.isSystem) {
      setDeleteError("مجوز سیستمی قابل حذف نیست.");
      return;
    }
    try {
      setIsDeleting(true);
      setDeleteError("");
      await permissionService.remove(selected.id);
      setMode(null);
      setSelected(null);
      await fetchPermissions();
    } catch (err) {
      setDeleteError(getErrorMessage(err));
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-7xl space-y-6 pb-10">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <div>
            <h1 className="text-xl font-bold text-gray-900 sm:text-2xl">
              مدیریت مجوزها
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              مدیریت مجوزها، ماژول‌ها و وضعیت دسترسی‌ها
            </p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={handleRefresh}
            disabled={refreshing || loading}
            title="بروزرسانی مجوزها"
            aria-label="بروزرسانی مجوزها"
            className="flex h-11 items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 text-sm font-medium text-gray-600 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <RefreshCw
              size={16}
              className={refreshing ? "animate-spin" : ""}
            />
          </button>

          <button
            type="button"
            onClick={() => openModal("create")}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-(--primary-color) px-4 text-sm font-medium text-white transition hover:opacity-90"
          >
            <Plus size={18} />
            ایجاد مجوز جدید
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="کل مجوزها"
          value={stats.total}
          icon={<KeyRound size={21} />}
          description="تمام مجوزهای ثبت‌شده"
        />
        <StatCard
          title="مجوزهای فعال"
          value={stats.active}
          icon={<ShieldCheck size={21} />}
          description="مجوزهای فعال سیستم"
        />
        <StatCard
          title="مجوزهای سیستمی"
          value={stats.system}
          icon={<LockKeyhole size={21} />}
          description="مجوزهای محافظت‌شده"
        />
        <StatCard
          title="ماژول‌ها"
          value={stats.modules}
          icon={<Layers3 size={21} />}
          description="تعداد ماژول‌های دارای مجوز"
        />
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:p-5">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
          <div className="relative">
            <Search
              size={18}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              value={search}
              onChange={(event) => {
                setSearch(event.target.value);
                setPage(1);
              }}
              placeholder="جستجو نام، کد، ماژول یا توضیحات..."
              className="h-11 w-full rounded-xl border border-gray-200 bg-gray-50 pr-10 pl-4 text-sm text-gray-700 outline-none transition placeholder:text-gray-400 focus:border-(--primary-color) focus:bg-white"
            />
          </div>
          <BaseSelect
            value={moduleFilter}
            onChange={(value) => {
              setModuleFilter(String(value));
              setPage(1);
            }}
            options={moduleOptions}
            placeholder="انتخاب ماژول"
          />
          <BaseSelect
            value={typeFilter}
            onChange={(value) => {
              setTypeFilter(value as TypeFilter);
              setPage(1);
            }}
            options={typeOptions}
            placeholder="نوع مجوز"
          />
          <BaseSelect
            value={status}
            onChange={(value) => {
              setStatus(value as StatusFilter);
              setPage(1);
            }}
            options={statusOptions}
            placeholder="وضعیت"
          />
        </div>
        <div className="mt-4 flex flex-wrap items-center justify-between gap-2 text-xs text-gray-400">
          <span>
            {filteredPermissions.length.toLocaleString("fa-IR")} مجوز یافت شد
          </span>
          <button
            type="button"
            onClick={() => {
              setSearch("");
              setModuleFilter("all");
              setTypeFilter("all");
              setStatus("all");
              setPage(1);
            }}
            className="font-medium text-(--primary-color) hover:underline"
          >
            پاک کردن فیلترها
          </button>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        {error && (
          <div className="m-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <span>{error}</span>
              <button
                type="button"
                onClick={() => void fetchPermissions()}
                className="font-semibold underline"
              >
                تلاش مجدد
              </button>
            </div>
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full min-w-250 text-right">
            <thead className="border-b border-gray-100 bg-gray-50">
              <tr className="text-xs font-semibold text-gray-500">
                <th className="px-5 py-4">مجوز</th>
                <th className="px-5 py-4">کد</th>
                <th className="px-5 py-4">ماژول</th>
                <th className="px-5 py-4">نوع</th>
                <th className="px-5 py-4">رول‌های مرتبط</th>
                <th className="px-5 py-4">وضعیت</th>
                <th className="px-5 py-4">آخرین تغییر</th>
                <th className="px-5 py-4">عملیات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan={8} className="px-5 py-16 text-center text-sm text-gray-400">
                    در حال دریافت اطلاعات مجوزها...
                  </td>
                </tr>
              ) : paginatedPermissions.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-5 py-16 text-center">
                    <div className="mx-auto flex max-w-sm flex-col items-center">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gray-100 text-gray-400">
                        <KeyRound size={22} />
                      </div>
                      <p className="mt-3 text-sm font-semibold text-gray-700">
                        مجوزی پیدا نشد
                      </p>
                      <p className="mt-1 text-xs leading-6 text-gray-400">
                        عبارت جستجو یا فیلترها را تغییر دهید، یا یک مجوز جدید ایجاد کنید.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                paginatedPermissions.map((permission) => (
                  <tr key={permission.id} className="transition hover:bg-gray-50/70">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-(--primary-color)/10 text-(--primary-color)">
                          <KeyRound size={18} />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-gray-800">
                            {permission.name}
                          </p>
                          <p className="mt-1 max-w-32 truncate text-xs text-gray-400">
                            {permission.description || "بدون توضیحات"}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <code className="inline-block rounded-lg bg-gray-100 px-2.5 py-1.5 text-xs text-gray-700">
                        {permission.code}
                      </code>
                    </td>
                    <td className="px-5 py-4">
                      <span className="inline-flex rounded-lg bg-indigo-50 px-3 py-1.5 text-xs font-medium text-indigo-700">
                        {permission.module}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <PermissionTypeBadge isSystem={permission.isSystem} />
                    </td>
                    <td className="px-5 py-4 text-sm text-gray-600">
                      {permission._count?.roles?.toLocaleString("fa-IR") ?? "—"}
                    </td>
                    <td className="px-5 py-4">
                      <StatusBadge active={permission.isActive} />
                    </td>
                    <td className="px-5 py-4 text-xs text-gray-500">
                      {formatDate(permission.updatedAt)}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <ActionButton
                          ariaLabel="مشاهده مجوز"
                          onClick={() => openModal("view", permission)}
                        >
                          <Eye size={17} />
                        </ActionButton>
                        {!permission.isSystem && (
                          <>
                            <ActionButton
                              ariaLabel="ویرایش مجوز"
                              onClick={() => openModal("edit", permission)}
                            >
                              <Pencil size={17} />
                            </ActionButton>
                            <ActionButton
                              ariaLabel="حذف مجوز"
                              danger
                              onClick={() => openModal("delete", permission)}
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

        {/* Pagination — same layout as Roles */}
        <div className="flex items-center justify-between border-t border-gray-200 px-6 py-4">
          <span className="text-sm text-gray-500">
            {filteredPermissions.length.toLocaleString("fa-IR")} مجوز
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

      {mode && (mode === "create" || mode === "edit" || mode === "view") && (
        <PermissionModal
          key={`${mode}-${selected?.id ?? "new"}`}
          mode={mode}
          permission={selected}
          onClose={closeModal}
          onSave={handleSave}
          externalError={error}
        />
      )}

      {mode === "delete" && selected && (
        <DeletePermissionModal
          permission={selected}
          onClose={closeModal}
          onConfirm={handleDelete}
          isDeleting={isDeleting}
          error={deleteError}
        />
      )}
    </div>
  );
}

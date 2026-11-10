
"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ChangeEvent,
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
  Users,
  UserCheck,
  UserX,
  KeyRound,
  RefreshCw,
  UserCog,
  Link2,
  Globe,
  Send,
  Camera,
  UploadCloud,
  X,
  ExternalLink,
  CheckCircle2,
  CircleAlert,
  AtSign,
  LockKeyhole,
  UserRound,
  FolderOpen,
} from "lucide-react";

import { FiEdit3, FiUser } from "react-icons/fi";

import BaseModal from "@/app/ui/base-modal";
import BaseSelect from "@/app/ui/base-select";

import {
  adminService,
  type Admin,
  type CreateAdminData,
  type UpdateAdminData,
} from "@/services/admin.service";

import { roleService } from "@/services/role.service";
import type { Role } from "@/services/role.service";

import { fileService } from "@/services/file.service";
import { FaGithub } from "react-icons/fa";

// ======================================================
// TYPES
// ======================================================

type AdminModalMode = "create" | "edit" | "view" | "delete";

interface SocialLinkItem {
  id: string;
  type: string;
  url: string;

  /**
   * کلید اصلی برای حفظ لینک‌های قدیمی یا ناشناخته.
   * هنگام تغییر نوع لینک حذف می‌شود.
   */
  originalKey?: string;
}

interface AdminForm {
  username: string;
  password: string;
  name: string;
  roleId: string;
  avatar: string;
  bio: string;
  category: string;
  socialLinks: SocialLinkItem[];
  isActive: boolean;
  newUsername: string;
  currentPassword: string;
  newPassword: string;
}

interface AdminModalProps {
  mode: "create" | "edit" | "view";
  admin?: Admin | null;
  roles: Role[];
  onClose: () => void;
  onSave: (data: AdminForm) => Promise<void>;
  externalError?: string;
}

interface SocialLinkOption {
  value: string;
  label: string;
  placeholder: string;
  icon: ReactNode;
}

const PER_PAGE = 10;

const ALLOWED_AVATAR_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
];

const MAX_AVATAR_SIZE = 5 * 1024 * 1024;

// ======================================================
// CONFIGURATION
// ======================================================

const ADMIN_CATEGORIES = [
  {
    value: "جذب سرمایه",
    label: "جذب سرمایه",
  },
  {
    value: "مدیریت و کسب‌وکار",
    label: "مدیریت و کسب‌وکار",
  },
  {
    value: "فنی و محصول",
    label: "فنی و محصول",
  },
  {
    value: "بازاریابی و تبلیغات",
    label: "بازاریابی و تبلیغات",
  },
  {
    value: "حقوقی و قراردادها",
    label: "حقوقی و قراردادها",
  },
  {
    value: "مالی و حسابداری",
    label: "مالی و حسابداری",
  },
]



const categoryOptions = [
  { value: "", label: "انتخاب دسته‌بندی" },
  ...ADMIN_CATEGORIES,
];

const SOCIAL_LINK_OPTIONS: SocialLinkOption[] = [
  {
    value: "instagram",
    label: "اینستاگرام",
    placeholder: "https://instagram.com/username",
    icon: <Link2 size={17} />,
  },
  {
    value: "linkedin",
    label: "لینکدین",
    placeholder: "https://linkedin.com/in/username",
    icon: <Link2 size={17} />,
  },
  {
    value: "telegram",
    label: "تلگرام",
    placeholder: "https://t.me/username",
    icon: <Send size={17} />,
  },
  {
    value: "github",
    label: "گیت‌هاب",
    placeholder: "https://github.com/username",
    icon: <FaGithub size={17} />,
  },
  {
    value: "whatsapp",
    label: "واتساپ",
    placeholder: "https://wa.me/...",
    icon: <Send size={17} />,
  },
];

const socialTypeOptions = SOCIAL_LINK_OPTIONS.map((item) => ({
  value: item.value,
  label: item.label,
}));

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

function getRoleName(admin?: Admin | null): string {
  return admin?.roleRelation?.name ?? "بدون نقش";
}

function getCategoryLabel(value: string): string {
  return (
    ADMIN_CATEGORIES.find((item) => item.value === value)?.label ??
    value
  );
}

function makeId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

function isValidHttpUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

/**
 * لینک‌های ذخیره‌شده را به فرم قابل ویرایش تبدیل می‌کند.
 * کلیدهای ناشناخته و کلیدهای تکراری مانند instagram_2 حفظ می‌شوند.
 */
function parseSocialLinks(
  links: Record<string, string> | null | undefined,
): SocialLinkItem[] {
  if (!links || typeof links !== "object" || Array.isArray(links)) {
    return [];
  }

  return Object.entries(links)
    .filter(([, url]) => typeof url === "string")
    .map(([key, url]) => {
      const match = key.match(/^(.*)_\d+$/);
      const baseType = match?.[1] ?? key;

      const knownType = SOCIAL_LINK_OPTIONS.some(
        (item) => item.value === baseType,
      );

      return {
        id: makeId(),
        type: knownType ? baseType : "other",
        url,
        originalKey: key,
      };
    });
}

/**
 * کلید اصلی لینک حفظ می‌شود، مگر اینکه کاربر نوع لینک را تغییر دهد.
 * در صورت وجود کلید تکراری، پسوند عددی اضافه می‌شود.
 */
function serializeSocialLinks(
  links: SocialLinkItem[],
): Record<string, string> {
  const result: Record<string, string> = {};

  for (const link of links) {
    const url = link.url.trim();

    if (!url) continue;

    const baseKey =
      link.type === "other" && link.originalKey
        ? link.originalKey
        : link.type || "other";

    let key = baseKey;
    let index = 2;

    while (Object.prototype.hasOwnProperty.call(result, key)) {
      key = `${baseKey}_${index}`;
      index += 1;
    }

    result[key] = url;
  }

  return result;
}

function createEmptyForm(): AdminForm {
  return {
    username: "",
    password: "",
    name: "",
    roleId: "",
    avatar: "",
    bio: "",
    category: "",
    socialLinks: [],
    isActive: true,
    newUsername: "",
    currentPassword: "",
    newPassword: "",
  };
}

function createAdminForm(admin?: Admin | null): AdminForm {
  if (!admin) return createEmptyForm();

  return {
    username: admin.username ?? "",
    password: "",
    name: admin.name ?? "",
    roleId: admin.roleId ?? "",
    avatar: admin.avatar ?? "",
    bio: admin.bio ?? "",
    category: admin.categories?.[0] ?? "",
    socialLinks: parseSocialLinks(admin.socialLinks),
    isActive: admin.isActive ?? true,
    newUsername: admin.username ?? "",
    currentPassword: "",
    newPassword: "",
  };
}

// ======================================================
// SHARED UI
// ======================================================

function ModalSection({
  icon,
  title,
  description,
  children,
}: {
  icon: ReactNode;
  title: string;
  description?: string;
  children: ReactNode;
}) {
  return (
    <section className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-(--primary-color)/10 text-(--primary-color)">
          {icon}
        </div>

        <div>
          <h3 className="text-sm font-bold text-gray-900">{title}</h3>

          {description && (
            <p className="mt-1 text-xs leading-5 text-gray-400">
              {description}
            </p>
          )}
        </div>
      </div>

      {children}
    </section>
  );
}

function Field({
  label,
  required,
  hint,
  children,
}: {
  label: string;
  required?: boolean;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <div className="min-w-0">
      <label className="mb-2 block text-xs font-semibold text-gray-600">
        {label}
        {required && <span className="mr-1 text-red-500">*</span>}
      </label>

      {children}

      {hint && (
        <p className="mt-1.5 text-[11px] leading-5 text-gray-400">
          {hint}
        </p>
      )}
    </div>
  );
}

const inputClass =
  "h-12 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 text-sm text-gray-700 outline-none transition placeholder:text-gray-400 focus:border-(--primary-color) focus:bg-white focus:ring-4 focus:ring-(--primary-color)/10 disabled:cursor-not-allowed disabled:opacity-60";

const textareaClass =
  "w-full resize-y rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm leading-7 text-gray-700 outline-none transition placeholder:text-gray-400 focus:border-(--primary-color) focus:bg-white focus:ring-4 focus:ring-(--primary-color)/10 disabled:cursor-not-allowed disabled:opacity-60";

function InfoBox({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="min-w-0 rounded-xl border border-gray-200 bg-gray-50 p-4">
      <p className="text-xs text-gray-400">{label}</p>
      <p className="mt-1 break-words text-sm font-medium leading-6 text-gray-700">
        {value || "—"}
      </p>
    </div>
  );
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

// ======================================================
// SOCIAL LINKS EDITOR
// ======================================================


function SocialLinksEditor({
  links,
  onChange,
  disabled,
}: {
  links: SocialLinkItem[];
  onChange: (links: SocialLinkItem[]) => void;
  disabled: boolean;
}) {
  const [draftType, setDraftType] = useState("instagram");
  const [draftUrl, setDraftUrl] = useState("");
  const [draftError, setDraftError] = useState("");

  const selectedOption = SOCIAL_LINK_OPTIONS.find(
    (item) => item.value === draftType,
  );

  function addLink() {
    const url = draftUrl.trim();

    if (!url) {
      setDraftError("آدرس لینک را وارد کنید.");
      return;
    }

    if (!isValidHttpUrl(url)) {
      setDraftError(
        "آدرس لینک باید معتبر و با http:// یا https:// شروع شود.",
      );
      return;
    }

    onChange([
      ...links,
      {
        id: makeId(),
        type: draftType,
        url,
      },
    ]);

    setDraftType("instagram");
    setDraftUrl("");
    setDraftError("");
  }

  function removeLink(id: string) {
    onChange(links.filter((item) => item.id !== id));
  }

  return (
    <div className="space-y-4">
      {!disabled && (
        <>
          <div className="grid grid-cols-1 items-end gap-3 sm:grid-cols-[180px_minmax(0,1fr)_48px]">
            <Field label="نوع شبکه">
              <BaseSelect
                value={draftType}
                onChange={(value) => {
                  setDraftType(value);
                  setDraftError("");
                }}
                options={socialTypeOptions}
              />
            </Field>

            <Field label="آدرس لینک">
              <div className="relative">
                <Link2
                  size={16}
                  className="absolute right-4 top-4 text-gray-400"
                />

                <input
                  type="url"
                  value={draftUrl}
                  onChange={(event) => {
                    setDraftUrl(event.target.value);
                    setDraftError("");
                  }}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      event.preventDefault();
                      addLink();
                    }
                  }}
                  placeholder={
                    selectedOption?.placeholder ??
                    "https://example.com"
                  }
                  className={`${inputClass} pr-10`}
                  dir="ltr"
                />
              </div>
            </Field>

            <button
              type="button"
              onClick={addLink}
              aria-label="افزودن لینک"
              title="افزودن لینک"
              className="flex h-12 w-12 items-center justify-center rounded-xl bg-(--primary-color) text-white transition hover:opacity-90"
            >
              <Plus size={21} />
            </button>
          </div>

          {draftError && (
            <p
              role="alert"
              className="mt-3 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs leading-5 text-red-600"
            >
              {draftError}
            </p>
          )}
        </>
      )}

      {links.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-200 px-5 py-8 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gray-100 text-gray-400">
            <Globe size={22} />
          </div>

          <p className="mt-3 text-sm font-medium text-gray-600">
            هنوز لینکی ثبت نشده است
          </p>

          <p className="mt-1 text-xs leading-5 text-gray-400">
            لینک‌های شبکه‌های اجتماعی و وب‌سایت پس از افزودن در این قسمت نمایش داده می‌شوند.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {links.map((link, index) => {
            const option = SOCIAL_LINK_OPTIONS.find(
              (item) => item.value === link.type,
            );

            return (
              <div
                key={link.id}
                className="flex min-w-0 items-center gap-3 rounded-xl border border-gray-200 bg-white p-3 transition hover:border-gray-300"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-(--primary-color)/10 text-(--primary-color)">
                  {option?.icon ?? <Link2 size={17} />}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-semibold text-gray-700">
                      {option?.label ?? "سایر لینک‌ها"}
                    </span>

                    <span className="rounded-md bg-gray-100 px-2 py-0.5 text-[10px] text-gray-400">
                      لینک {index + 1}
                    </span>
                  </div>

                  <a
                    href={link.url}
                    target="_blank"
                    rel="noreferrer"
                    dir="ltr"
                    className="mt-1 block break-all text-left text-xs leading-5 text-gray-500 hover:text-(--primary-color) hover:underline"
                  >
                    {link.url}
                  </a>
                </div>

                {!disabled && (
                  <button
                    type="button"
                    onClick={() => removeLink(link.id)}
                    aria-label={`حذف لینک ${option?.label ?? ""}`}
                    title="حذف لینک"
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-red-400 transition hover:bg-red-50 hover:text-red-600"
                  >
                    <Trash2 size={17} />
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ======================================================
// ADMIN MODAL
// ======================================================

function AdminModal({
  mode,
  admin,
  roles,
  onClose,
  onSave,
  externalError = "",
}: AdminModalProps) {
  const isView = mode === "view";
  const isEdit = mode === "edit";

  const [form, setForm] = useState<AdminForm>(() =>
    createAdminForm(admin),
  );

  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [avatarError, setAvatarError] = useState("");
  const [submitError, setSubmitError] = useState("");

  useEffect(() => {
    setForm(createAdminForm(admin));
    setAvatarError("");
    setSubmitError("");
  }, [admin]);

  const activeRoles = useMemo(
    () =>
      roles.filter(
        (role) =>
          role.isActive !== false || role.id === admin?.roleId,
      ),
    [roles, admin?.roleId],
  );

  const roleOptions = useMemo(
    () => [
      { value: "", label: "انتخاب نقش ادمین" },
      ...activeRoles.map((role) => ({
        value: role.id,
        label: `${role.name} (${role.code})`,
      })),
    ],
    [activeRoles],
  );

  function updateField<K extends keyof AdminForm>(
    field: K,
    value: AdminForm[K],
  ) {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }));
  }

  // ----------------------------------------------------
  // AVATAR UPLOAD
  // ----------------------------------------------------

  async function handleAvatarChange(
    event: ChangeEvent<HTMLInputElement>,
  ) {
    const input = event.currentTarget;
    const file = input.files?.[0];

    if (!file) return;

    if (isUploadingAvatar) {
      input.value = "";
      return;
    }

    setAvatarError("");
    setSubmitError("");

    if (!ALLOWED_AVATAR_TYPES.includes(file.type)) {
      setAvatarError("فرمت تصویر باید JPG، PNG یا WEBP باشد.");
      input.value = "";
      return;
    }

    if (file.size > MAX_AVATAR_SIZE) {
      setAvatarError(
        "حجم تصویر پروفایل نباید بیشتر از ۵ مگابایت باشد.",
      );
      input.value = "";
      return;
    }

    const previousAvatar = form.avatar;
    const previewUrl = URL.createObjectURL(file);

    try {
      setIsUploadingAvatar(true);

      setForm((previous) => ({
        ...previous,
        avatar: previewUrl,
      }));

      const uploadedFile = await fileService.upload(
        file,
        "profiles",
      );

      if (!uploadedFile.url) {
        throw new Error("Upload response did not contain a URL.");
      }

      setForm((previous) => {
        if (previous.avatar !== previewUrl) return previous;

        return {
          ...previous,
          avatar: uploadedFile.url,
        };
      });
    } catch (error) {
      console.error("Failed to upload admin avatar:", error);

      setForm((previous) => {
        if (previous.avatar !== previewUrl) return previous;

        return {
          ...previous,
          avatar: previousAvatar,
        };
      });

      setAvatarError(
        "آپلود تصویر پروفایل ناموفق بود. لطفاً دوباره تلاش کنید.",
      );
    } finally {
      URL.revokeObjectURL(previewUrl);
      setIsUploadingAvatar(false);
      input.value = "";
    }
  }

  function handleRemoveAvatar() {
    if (isUploadingAvatar || isView) return;

    setForm((previous) => ({
      ...previous,
      avatar: "",
    }));

    setAvatarError("");
    setSubmitError("");
  }

  // ----------------------------------------------------
  // FORM VALIDATION & SUBMIT
  // ----------------------------------------------------

  async function handleSubmit() {
    setSubmitError("");

    if (isUploadingAvatar) {
      setSubmitError("لطفاً تا پایان آپلود تصویر صبر کنید.");
      return;
    }

    if (!form.name.trim()) {
      setSubmitError("نام و نام خانوادگی ادمین را وارد کنید.");
      return;
    }

    if (!form.roleId) {
      setSubmitError("نقش ادمین را انتخاب کنید.");
      return;
    }

    if (!isEdit && !form.username.trim()) {
      setSubmitError("نام کاربری را وارد کنید.");
      return;
    }

    if (!isEdit && form.username.trim().length < 3) {
      setSubmitError("نام کاربری باید حداقل ۳ کاراکتر باشد.");
      return;
    }

    if (!isEdit && !form.password) {
      setSubmitError("رمز عبور ادمین را وارد کنید.");
      return;
    }

    if (!isEdit && form.password.length < 8) {
      setSubmitError("رمز عبور باید حداقل ۸ کاراکتر باشد.");
      return;
    }

    const normalizedNewUsername = form.newUsername.trim();

    if (
      isEdit &&
      normalizedNewUsername &&
      normalizedNewUsername !== form.username &&
      normalizedNewUsername.length < 3
    ) {
      setSubmitError("نام کاربری جدید باید حداقل ۳ کاراکتر باشد.");
      return;
    }

    // اعتبارسنجی رمز پیش از هر درخواست API انجام می‌شود.
    if (isEdit && Boolean(form.newPassword) && !form.currentPassword) {
      setSubmitError(
        "برای تغییر رمز عبور، رمز عبور فعلی را نیز وارد کنید.",
      );
      return;
    }

    if (form.newPassword && form.newPassword.length < 8) {
      setSubmitError("رمز عبور جدید باید حداقل ۸ کاراکتر باشد.");
      return;
    }

    const filledLinks = form.socialLinks.filter(
      (item) => item.url.trim(),
    );

    const invalidLink = filledLinks.find(
      (item) => !isValidHttpUrl(item.url.trim()),
    );

    if (invalidLink) {
      setSubmitError(
        "آدرس هر شبکه اجتماعی باید یک آدرس معتبر با http:// یا https:// باشد.",
      );
      return;
    }

    try {
      setIsSaving(true);

      await onSave({
        ...form,
        username: form.username.trim(),
        newUsername: normalizedNewUsername,
        name: form.name.trim(),
        bio: form.bio.trim(),
        socialLinks: filledLinks.map((item) => ({
          ...item,
          url: item.url.trim(),
        })),
      });
    } catch {
      // خطای اصلی در کامپوننت والد نمایش داده می‌شود.
    } finally {
      setIsSaving(false);
    }
  }

  const modalTitle = isView
    ? "مشاهده اطلاعات ادمین"
    : isEdit
      ? "ویرایش ادمین"
      : "ثبت ادمین جدید";

  const isBusy = isUploadingAvatar || isSaving;

  return (
    <BaseModal
      open
      onClose={onClose}
      title={modalTitle}
      description={
        isView
          ? "مشاهده اطلاعات حساب، نقش و راه‌های ارتباطی"
          : "اطلاعات حساب کاربری و دسترسی ادمین را مدیریت کنید."
      }
      size="xl"
      dir="rtl"
      isBusy={isBusy}
      closeOnBackdrop={!isBusy}
      closeOnEscape={!isBusy}
      bodyClassName="space-y-8 p-5 sm:p-7"
      footer={
        <>
          <button
            type="button"
            onClick={onClose}
            disabled={isBusy}
            className="h-11 rounded-xl border border-gray-200 bg-white px-5 text-sm font-medium text-gray-600 transition hover:bg-gray-50 disabled:opacity-50"
          >
            {isView ? "بستن" : "انصراف"}
          </button>

          {!isView && (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isBusy}
              className="flex h-11 items-center justify-center gap-2 rounded-xl bg-(--primary-color) px-6 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isBusy ? (
                <RefreshCw size={16} className="animate-spin" />
              ) : (
                <FiEdit3 size={16} />
              )}

              {isUploadingAvatar
                ? "در حال آپلود تصویر..."
                : isSaving
                  ? "در حال ذخیره..."
                  : isEdit
                    ? "ذخیره تغییرات"
                    : "ثبت ادمین"}
            </button>
          )}
        </>
      }
    >
      {/* PROFILE HEADER */}

      <div className="relative overflow-hidden rounded-2xl border border-gray-200 bg-gradient-to-l from-(--primary-color)/10 via-white to-white p-5 sm:p-6">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
          <div className="relative h-24 w-24 shrink-0 self-center sm:self-auto">
            <div className="h-24 w-24 overflow-hidden rounded-2xl border-4 border-white bg-gray-100 shadow-md">
              {form.avatar ? (
                <img
                  src={form.avatar}
                  alt={form.name || "تصویر ادمین"}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-gray-400">
                  <UserRound size={38} />
                </div>
              )}
            </div>

            {!isView && (
              <>
                <label
                  htmlFor="admin-avatar-upload"
                  title="آپلود تصویر پروفایل"
                  className={`absolute -bottom-2 -left-2 flex h-9 w-9 items-center justify-center rounded-xl border-2 border-white bg-(--primary-color) text-white shadow-md ${isUploadingAvatar
                    ? "cursor-not-allowed opacity-60"
                    : "cursor-pointer hover:opacity-90"
                    }`}
                >
                  {isUploadingAvatar ? (
                    <RefreshCw size={15} className="animate-spin" />
                  ) : (
                    <Camera size={16} />
                  )}
                </label>

                <input
                  id="admin-avatar-upload"
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  className="hidden"
                  disabled={isUploadingAvatar}
                  onChange={handleAvatarChange}
                />

                {form.avatar && !isUploadingAvatar && (
                  <button
                    type="button"
                    onClick={handleRemoveAvatar}
                    title="حذف تصویر"
                    className="absolute -right-2 -top-2 flex h-7 w-7 items-center justify-center rounded-lg border-2 border-white bg-red-500 text-white shadow"
                  >
                    <X size={13} />
                  </button>
                )}
              </>
            )}
          </div>

          <div className="min-w-0 flex-1 text-center sm:text-right">
            <p className="text-xs font-medium text-(--primary-color)">
              پروفایل مدیریتی
            </p>

            <h3 className="mt-1 break-words text-lg font-bold text-gray-900">
              {form.name || "نام ادمین"}
            </h3>

            <p className="mt-1 break-all text-sm text-gray-500" dir="ltr">
              {form.username
                ? `@${form.username}`
                : "نام کاربری هنوز ثبت نشده است"}
            </p>

            <div className="mt-3 flex flex-wrap justify-center gap-2 sm:justify-start">
              <span
                className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${form.isActive
                  ? "bg-emerald-50 text-emerald-700"
                  : "bg-gray-100 text-gray-500"
                  }`}
              >
                {form.isActive ? (
                  <CheckCircle2 size={13} />
                ) : (
                  <CircleAlert size={13} />
                )}
                {form.isActive ? "حساب فعال" : "حساب غیرفعال"}
              </span>

              {form.roleId && (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1 text-xs text-gray-600 shadow-sm">
                  <ShieldCheck size={13} />
                  {roles.find((role) => role.id === form.roleId)?.name ??
                    "نقش انتخاب‌شده"}
                </span>
              )}
            </div>
          </div>
        </div>

        {!isView && (
          <p className="mt-4 flex items-center justify-center gap-1.5 text-[11px] text-gray-400 sm:justify-start">
            <UploadCloud size={13} />
            JPG، PNG یا WEBP؛ حداکثر ۵ مگابایت
          </p>
        )}

        {isUploadingAvatar && (
          <div className="mt-4 flex items-center gap-2 rounded-xl bg-white/80 px-3 py-2 text-xs text-(--primary-color)">
            <RefreshCw size={14} className="animate-spin" />
            تصویر در حال آپلود در فضای پروفایل‌ها است...
          </div>
        )}

        {avatarError && (
          <p
            role="alert"
            className="mt-3 rounded-xl bg-red-50 px-3 py-2 text-xs leading-6 text-red-600"
          >
            {avatarError}
          </p>
        )}
      </div>

      {/* ACCOUNT */}

      <ModalSection
        icon={<LockKeyhole size={18} />}
        title="اطلاعات حساب کاربری"
        description="مشخصات ورود به پنل مدیریت"
      >
        {isView ? (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <InfoBox label="نام کاربری" value={form.username} />
            <InfoBox
              label="وضعیت حساب"
              value={form.isActive ? "فعال" : "غیرفعال"}
            />
            <InfoBox
              label="تاریخ ایجاد"
              value={formatDate(admin?.createdAt)}
            />
            <InfoBox
              label="آخرین به‌روزرسانی"
              value={formatDate(admin?.updatedAt)}
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="نام و نام خانوادگی" required>
              <div className="relative">
                <UserRound
                  size={16}
                  className="absolute right-4 top-4 text-gray-400"
                />
                <input
                  value={form.name}
                  onChange={(event) =>
                    updateField("name", event.target.value)
                  }
                  placeholder="نام کامل ادمین"
                  className={`${inputClass} pr-10`}
                />
              </div>
            </Field>

            <Field
              label={isEdit ? "نام کاربری فعلی" : "نام کاربری"}
              required={!isEdit}
            >
              <div className="relative">
                <AtSign
                  size={16}
                  className="absolute right-4 top-4 text-gray-400"
                />
                <input
                  value={form.username}
                  disabled={isEdit}
                  onChange={(event) =>
                    updateField("username", event.target.value)
                  }
                  placeholder="مثلاً admin"
                  autoComplete="off"
                  className={`${inputClass} pr-10`}
                  dir="ltr"
                />
              </div>

              {isEdit && (
                <p className="mt-1.5 text-[11px] text-gray-400">
                  تغییر نام کاربری در بخش جداگانه زیر انجام می‌شود.
                </p>
              )}
            </Field>

            {!isEdit && (
              <Field
                label="رمز عبور"
                required
                hint="حداقل ۸ کاراکتر انتخاب کن."
              >
                <div className="relative">
                  <KeyRound
                    size={16}
                    className="absolute right-4 top-4 text-gray-400"
                  />
                  <input
                    type="password"
                    value={form.password}
                    onChange={(event) =>
                      updateField("password", event.target.value)
                    }
                    placeholder="رمز عبور اولیه"
                    autoComplete="new-password"
                    className={`${inputClass} pr-10`}
                    dir="ltr"
                  />
                </div>
              </Field>
            )}

            {isEdit && (
              <div className="flex items-center gap-3 rounded-xl border border-gray-200 bg-gray-50 p-4 sm:col-span-2">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-(--primary-color) shadow-sm">
                  <KeyRound size={18} />
                </div>

                <div className="min-w-0">
                  <p className="text-sm font-semibold text-gray-700">
                    تغییر رمز عبور
                  </p>
                  <p className="mt-1 text-xs leading-5 text-gray-400">
                    برای تغییر رمز از بخش «تغییر رمز» در ادامه فرم استفاده کن.
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </ModalSection>

      {/* ROLE */}

      <ModalSection
        icon={<ShieldCheck size={18} />}
        title="نقش و دسترسی"
        description="نقش را از بین نقش‌هایی که قبلاً تعریف کرده‌ای انتخاب کن."
      >
        {isView ? (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <InfoBox label="نام نقش" value={getRoleName(admin)} />
            <InfoBox
              label="کد نقش"
              value={admin?.roleRelation?.code ?? "—"}
            />
          </div>
        ) : (
          <Field
            label="نقش ادمین"
            required
            hint="فهرست نقش‌ها از roleService دریافت می‌شود."
          >
            <BaseSelect
              value={form.roleId}
              onChange={(value) => updateField("roleId", value)}
              options={roleOptions}
            />
          </Field>
        )}
      </ModalSection>

      {/* PROFILE DETAILS */}

      <ModalSection
        icon={<FiUser size={18} />}
        title="اطلاعات پروفایل"
        description="توضیحات و دسته‌بندی کاری ادمین"
      >
        {isView ? (
          <div className="space-y-4">
            <InfoBox
              label="دسته‌بندی"
              value={
                (admin?.categories ?? [])
                  .map(getCategoryLabel)
                  .join("، ") || "—"
              }
            />

            <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
              <p className="text-xs text-gray-400">
                بیوگرافی و توضیحات
              </p>
              <p className="mt-2 whitespace-pre-wrap wrap-break-word text-sm leading-7 text-gray-700">
                {form.bio || "توضیحاتی ثبت نشده است."}
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <Field label="دسته‌بندی کاری (این بخش فقط برا نقش منتور پر شود)">
              <BaseSelect
                value={form.category}
                onChange={(value) => updateField("category", value)}
                options={categoryOptions}
              />
            </Field>

            <Field
              label="بیوگرافی و توضیحات"
              hint="توضیحات کوتاه درباره مسئولیت یا حوزه فعالیت ادمین."
            >
              <textarea
                value={form.bio}
                onChange={(event) =>
                  updateField("bio", event.target.value)
                }
                rows={4}
                placeholder="توضیحات پروفایل را وارد کنید..."
                className={textareaClass}
              />
            </Field>
          </div>
        )}
      </ModalSection>

      {/* SOCIAL LINKS */}

      <ModalSection
        icon={<Link2 size={18} />}
        title="شبکه‌های اجتماعی و لینک‌ها"
        description="اینستاگرام، لینکدین، تلگرام، وب‌سایت و لینک‌های دیگر"
      >
        {isView ? (
          <div className="space-y-3">
            {form.socialLinks.length ? (
              form.socialLinks.map((item) => {
                const option = SOCIAL_LINK_OPTIONS.find(
                  (social) => social.value === item.type,
                );

                return (
                  <div
                    key={item.id}
                    className="flex items-center gap-3 rounded-xl border border-gray-200 p-3"
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-(--primary-color)/10 text-(--primary-color)">
                      {option?.icon ?? <Link2 size={17} />}
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-semibold text-gray-700">
                        {option?.label ?? "سایر لینک‌ها"}
                      </p>
                      <p
                        className="mt-1 break-all text-xs text-gray-500"
                        dir="ltr"
                      >
                        {item.url}
                      </p>
                    </div>

                    {isValidHttpUrl(item.url) && (
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noreferrer"
                        aria-label="باز کردن لینک"
                        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 hover:text-(--primary-color)"
                      >
                        <ExternalLink size={16} />
                      </a>
                    )}
                  </div>
                );
              })
            ) : (
              <p className="rounded-xl border border-dashed border-gray-200 p-6 text-center text-sm text-gray-400">
                لینکی ثبت نشده است.
              </p>
            )}
          </div>
        ) : (
          <SocialLinksEditor
            links={form.socialLinks}
            onChange={(value) => updateField("socialLinks", value)}
            disabled={isView}
          />
        )}
      </ModalSection>

      {/* STATUS */}

      <ModalSection
        icon={<UserCog size={18} />}
        title="وضعیت حساب"
        description="وضعیت حساب از طریق سرویس اختصاصی وضعیت ذخیره می‌شود."
      >
        {isView ? (
          <InfoBox
            label="وضعیت"
            value={form.isActive ? "فعال" : "غیرفعال"}
          />
        ) : (
          <button
            type="button"
            onClick={() => updateField("isActive", !form.isActive)}
            className={`flex w-full items-center justify-between gap-4 rounded-2xl border p-4 text-right transition ${form.isActive
              ? "border-emerald-200 bg-emerald-50/70"
              : "border-gray-200 bg-gray-50"
              }`}
          >
            <div className="flex items-center gap-3">
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-xl ${form.isActive
                  ? "bg-emerald-100 text-emerald-700"
                  : "bg-gray-200 text-gray-500"
                  }`}
              >
                {form.isActive ? (
                  <UserCheck size={19} />
                ) : (
                  <UserX size={19} />
                )}
              </div>

              <div>
                <p className="text-sm font-semibold text-gray-800">
                  {form.isActive
                    ? "حساب فعال است"
                    : "حساب غیرفعال است"}
                </p>
                <p className="mt-1 text-xs leading-5 text-gray-500">
                  برای تغییر وضعیت کلیک کن.
                </p>
              </div>
            </div>

            <span
              className={`relative h-6 w-11 shrink-0 rounded-full transition ${form.isActive ? "bg-emerald-500" : "bg-gray-300"
                }`}
            >
              <span
                className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow transition-all ${form.isActive ? "right-1" : "right-6"
                  }`}
              />
            </span>
          </button>
        )}
      </ModalSection>

      {/* USERNAME AND PASSWORD */}

      {isEdit && (
        <>
          <ModalSection
            icon={<AtSign size={18} />}
            title="تغییر نام کاربری"
            description="نام کاربری جدید از endpoint مستقل ذخیره می‌شود."
          >
            <Field label="نام کاربری جدید">
              <input
                value={form.newUsername}
                onChange={(event) =>
                  updateField("newUsername", event.target.value)
                }
                placeholder="نام کاربری جدید"
                className={inputClass}
                dir="ltr"
                autoComplete="off"
              />
            </Field>
          </ModalSection>

          <ModalSection
            icon={<KeyRound size={18} />}
            title="تغییر رمز عبور"
            description="اگر قصد تغییر رمز نداری، فیلدها را خالی بگذار."
          >
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field label="رمز عبور فعلی">
                <input
                  type="password"
                  value={form.currentPassword}
                  onChange={(event) =>
                    updateField("currentPassword", event.target.value)
                  }
                  placeholder="رمز فعلی"
                  className={inputClass}
                  autoComplete="current-password"
                  dir="ltr"
                />
              </Field>

              <Field label="رمز عبور جدید">
                <input
                  type="password"
                  value={form.newPassword}
                  onChange={(event) =>
                    updateField("newPassword", event.target.value)
                  }
                  placeholder="حداقل ۸ کاراکتر"
                  className={inputClass}
                  autoComplete="new-password"
                  dir="ltr"
                />
              </Field>
            </div>
          </ModalSection>
        </>
      )}

      {submitError && (
        <p
          role="alert"
          className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm leading-6 text-red-600"
        >
          {submitError}
        </p>
      )}

      {externalError && (
        <p
          role="alert"
          className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm leading-6 text-red-600"
        >
          {externalError}
        </p>
      )}
    </BaseModal>
  );
}

// ======================================================
// ADMIN MANAGEMENT PAGE
// ======================================================

export default function AdminManagementPage() {
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);

  const [loading, setLoading] = useState(true);
  const [rolesLoading, setRolesLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);

  const [selected, setSelected] = useState<Admin | null>(null);
  const [mode, setMode] = useState<AdminModalMode | null>(null);

  const [isDeleting, setIsDeleting] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // ----------------------------------------------------
  // FETCH DATA
  // ----------------------------------------------------

  const fetchAdmins = useCallback(async () => {
    const data = await adminService.getAll();
    setAdmins(data ?? []);
  }, []);

  const fetchRoles = useCallback(async () => {
    const data = await roleService.getAll();
    setRoles(data ?? []);
  }, []);

  const loadData = useCallback(async () => {
    setError("");
    setLoading(true);
    setRolesLoading(true);

    const results = await Promise.allSettled([
      fetchAdmins(),
      fetchRoles(),
    ]);

    const adminResult = results[0];
    const roleResult = results[1];

    if (adminResult.status === "rejected") {
      setError(getErrorMessage(adminResult.reason));
    }

    if (roleResult.status === "rejected") {
      setError((previous) =>
        previous
          ? `${previous} دریافت فهرست نقش‌ها ناموفق بود.`
          : `دریافت فهرست نقش‌ها ناموفق بود: ${getErrorMessage(
            roleResult.reason,
          )}`,
      );
    }

    setLoading(false);
    setRolesLoading(false);
  }, [fetchAdmins, fetchRoles]);

  useEffect(() => {
    void loadData();
  }, [loadData]);

  async function handleRefresh() {
    try {
      setRefreshing(true);
      await loadData();
    } finally {
      setRefreshing(false);
    }
  }

  // ----------------------------------------------------
  // STATS
  // ----------------------------------------------------

  const stats = useMemo(() => {
    const active = admins.filter((admin) => admin.isActive).length;
    const inactive = admins.length - active;

    return {
      total: admins.length,
      active,
      inactive,
      roles: new Set(admins.map((admin) => admin.roleId)).size,
    };
  }, [admins]);

  // ----------------------------------------------------
  // FILTERS AND PAGINATION
  // ----------------------------------------------------

  const filteredAdmins = useMemo(() => {
    const query = search.trim().toLowerCase();

    return admins.filter((admin) => {
      const name = String(admin.name ?? "").toLowerCase();
      const username = String(admin.username ?? "").toLowerCase();
      const roleName = String(
        admin.roleRelation?.name ?? "",
      ).toLowerCase();
      const roleCode = String(
        admin.roleRelation?.code ?? "",
      ).toLowerCase();

      const matchesSearch =
        !query ||
        name.includes(query) ||
        username.includes(query) ||
        roleName.includes(query) ||
        roleCode.includes(query);

      const matchesRole =
        roleFilter === "all" || admin.roleId === roleFilter;

      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "active" && admin.isActive) ||
        (statusFilter === "inactive" && !admin.isActive);

      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [admins, search, roleFilter, statusFilter]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredAdmins.length / PER_PAGE),
  );

  const currentPage = Math.min(page, totalPages);

  const paginatedAdmins = useMemo(() => {
    const start = (currentPage - 1) * PER_PAGE;
    return filteredAdmins.slice(start, start + PER_PAGE);
  }, [filteredAdmins, currentPage]);

  const filterRoleOptions = useMemo(
    () => [
      { value: "all", label: "همه نقش‌ها" },
      ...roles.map((role) => ({
        value: role.id,
        label: role.name,
      })),
    ],
    [roles],
  );

  const statusOptions = [
    { value: "all", label: "همه وضعیت‌ها" },
    { value: "active", label: "فعال" },
    { value: "inactive", label: "غیرفعال" },
  ];

  // ----------------------------------------------------
  // MODAL CONTROL
  // ----------------------------------------------------

  function openModal(nextMode: AdminModalMode, admin?: Admin) {
    setError("");
    setSelected(admin ?? null);
    setMode(nextMode);
  }

  function closeModal() {
    if (isDeleting) return;

    setSelected(null);
    setMode(null);
    setError("");
  }

  // ----------------------------------------------------
  // CREATE / UPDATE
  // ----------------------------------------------------

  async function handleSave(form: AdminForm) {
    setError("");

    try {
      const socialLinks = serializeSocialLinks(form.socialLinks);

      /**
       * وضعیت از commonData حذف شده است؛
       * چون سرویس وضعیت endpoint مستقل دارد.
       */
      const commonData: UpdateAdminData = {
        name: form.name.trim(),
        roleId: form.roleId,
        ...(form.avatar ? { avatar: form.avatar } : { avatar: "" }),
        ...(form.bio.trim() ? { bio: form.bio.trim() } : { bio: "" }),
        categories: form.category ? [form.category] : [],
        socialLinks,
      };

      if (mode === "create") {
        const payload: CreateAdminData = {
          username: form.username.trim(),
          password: form.password,
          name: form.name.trim(),
          roleId: form.roleId,
          ...(form.avatar ? { avatar: form.avatar } : {}),
          ...(form.bio.trim() ? { bio: form.bio.trim() } : {}),
          categories: form.category ? [form.category] : [],
          socialLinks,
        };

        let created = await adminService.create(payload);

        // وضعیت انتخاب‌شده برای حساب جدید نیز اعمال می‌شود.
        if (!form.isActive) {
          created = await adminService.setActive(created.id, false);
        }

        // برای دریافت roleRelation و داده‌های نهایی، رکورد را دوباره می‌خوانیم.
        try {
          created = await adminService.getOne(created.id);
        } catch {
          // اگر getOne در دسترس نبود، از پاسخ create استفاده می‌شود.
        }

        setAdmins((previous) => [
          created,
          ...previous.filter((admin) => admin.id !== created.id),
        ]);
      } else if (mode === "edit" && selected) {
        /**
         * اعتبارسنجی رمز قبل از این تابع در فرم انجام می‌شود.
         * ابتدا اطلاعات پایه به‌روزرسانی می‌شوند.
         */
        await adminService.update(selected.id, commonData);

        // تغییر نام کاربری از endpoint اختصاصی انجام می‌شود.
        if (
          form.newUsername.trim() &&
          form.newUsername.trim() !== selected.username
        ) {
          await adminService.changeUsername(selected.id, {
            username: form.newUsername.trim(),
          });
        }

        // رمز عبور فقط وقتی رمز جدید وارد شده باشد تغییر می‌کند.
        if (form.newPassword) {
          await adminService.changePassword(selected.id, {
            currentPassword: form.currentPassword,
            newPassword: form.newPassword,
          });
        }

        // وضعیت حساب از endpoint اختصاصی تغییر می‌کند.
        if (selected.isActive !== form.isActive) {
          await adminService.setActive(selected.id, form.isActive);
        }

        // رکورد نهایی از سرور دریافت می‌شود تا roleRelation قدیمی نماند.
        const updated = await adminService.getOne(selected.id);

        setAdmins((previous) =>
          previous.map((admin) =>
            admin.id === selected.id ? updated : admin,
          ),
        );
      } else {
        return;
      }

      setSelected(null);
      setMode(null);
      setError("");
    } catch (err) {
      setError(getErrorMessage(err));
      throw err;
    }
  }

  // ----------------------------------------------------
  // DELETE
  // ----------------------------------------------------

  async function handleDelete() {
    if (!selected || isDeleting) return;

    try {
      setIsDeleting(true);
      setError("");

      await adminService.remove(selected.id);

      setAdmins((previous) =>
        previous.filter((admin) => admin.id !== selected.id),
      );

      setSelected(null);
      setMode(null);
      setPage(1);
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
    <div className="mx-auto w-full max-w-7xl space-y-6 pb-10">
      {/* HEADER */}

      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            مدیریت ادمین‌ها
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            ایجاد حساب مدیریتی، تخصیص نقش و مدیریت اطلاعات پروفایل
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={handleRefresh}
            disabled={refreshing || loading}
            className="flex h-11 items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 text-sm font-medium text-gray-600 transition hover:bg-gray-50 disabled:opacity-50"
          >
            <RefreshCw size={16} className={refreshing ? "animate-spin" : ""}
            />
          </button>

          <button
            type="button"
            onClick={() => openModal("create")}
            className="flex h-11 items-center justify-center gap-2 rounded-xl bg-(--primary-color) px-5 text-sm font-semibold text-white shadow-sm transition hover:opacity-90"
          >
            <Plus size={18} />
            ثبت ادمین جدید
          </button>
        </div>
      </div>

      {/* GLOBAL ERROR */}

      {error && !mode && (
        <div
          role="alert"
          className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm leading-6 text-red-600"
        >
          <CircleAlert size={18} className="mt-1 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* STATS */}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="کل ادمین‌ها"
          value={stats.total}
          description="تمام حساب‌های مدیریتی"
          icon={<Users size={20} />}
          tone="primary"
        />

        <StatCard
          title="ادمین‌های فعال"
          value={stats.active}
          description="حساب‌های فعال"
          icon={<UserCheck size={20} />}
          tone="green"
        />

        <StatCard
          title="ادمین‌های غیرفعال"
          value={stats.inactive}
          description="حساب‌های غیرفعال"
          icon={<UserX size={20} />}
          tone="orange"
        />

        <StatCard
          title="نقش‌های استفاده‌شده"
          value={stats.roles}
          description="نقش‌های اختصاص‌یافته"
          icon={<ShieldCheck size={20} />}
          tone="purple"
        />
      </div>

      {/* FILTERS */}

      <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <div className="mb-4 flex items-center gap-2">
          <Search size={17} className="text-gray-400" />
          <h2 className="text-sm font-bold text-gray-800">
            جستجو و فیلتر
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
          <div className="relative">
            <Search
              size={18}
              className="absolute right-4 top-4 text-gray-400"
            />

            <input
              value={search}
              onChange={(event) => {
                setSearch(event.target.value);
                setPage(1);
              }}
              placeholder="جستجو بر اساس نام، نام کاربری یا نقش..."
              className={`${inputClass} pr-11`}
            />
          </div>

          <BaseSelect
            value={roleFilter}
            onChange={(value) => {
              setRoleFilter(value);
              setPage(1);
            }}
            options={filterRoleOptions}
          />

          <BaseSelect
            value={statusFilter}
            onChange={(value) => {
              setStatusFilter(value);
              setPage(1);
            }}
            options={statusOptions}
          />
        </div>
      </div>

      {/* TABLE */}

      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">


        <div className="overflow-x-auto">
          <table className="w-full min-w-237.5">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-5 py-4 text-right text-xs font-semibold text-gray-500">
                  ادمین
                </th>
                <th className="px-5 py-4 text-right text-xs font-semibold text-gray-500">
                  نقش
                </th>
                <th className="px-5 py-4 text-right text-xs font-semibold text-gray-500">
                  دسته‌بندی
                </th>
                <th className="px-5 py-4 text-right text-xs font-semibold text-gray-500">
                  وضعیت
                </th>
                <th className="px-5 py-4 text-right text-xs font-semibold text-gray-500">
                  تاریخ ایجاد
                </th>
                <th className="px-5 py-4 text-center text-xs font-semibold text-gray-500">
                  عملیات
                </th>
              </tr>
            </thead>

            <tbody>
              {loading || rolesLoading ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-16 text-center text-sm text-gray-400"
                  >
                    در حال دریافت اطلاعات ادمین‌ها و نقش‌ها...
                  </td>
                </tr>
              ) : paginatedAdmins.length > 0 ? (
                paginatedAdmins.map((admin) => (
                  <tr
                    key={admin.id}
                    className="border-t border-gray-100 transition hover:bg-gray-50/80"
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-12 w-12 shrink-0 overflow-hidden rounded-xl border border-gray-100 bg-gray-100">
                          {admin.avatar ? (
                            <img
                              src={admin.avatar}
                              alt={admin.name}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center text-gray-400">
                              <UserRound size={21} />
                            </div>
                          )}
                        </div>

                        <div className="min-w-0">
                          <p className="max-w-56 truncate text-sm font-semibold text-gray-900">
                            {admin.name}
                          </p>
                          <p
                            className="mt-1 max-w-56 truncate text-xs text-gray-400"

                          >
                            @{admin.username}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex flex-col">
                        <p className="text-sm font-medium text-gray-700">
                          {getRoleName(admin)}
                        </p>
                        <p className="mt-1 text-[10px] text-gray-400">
                          {admin.roleRelation?.code ?? "—"}
                        </p>
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      {admin.categories?.length ? (
                        <div className="flex max-w-48 flex-wrap gap-1.5">
                          {admin.categories.map((item) => (
                            <span
                              key={item}
                              className="rounded-lg bg-gray-100 px-2.5 py-1 text-xs text-gray-600"
                            >
                              {getCategoryLabel(item)}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span className="text-sm text-gray-400">—</span>
                      )}
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium ${admin.isActive
                          ? "bg-emerald-50 text-emerald-700"
                          : "bg-gray-100 text-gray-500"
                          }`}
                      >
                        <span
                          className={`h-1.5 w-1.5 rounded-full ${admin.isActive
                            ? "bg-emerald-500"
                            : "bg-gray-400"
                            }`}
                        />
                        {admin.isActive ? "فعال" : "غیرفعال"}
                      </span>
                    </td>

                    <td className="px-5 py-4 text-sm text-gray-500">
                      {formatDate(admin.createdAt)}
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex justify-center gap-2">
                        <ActionButton
                          ariaLabel="مشاهده ادمین"
                          onClick={() => openModal("view", admin)}
                        >
                          <Eye size={16} />
                        </ActionButton>

                        <ActionButton
                          ariaLabel="ویرایش ادمین"
                          onClick={() => openModal("edit", admin)}
                        >
                          <Pencil size={16} />
                        </ActionButton>

                        <ActionButton
                          ariaLabel="حذف ادمین"
                          danger
                          onClick={() => openModal("delete", admin)}
                        >
                          <Trash2 size={16} />
                        </ActionButton>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-16 text-center">
                    <div className="mx-auto flex max-w-sm flex-col items-center">
                      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-100 text-gray-400">
                        <FolderOpen size={25} />
                      </div>

                      <p className="mt-4 text-sm font-semibold text-gray-700">
                        ادمینی پیدا نشد
                      </p>

                      <p className="mt-1 text-xs leading-6 text-gray-400">
                        عبارت جستجو یا فیلترها را تغییر بده یا ادمین جدیدی ثبت کن.
                      </p>

                      {(search ||
                        roleFilter !== "all" ||
                        statusFilter !== "all") && (
                          <button
                            type="button"
                            onClick={() => {
                              setSearch("");
                              setRoleFilter("all");
                              setStatusFilter("all");
                              setPage(1);
                            }}
                            className="mt-3 text-xs font-semibold text-(--primary-color) hover:underline"
                          >
                            پاک کردن فیلترها
                          </button>
                        )}
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        {/* PAGINATION */}

        <div className="flex items-center justify-between border-t border-gray-200 px-6 py-4">
          <span className="text-sm text-gray-500">
            {filteredAdmins.length.toLocaleString("fa-IR")} ادمین
          </span>

          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={currentPage === 1}
              onClick={() =>
                setPage((previous) => Math.max(1, previous - 1))
              }
              className="rounded-lg border border-gray-200 p-2 transition hover:bg-gray-50 disabled:opacity-40"
              aria-label="صفحه قبل"
            >
              <ChevronRight size={16} />
            </button>

            <span className="min-w-10 rounded-lg bg-(--primary-color) px-4 py-2 text-center text-sm text-white">
              {currentPage.toLocaleString("fa-IR")}
            </span>

            <button
              type="button"
              disabled={currentPage === totalPages}
              onClick={() =>
                setPage((previous) =>
                  Math.min(totalPages, previous + 1),
                )
              }
              className="rounded-lg border border-gray-200 p-2 transition hover:bg-gray-50 disabled:opacity-40"
              aria-label="صفحه بعد"
            >
              <ChevronLeft size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* CREATE / EDIT / VIEW */}

      {(mode === "create" ||
        mode === "edit" ||
        mode === "view") && (
          <AdminModal
            key={`${mode}-${selected?.id ?? "new"}`}
            mode={mode}
            admin={selected}
            roles={roles}
            onClose={closeModal}
            onSave={handleSave}
            externalError={error}
          />
        )}

      {/* DELETE CONFIRMATION */}

      {mode === "delete" && selected && (
        <BaseModal
          open
          onClose={closeModal}
          title="حذف ادمین"
          description={`آیا از حذف حساب «${selected.name}» مطمئن هستی؟`}
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
                onClick={handleDelete}
                disabled={isDeleting}
                className="flex h-11 items-center gap-2 rounded-xl bg-red-500 px-5 text-sm font-medium text-white transition hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isDeleting && (
                  <RefreshCw size={15} className="animate-spin" />
                )}
                {isDeleting ? "در حال حذف..." : "حذف ادمین"}
              </button>
            </>
          }
        >
          <div className="flex items-start gap-3 rounded-xl border border-red-100 bg-red-50 p-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-100 text-red-600">
              <Trash2 size={18} />
            </div>

            <div>
              <p className="text-sm font-semibold text-red-700">
                این عملیات قابل بازگشت نیست.
              </p>
              <p className="mt-1 text-xs leading-6 text-red-600">
                با حذف این حساب، دسترسی ادمین باید توسط بک‌اند متوقف شود.
                قبل از حذف حساب‌های حساس، وابستگی‌های آن را بررسی کن.
              </p>
            </div>
          </div>

          {error && (
            <p
              role="alert"
              className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm leading-6 text-red-600"
            >
              {error}
            </p>
          )}
        </BaseModal>
      )}
    </div>
  );
}

// ======================================================
// STAT CARD
// ======================================================

function StatCard({
  title,
  value,
  description,
  icon,
  tone,
}: {
  title: string;
  value: number;
  description: string;
  icon: ReactNode;
  tone: "primary" | "green" | "orange" | "purple";
}) {
  const toneClasses = {
    primary: "bg-(--primary-color)/10 text-(--primary-color)",
    green: "bg-emerald-50 text-emerald-600",
    orange: "bg-orange-50 text-orange-600",
    purple: "bg-violet-50 text-violet-600",
  };

  return (
    <div className="flex items-center gap-4 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
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

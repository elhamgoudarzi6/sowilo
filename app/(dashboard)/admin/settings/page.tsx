
"use client";

import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    FiLock,
    FiUser,
    FiEye,
    FiEyeOff,
    FiCheckCircle,
} from "react-icons/fi";

import type { AuthState, AdminAuth } from "@/auth/types";
import { setCredentials } from "@/store/slices/auth.slice";
import { adminService } from "@/services/admin.service";

type ApiError = {
    response?: {
        data?: {
            message?: string | string[];
        };
    };
};

function getErrorMessage(
    error: unknown,
    fallback: string,
): string {
    const apiError = error as ApiError;
    const message = apiError.response?.data?.message;

    if (Array.isArray(message)) {
        return message.join("، ");
    }

    if (typeof message === "string" && message.trim()) {
        return message;
    }

    if (error instanceof Error && error.message) {
        return error.message;
    }

    return fallback;
}

export default function AdminSettingsPage() {
    const dispatch = useDispatch();

    const { user, accessToken } = useSelector(
        (state: { auth: AuthState }) => state.auth,
    );

    const admin: AdminAuth | null =
        user?.type === "admin" ? user : null;

    // =====================================================
    // USERNAME STATE
    // =====================================================

    const [newUsername, setNewUsername] = useState("");
    const [usernameLoading, setUsernameLoading] = useState(false);
    const [usernameError, setUsernameError] = useState("");
    const [usernameSuccess, setUsernameSuccess] = useState("");

    // =====================================================
    // PASSWORD STATE
    // =====================================================

    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [showCurrent, setShowCurrent] = useState(false);
    const [showNew, setShowNew] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const [passwordLoading, setPasswordLoading] = useState(false);
    const [passwordError, setPasswordError] = useState("");
    const [passwordSuccess, setPasswordSuccess] = useState("");

    // =====================================================
    // USERNAME VALIDATION
    // =====================================================

    const normalizedUsername = newUsername.trim();

    const usernameHasMinLength =
        normalizedUsername.length >= 3;

    const usernameHasMaxLength =
        normalizedUsername.length <= 30;

    const usernameHasValidCharacters =
        /^[a-zA-Z0-9_.-]+$/.test(normalizedUsername);

    const usernameIsDifferent =
        Boolean(normalizedUsername) &&
        normalizedUsername !== admin?.username;

    const usernameCanSubmit =
        usernameHasMinLength &&
        usernameHasMaxLength &&
        usernameHasValidCharacters &&
        usernameIsDifferent;

    // =====================================================
    // PASSWORD VALIDATION
    // =====================================================

    const passwordHasMinLength =
        newPassword.length >= 12;

    const passwordHasMaxLength =
        newPassword.length <= 128;

    const passwordHasLetter =
        /[A-Za-z]/.test(newPassword);

    const passwordHasNumber =
        /\d/.test(newPassword);

    const passwordIsDifferent =
        Boolean(newPassword) &&
        newPassword !== currentPassword;

    const passwordsMatch =
        Boolean(confirmPassword) &&
        newPassword === confirmPassword;

    const passwordCanSubmit =
        Boolean(currentPassword) &&
        passwordHasMinLength &&
        passwordHasMaxLength &&
        passwordHasLetter &&
        passwordHasNumber &&
        passwordIsDifferent &&
        passwordsMatch;

    // =====================================================
    // CHANGE USERNAME
    // =====================================================

    const handleChangeUsername = async () => {
        if (usernameLoading) return;

        setUsernameError("");
        setUsernameSuccess("");

        if (!admin) {
            setUsernameError(
                "اطلاعات ادمین واردشده در دسترس نیست. لطفاً دوباره وارد شوید.",
            );
            return;
        }

        if (!accessToken) {
            setUsernameError(
                "نشست ورود معتبر نیست. لطفاً دوباره وارد شوید.",
            );
            return;
        }

        if (!usernameHasMinLength) {
            setUsernameError(
                "نام کاربری باید حداقل ۳ کاراکتر داشته باشد.",
            );
            return;
        }

        if (!usernameHasMaxLength) {
            setUsernameError(
                "نام کاربری نمی‌تواند بیشتر از ۳۰ کاراکتر باشد.",
            );
            return;
        }

        if (!usernameHasValidCharacters) {
            setUsernameError(
                "نام کاربری فقط می‌تواند شامل حروف انگلیسی، اعداد، نقطه، خط تیره و زیرخط باشد.",
            );
            return;
        }

        if (!usernameIsDifferent) {
            setUsernameError(
                "نام کاربری جدید با نام کاربری فعلی یکسان است.",
            );
            return;
        }

        try {
            setUsernameLoading(true);

            await adminService.changeUsername(admin.id, {
                username: normalizedUsername,
            });

            // Update the current admin in Redux.
            dispatch(
                setCredentials({
                    user: {
                        ...admin,
                        username: normalizedUsername,
                    },
                    accessToken,
                }),
            );

            setNewUsername("");
            setUsernameSuccess(
                "نام کاربری با موفقیت تغییر کرد.",
            );
        } catch (error: unknown) {
            setUsernameError(
                getErrorMessage(
                    error,
                    "تغییر نام کاربری انجام نشد.",
                ),
            );
        } finally {
            setUsernameLoading(false);
        }
    };

    // =====================================================
    // CHANGE PASSWORD
    // =====================================================

    const handleChangePassword = async () => {
        if (passwordLoading) return;

        setPasswordError("");
        setPasswordSuccess("");

        if (!admin) {
            setPasswordError(
                "اطلاعات ادمین واردشده در دسترس نیست. لطفاً دوباره وارد شوید.",
            );
            return;
        }

        if (!accessToken) {
            setPasswordError(
                "نشست ورود معتبر نیست. لطفاً دوباره وارد شوید.",
            );
            return;
        }

        if (
            !currentPassword ||
            !newPassword ||
            !confirmPassword
        ) {
            setPasswordError(
                "تمام فیلدهای رمز عبور را تکمیل کنید.",
            );
            return;
        }

        if (!passwordHasMinLength) {
            setPasswordError(
                "رمز عبور جدید باید حداقل ۱۲ کاراکتر داشته باشد.",
            );
            return;
        }

        if (!passwordHasMaxLength) {
            setPasswordError(
                "رمز عبور جدید نمی‌تواند بیشتر از ۱۲۸ کاراکتر باشد.",
            );
            return;
        }

        if (!passwordHasLetter || !passwordHasNumber) {
            setPasswordError(
                "رمز عبور جدید باید حداقل شامل یک حرف انگلیسی و یک عدد باشد.",
            );
            return;
        }

        if (!passwordIsDifferent) {
            setPasswordError(
                "رمز عبور جدید باید با رمز عبور فعلی متفاوت باشد.",
            );
            return;
        }

        if (!passwordsMatch) {
            setPasswordError(
                "رمز عبور جدید با تکرار آن مطابقت ندارد.",
            );
            return;
        }

        try {
            setPasswordLoading(true);

            await adminService.changePassword(admin.id, {
                currentPassword,
                newPassword,
            });

            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");

            setShowCurrent(false);
            setShowNew(false);
            setShowConfirm(false);

            setPasswordSuccess(
                "رمز عبور با موفقیت تغییر کرد.",
            );
        } catch (error: unknown) {
            setPasswordError(
                getErrorMessage(
                    error,
                    "تغییر رمز عبور انجام نشد.",
                ),
            );
        } finally {
            setPasswordLoading(false);
        }
    };

    // =====================================================
    // AUTH CHECK
    // =====================================================

    if (!admin) {
        return (
            <div
                dir="rtl"
                role="alert"
                className="mx-auto w-full max-w-5xl rounded-2xl border border-red-200 bg-white p-6 text-sm text-red-600"
            >
                اطلاعات حساب ادمین در دسترس نیست. لطفاً دوباره وارد پنل مدیریت شوید.
            </div>
        );
    }

    // =====================================================
    // RENDER
    // =====================================================

    return (
        <div
            dir="rtl"
            className="mx-auto w-full max-w-5xl space-y-6 pb-10"
        >
            {/* HEADER */}

            <div>
                <h1 className="text-2xl font-bold text-gray-900">
                    تنظیمات
                </h1>

                <p className="mt-2 text-sm text-gray-500">
                    اطلاعات حساب و تنظیمات امنیتی حساب ادمین را مدیریت کنید.
                </p>
            </div>

            {/* =====================================================
                USERNAME SECTION
            ====================================================== */}

            <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
                <div className="border-b border-gray-100 p-6">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-(--primary-color)/10 text-(--primary-color)">
                            <FiUser size={19} />
                        </div>

                        <div>
                            <h2 className="font-bold text-gray-900">
                                نام کاربری
                            </h2>

                            <p className="mt-1 text-xs text-gray-500">
                                نام کاربری ورود به پنل مدیریت را تغییر دهید.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="p-6 md:px-16 lg:px-20">
                    <div className="grid gap-5 md:grid-cols-2">
                        {/* CURRENT USERNAME */}

                        <div>
                            <label className="mb-2 block text-sm font-medium text-gray-700">
                                نام کاربری فعلی
                            </label>

                            <div
                                dir="ltr"
                                className="flex h-12 items-center gap-2 rounded-xl border border-gray-200 bg-gray-50 px-4 text-sm text-gray-600"
                            >
                                <FiUser
                                    size={16}
                                    className="text-gray-400"
                                />

                                <span>{admin.username}</span>
                            </div>

                            <p className="mt-2 text-xs text-gray-400">
                                این نام کاربری برای ورود به پنل استفاده می‌شود.
                            </p>
                        </div>

                        {/* NEW USERNAME */}

                        <div>
                            <label
                                htmlFor="newUsername"
                                className="mb-2 block text-sm font-medium text-gray-700"
                            >
                                نام کاربری جدید
                            </label>

                            <div className="relative">
                                <FiUser
                                    size={16}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
                                />

                                <input
                                    id="newUsername"
                                    name="newUsername"
                                    type="text"
                                    dir="ltr"
                                    autoComplete="username"
                                    maxLength={30}
                                    value={newUsername}
                                    disabled={usernameLoading}
                                    onChange={(event) => {
                                        setNewUsername(
                                            event.target.value,
                                        );
                                        setUsernameError("");
                                        setUsernameSuccess("");
                                    }}
                                    onKeyDown={(event) => {
                                        if (event.key === "Enter") {
                                            event.preventDefault();
                                            void handleChangeUsername();
                                        }
                                    }}
                                    placeholder="نام کاربری جدید"
                                    className="h-12 w-full rounded-xl border border-gray-200 bg-white pr-11 pl-4 text-left text-sm text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-(--primary-color) focus:ring-4 focus:ring-(--primary-color)/10 disabled:opacity-60"
                                />
                            </div>

                            <p className="mt-2 text-xs text-gray-400">
                                نام کاربری باید شرایط زیر را داشته باشد.
                            </p>
                        </div>
                    </div>

                    {/* USERNAME RULES */}

                    <div className="mt-5 rounded-xl border border-gray-100 bg-gray-50 p-4">
                        <p className="mb-3 text-xs font-semibold text-gray-700">
                            شرایط نام کاربری
                        </p>

                        <div className="space-y-3 text-xs">
                            <Rule
                                valid={usernameHasMinLength}
                                text="حداقل ۳ کاراکتر داشته باشد"
                            />

                            <Rule
                                valid={usernameHasMaxLength}
                                text="حداکثر ۳۰ کاراکتر داشته باشد"
                            />

                            <Rule
                                valid={usernameHasValidCharacters}
                                text="فقط شامل حروف انگلیسی، اعداد، نقطه، خط تیره و زیرخط باشد"
                            />

                            <Rule
                                valid={usernameIsDifferent}
                                text="با نام کاربری فعلی متفاوت باشد"
                            />
                        </div>

                        <p className="mt-4 text-xs leading-6 text-gray-400">
                            تکراری نبودن نام کاربری توسط سرور بررسی می‌شود.
                        </p>
                    </div>

                    <Feedback
                        error={usernameError}
                        success={usernameSuccess}
                    />

                    <div className="mt-6 flex justify-start">
                        <button
                            type="button"
                            onClick={() =>
                                void handleChangeUsername()
                            }
                            disabled={
                                usernameLoading ||
                                !usernameCanSubmit
                            }
                            className="h-11 rounded-xl bg-(--primary-color) px-6 text-sm font-medium text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {usernameLoading
                                ? "در حال تغییر..."
                                : "تغییر نام کاربری"}
                        </button>
                    </div>
                </div>
            </section>

            {/* =====================================================
                PASSWORD SECTION
            ====================================================== */}

            <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
                <div className="border-b border-gray-100 p-6">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-(--primary-color)/10 text-(--primary-color)">
                            <FiLock size={19} />
                        </div>

                        <div>
                            <h2 className="font-bold text-gray-900">
                                امنیت حساب
                            </h2>

                            <p className="mt-1 text-xs text-gray-500">
                                برای امنیت بیشتر رمز عبور خود را تغییر دهید.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="p-6 md:px-16 lg:px-20">
                    <form
                        onSubmit={(event) => {
                            event.preventDefault();
                            void handleChangePassword();
                        }}
                    >
                        {/* CURRENT PASSWORD */}

                        <PasswordInput
                            id="currentPassword"
                            name="currentPassword"
                            label="رمز عبور فعلی"
                            value={currentPassword}
                            onChange={(value) => {
                                setCurrentPassword(value);
                                setPasswordError("");
                                setPasswordSuccess("");
                            }}
                            show={showCurrent}
                            setShow={setShowCurrent}
                            autoComplete="current-password"
                            disabled={passwordLoading}
                        />

                        {/* NEW PASSWORD */}

                        <div className="mt-5">
                            <PasswordInput
                                id="newPassword"
                                name="newPassword"
                                label="رمز عبور جدید"
                                value={newPassword}
                                onChange={(value) => {
                                    setNewPassword(value);
                                    setPasswordError("");
                                    setPasswordSuccess("");
                                }}
                                show={showNew}
                                setShow={setShowNew}
                                autoComplete="new-password"
                                disabled={passwordLoading}
                            />
                        </div>

                        {/* CONFIRM PASSWORD */}

                        <div className="mt-5">
                            <PasswordInput
                                id="confirmPassword"
                                name="confirmPassword"
                                label="تکرار رمز عبور جدید"
                                value={confirmPassword}
                                onChange={(value) => {
                                    setConfirmPassword(value);
                                    setPasswordError("");
                                    setPasswordSuccess("");
                                }}
                                show={showConfirm}
                                setShow={setShowConfirm}
                                autoComplete="new-password"
                                disabled={passwordLoading}
                            />
                        </div>

                        {/* PASSWORD RULES */}

                        <div className="mt-5 rounded-xl border border-gray-100 bg-gray-50 p-4">
                            <p className="mb-3 text-xs font-semibold text-gray-700">
                                شرایط رمز عبور
                            </p>

                            <div className="space-y-3 text-xs">
                                <Rule
                                    valid={passwordHasMinLength}
                                    text="حداقل ۱۲ کاراکتر داشته باشد"
                                />

                                <Rule
                                    valid={passwordHasMaxLength}
                                    text="حداکثر ۱۲۸ کاراکتر داشته باشد"
                                />

                                <Rule
                                    valid={passwordHasLetter}
                                    text="حداقل یک حرف انگلیسی داشته باشد"
                                />

                                <Rule
                                    valid={passwordHasNumber}
                                    text="حداقل یک عدد داشته باشد"
                                />

                                <Rule
                                    valid={passwordIsDifferent}
                                    text="با رمز عبور فعلی متفاوت باشد"
                                />

                                <Rule
                                    valid={passwordsMatch}
                                    text="رمز جدید و تکرار آن یکسان باشند"
                                />
                            </div>
                        </div>

                        <Feedback
                            error={passwordError}
                            success={passwordSuccess}
                        />

                        <div className="mt-6 flex justify-start">
                            <button
                                type="submit"
                                disabled={
                                    passwordLoading ||
                                    !passwordCanSubmit
                                }
                                className="h-11 rounded-xl bg-(--primary-color) px-6 text-sm font-medium text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                {passwordLoading
                                    ? "در حال تغییر..."
                                    : "تغییر رمز عبور"}
                            </button>
                        </div>
                    </form>
                </div>
            </section>
        </div>
    );
}

// =====================================================
// PASSWORD INPUT
// =====================================================

function PasswordInput({
    id,
    name,
    label,
    value,
    onChange,
    show,
    setShow,
    autoComplete,
    disabled,
}: {
    id: string;
    name: string;
    label: string;
    value: string;
    onChange: (value: string) => void;
    show: boolean;
    setShow: (value: boolean) => void;
    autoComplete: string;
    disabled: boolean;
}) {
    return (
        <div>
            <label
                htmlFor={id}
                className="mb-2 block text-sm font-medium text-gray-700"
            >
                {label}
            </label>

            <div className="relative">
                <input
                    id={id}
                    name={name}
                    type={show ? "text" : "password"}
                    dir="ltr"
                    autoComplete={autoComplete}
                    value={value}
                    disabled={disabled}
                    onChange={(event) =>
                        onChange(event.target.value)
                    }
                    required
                    className="h-12 w-full rounded-xl border border-gray-200 bg-white px-4 pl-12 text-left text-sm text-gray-800 outline-none transition focus:border-(--primary-color) focus:ring-4 focus:ring-(--primary-color)/10 disabled:opacity-60"
                />

                <button
                    type="button"
                    onClick={() => setShow(!show)}
                    disabled={disabled}
                    className="absolute left-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg text-gray-400 transition hover:bg-gray-100 hover:text-gray-600 disabled:cursor-not-allowed"
                    aria-label={
                        show
                            ? "مخفی کردن رمز عبور"
                            : "نمایش رمز عبور"
                    }
                >
                    {show ? (
                        <FiEyeOff size={18} />
                    ) : (
                        <FiEye size={18} />
                    )}
                </button>
            </div>
        </div>
    );
}

// =====================================================
// LIVE VALIDATION RULE
// =====================================================

function Rule({
    valid,
    text,
}: {
    valid: boolean;
    text: string;
}) {
    return (
        <div
            className={`flex items-start gap-2 ${
                valid ? "text-green-600" : "text-gray-500"
            }`}
        >
            {valid ? (
                <FiCheckCircle
                    size={14}
                    className="mt-0.5 shrink-0"
                />
            ) : (
                <span className="mt-0.5 h-3.5 w-3.5 shrink-0 rounded-full border border-gray-300" />
            )}

            <span>{text}</span>
        </div>
    );
}

// =====================================================
// FEEDBACK
// =====================================================

function Feedback({
    error,
    success,
}: {
    error: string;
    success: string;
}) {
    if (error) {
        return (
            <p
                role="alert"
                className="mt-4 rounded-xl border border-red-100 bg-red-50 p-3 text-sm leading-6 text-red-600"
            >
                {error}
            </p>
        );
    }

    if (success) {
        return (
            <p
                role="status"
                className="mt-4 rounded-xl border border-green-100 bg-green-50 p-3 text-sm leading-6 text-green-700"
            >
                {success}
            </p>
        );
    }

    return null;
}

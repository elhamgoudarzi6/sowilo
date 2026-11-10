"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { FiArrowUpRight } from "react-icons/fi";

import { authService } from "@/services/auth.service";
import { setCredentials } from "@/store/slices/auth.slice";

export default function AdminLogin() {
    const router = useRouter();
    const dispatch = useDispatch();

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleLogin = async () => {
        if (loading) return;

        setError("");

        const normalizedUsername = username.trim();

        if (!normalizedUsername || !password) {
            setError("Please enter your username and password.");
            return;
        }

        try {
            setLoading(true);

            const { user, accessToken } =
                await authService.adminLogin({
                    username: normalizedUsername,
                    password,
                });

            if (user.type !== "admin" || !accessToken) {
                throw new Error(
                    "Invalid authentication response from server."
                );
            }

            dispatch(setCredentials({ user, accessToken }));

            router.replace("/admin");
        } catch (error: unknown) {
            const apiError = error as {
                response?: {
                    data?: {
                        message?: string | string[];
                    };
                };
                message?: string;
            };

            const message = apiError.response?.data?.message;

            setError(
                Array.isArray(message)
                    ? message.join(", ")
                    : message ||
                    apiError.message ||
                    "Login failed. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-(--color-background) px-5 py-12">

            {/* Background Decoration */}
            <div className="pointer-events-none absolute -top-40 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-(--color-primary) opacity-[0.07] blur-[120px]" />

            <div className="relative w-full max-w-md">

                {/* Brand */}
                <div className="mb-10 text-center">
                    <span className="text-4xl font-black tracking-tight   text-(--color-text)">
                        sowilo<span className="text-(--color-primary)">.</span>
                    </span>

                    <p className="mt-3 text-[9px] font-bold uppercase tracking-[0.3em] text-(--color-text-secondary)">
                        Creative Content Agency
                    </p>
                </div>

                {/* Login Card */}
                <div className="border border-(--color-border) bg-(--color-surface) p-7 sm:p-10">
                    {/* Header */}
                    <div className="mb-7">
                        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-(--color-text)">
                            Admin Portal<span className="text-(--color-primary)">.</span>
                        </h1>
                    </div>

                    {/* Form */}
                    <form
                        onSubmit={(event) => {
                            event.preventDefault();
                            void handleLogin();
                        }}
                        className="space-y-6"
                    >
                        {/* Username */}
                        <div>
                            <label
                                htmlFor="username"
                                className="mb-2 block text-[10px] font-bold uppercase tracking-[0.18em] text-(--color-text-secondary)"
                            >
                                Username
                            </label>

                            <input
                                type="text"
                                id="username"
                                name="username"
                                dir="ltr"
                                required
                                autoComplete="username"
                                placeholder="Enter your username"
                                value={username}
                                onChange={(event) =>
                                    setUsername(event.target.value)
                                }
                                disabled={loading}
                                className="w-full border border-(--color-border) bg-(--color-background) px-4 py-3.5 text-sm text-(--color-text) outline-none transition-all duration-300 placeholder:text-(--color-text-secondary) focus:border-(--color-primary) disabled:cursor-not-allowed disabled:opacity-50"
                            />
                        </div>

                        {/* Password */}
                        <div>
                            <label
                                htmlFor="password"
                                className="mb-2 block text-[10px] font-bold uppercase tracking-[0.18em] text-(--color-text-secondary)"
                            >
                                Password
                            </label>

                            <input
                                type="password"
                                id="password"
                                name="password"
                                dir="ltr"
                                required
                                autoComplete="current-password"
                                placeholder="Enter your password"
                                value={password}
                                onChange={(event) =>
                                    setPassword(event.target.value)
                                }
                                disabled={loading}
                                className="w-full border border-(--color-border) bg-(--color-background) px-4 py-3.5 text-sm text-(--color-text) outline-none transition-all duration-300 placeholder:text-(--color-text-secondary) focus:border-(--color-primary) disabled:cursor-not-allowed disabled:opacity-50"
                            />
                        </div>

                        {/* Error Message */}
                        {error && (
                            <div
                                role="alert"
                                className="border border-(--color-danger) bg-(--color-danger)/10 px-4 py-3"
                            >
                                <p className="text-sm leading-6 text-(--color-danger)">
                                    {error}
                                </p>
                            </div>
                        )}

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="
    group relative flex w-full
    items-center justify-center
    bg-(--color-primary)
    px-5 py-4
    text-(--color-text-inverse)
    transition-all duration-300
    hover:bg-(--color-primary-hover)
    disabled:cursor-not-allowed
    disabled:opacity-50
  "
                        >
                            <span className="text-xs font-bold uppercase tracking-[0.15em]">
                                {loading ? "Signing in..." : "Sign In"}
                            </span>

                            {loading && (
                                <span className="
      absolute right-5
      h-4 w-4
      animate-spin rounded-full
      border-2 border-current
      border-t-transparent
    " />
                            )}
                        </button>
                    </form>

                    {/* Footer */}
                    <div className="mt-9 border-t border-(--color-border) pt-6 text-center">
                        <p className="text-[10px] leading-6 tracking-wide text-(--color-text-secondary)">
                            This area is restricted to authorized administrators.
                        </p>
                    </div>
                </div>


            </div>
        </main>
    );
}
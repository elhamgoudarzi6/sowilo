
"use client";

import { useEffect, useRef, useState } from "react";

interface BaseTimePickerProps {
    value?: string | null;
    onChange: (value: string | null) => void;
    placeholder?: string;
    disabled?: boolean;
    className?: string;
}

export default function BaseTimePicker({
    value,
    onChange,
    placeholder = "ساعت را انتخاب کنید",
    disabled = false,
    className = "",
}: BaseTimePickerProps) {
    const [open, setOpen] = useState(false);
    const [hour, setHour] = useState(
        Number(value?.split(":")[0] ?? 12)
    );
    const [minute, setMinute] = useState(
        Number(value?.split(":")[1] ?? 0)
    );

    const rootRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!open) return;

        const handleClickOutside = (event: MouseEvent) => {
            if (
                rootRef.current &&
                !rootRef.current.contains(event.target as Node)
            ) {
                setOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener(
                "mousedown",
                handleClickOutside
            );
        };
    }, [open]);

    useEffect(() => {
        if (!open && value) {
            const [h, m] = value.split(":").map(Number);

            if (
                Number.isInteger(h) &&
                h >= 0 &&
                h <= 23 &&
                Number.isInteger(m) &&
                m >= 0 &&
                m <= 59
            ) {
                setHour(h);
                setMinute(m);
            }
        }
    }, [value, open]);

    const updateTime = (h: number, m: number) => {
        const nextHour = (h + 24) % 24;
        const nextMinute = (m + 60) % 60;

        setHour(nextHour);
        setMinute(nextMinute);

        onChange(
            `${String(nextHour).padStart(2, "0")}:${String(
                nextMinute
            ).padStart(2, "0")}`
        );
    };

    const displayValue = value
        ? value
        : "";

    return (
        <div ref={rootRef} className="relative w-full">
            <button
                type="button"
                disabled={disabled}
                onClick={() => setOpen((prev) => !prev)}
                className={`
                    flex h-12 w-full items-center justify-between
                    rounded-xl border border-gray-200 bg-gray-50
                    px-4 text-sm outline-none transition
                    hover:border-(--primary-color)
                    focus:border-(--primary-color)
                    focus:bg-white
                    disabled:cursor-not-allowed
                    disabled:opacity-60
                    ${displayValue ? "text-gray-700" : "text-gray-400"}
                    ${className}
                `}
            >
                <span>{displayValue || placeholder}</span>

                <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.7"
                    className="text-(--primary-color)"
                >
                    <circle cx="12" cy="12" r="9" />
                    <path d="M12 7v5l3 2" />
                </svg>
            </button>

            {open && !disabled && (
                <div
                    dir="ltr"
                    className="
                        absolute right-0 top-full z-50 mt-2
                        flex w-47.5 items-center justify-center
                        gap-4 rounded-2xl border border-gray-100
                        bg-white p-4 shadow-lg
                    "
                >
                    {/* Hour */}
                    <div className="flex flex-col items-center gap-2">
                        <button
                            type="button"
                            aria-label="افزایش ساعت"
                            onClick={() => updateTime(hour + 1, minute)}
                            className="
                                flex h-8 w-8 items-center justify-center
                                rounded-full text-(--primary-color)
                                transition hover:bg-gray-100
                            "
                        >
                            <svg
                                width="18"
                                height="18"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                            >
                                <path d="m6 15 6-6 6 6" />
                            </svg>
                        </button>

                        <span className="min-w-10 text-center text-xl font-semibold tabular-nums text-gray-700">
                            {String(hour).padStart(2, "0")}
                        </span>

                        <button
                            type="button"
                            aria-label="کاهش ساعت"
                            onClick={() => updateTime(hour - 1, minute)}
                            className="
                                flex h-8 w-8 items-center justify-center
                                rounded-full text-(--primary-color)
                                transition hover:bg-gray-100
                            "
                        >
                            <svg
                                width="18"
                                height="18"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                            >
                                <path d="m18 9-6 6-6-6" />
                            </svg>
                        </button>
                    </div>

                    <span className="pb-1 text-xl font-semibold text-(--primary-color)">
                        :
                    </span>

                    {/* Minute */}
                    <div className="flex flex-col items-center gap-2">
                        <button
                            type="button"
                            aria-label="افزایش دقیقه"
                            onClick={() => updateTime(hour, minute + 1)}
                            className="
                                flex h-8 w-8 items-center justify-center
                                rounded-full text-(--primary-color)
                                transition hover:bg-gray-100
                            "
                        >
                            <svg
                                width="18"
                                height="18"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                            >
                                <path d="m6 15 6-6 6 6" />
                            </svg>
                        </button>

                        <span className="min-w-10 text-center text-xl font-semibold tabular-nums text-gray-700">
                            {String(minute).padStart(2, "0")}
                        </span>

                        <button
                            type="button"
                            aria-label="کاهش دقیقه"
                            onClick={() => updateTime(hour, minute - 1)}
                            className="
                                flex h-8 w-8 items-center justify-center
                                rounded-full text-(--primary-color)
                                transition hover:bg-gray-100
                            "
                        >
                            <svg
                                width="18"
                                height="18"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                            >
                                <path d="m18 9-6 6-6-6" />
                            </svg>
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

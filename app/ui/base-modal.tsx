
"use client";

import {
  useEffect,
  useId,
  type CSSProperties,
  type MouseEvent,
  type ReactNode,
} from "react";
import { FiX } from "react-icons/fi";

export type BaseModalSize = "sm" | "md" | "lg" | "xl" | "2xl" | "full";

export interface BaseModalProps {
  open: boolean;
  onClose: () => void;
  title?: ReactNode;
  description?: ReactNode;
  headerActions?: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
  size?: BaseModalSize;
  dir?: "rtl" | "ltr";
  className?: string;
  bodyClassName?: string;
  overlayClassName?: string;
  ariaLabel?: string;
  showCloseButton?: boolean;
  closeOnBackdrop?: boolean;
  closeOnEscape?: boolean;
  isBusy?: boolean;
  fullScreen?: boolean;
}

const sizeClasses: Record<BaseModalSize, string> = {
  sm: "max-w-md",
  md: "max-w-xl",
  lg: "max-w-3xl",
  xl: "max-w-5xl",
  "2xl": "max-w-7xl",
  full: "max-w-none",
};

export default function BaseModal({
  open,
  onClose,
  title,
  description,
  headerActions,
  children,
  footer,
  size = "lg",
  dir = "rtl",
  className = "",
  bodyClassName = "p-6",
  overlayClassName = "",
  ariaLabel,
  showCloseButton = true,
  closeOnBackdrop = true,
  closeOnEscape = true,
  isBusy = false,
  fullScreen = false,
}: BaseModalProps) {
  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && closeOnEscape && !isBusy) {
        onClose();
      }
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, closeOnEscape, isBusy, onClose]);

  const titleId = useId();

  if (!open) return null;

  const panelStyle: CSSProperties | undefined = fullScreen
    ? {
      width: "100vw",
      height: "100dvh",
      maxHeight: "100dvh",
    }
    : undefined;

  const handleBackdropClick = (
    event: MouseEvent<HTMLDivElement>,
  ) => {
    if (
      closeOnBackdrop &&
      !isBusy &&
      event.target === event.currentTarget
    ) {
      onClose();
    }
  };

  return (
    <div
      className={[
        "fixed inset-0 z-50 flex items-center justify-center",
        "bg-black/40 p-4",
        overlayClassName,
      ].join(" ")}
      onMouseDown={handleBackdropClick}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-label={typeof title === "string" ? undefined : ariaLabel}
        aria-labelledby={title ? titleId : undefined}
        dir={dir}
        style={panelStyle}
        className={[
          "flex w-full flex-col overflow-hidden bg-white shadow-2xl",
          "rounded-2xl",
          footer && !fullScreen
            ? "max-h-[90dvh]"
            : "max-h-[90dvh]",
          sizeClasses[size],
          fullScreen ? "max-w-none! rounded-none!" : "",
          className,
        ]
          .filter(Boolean)
          .join(" ")}
      >
        {(title || description || headerActions || showCloseButton) && (
          <header className="flex shrink-0 items-start justify-between gap-4 border-b border-gray-100 bg-white px-6 py-5">
            <div className="min-w-0 flex-1">
              {title && (
                <h2
                  id={titleId}
                  className="text-base font-bold text-gray-900"
                >
                  {title}
                </h2>
              )}

              {description && (
                <div className="mt-1 text-xs leading-6 text-gray-400">
                  {description}
                </div>
              )}
            </div>

            <div className="flex shrink-0 items-center gap-2">
              {headerActions}

              {showCloseButton && (
                <button
                  type="button"
                  onClick={onClose}
                  disabled={isBusy}
                  aria-label="بستن پنجره"
                  className="flex h-9 w-9 items-center justify-center rounded-lg text-gray-400 transition hover:bg-gray-100 hover:text-gray-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <FiX size={18} />
                </button>
              )}
            </div>
          </header>
        )}

        <div
          className={[
            "min-h-0 flex-1 overflow-y-auto",
            bodyClassName,
          ]
            .filter(Boolean)
            .join(" ")}
        >
          {children}
        </div>

        {footer && (
          <footer className="relative z-10 flex shrink-0 items-center justify-between gap-3 border-t border-gray-100 bg-white px-6 py-4">
            {footer}
          </footer>
        )}
      </section>
    </div>
  );
}

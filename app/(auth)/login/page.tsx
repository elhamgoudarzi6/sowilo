"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";

import { authService } from "@/services/auth.service";
import { setCredentials } from "@/store/slices/auth.slice";
import { ROUTES } from "@/auth/constants";
import TextField from "@mui/material/TextField";

type LoginStep = "mobile" | "otp";
type ApiError = {
  response?: {
    data?: {
      message?: string | string[];
    };
  };
};

function getErrorMessage(error: unknown, fallback: string): string {
  const apiError = error as ApiError;
  const message = apiError.response?.data?.message;

  if (Array.isArray(message)) return message.join("، ");
  if (typeof message === "string") return message;

  return fallback;
}

export default function LoginPage() {
  const router = useRouter();
  const dispatch = useDispatch();

  const [step, setStep] = useState<LoginStep>("mobile");
  const [mobile, setMobile] = useState("");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isRequestingOtp, setIsRequestingOtp] = useState(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);

  const normalizedMobile = mobile.replace(/\D/g, "");

  const handleContinue = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setSuccessMessage("");

    if (!/^09\d{9}$/.test(normalizedMobile)) {
      setError("شماره موبایل باید ۱۱ رقم و با ۰۹ شروع شود.");
      return;
    }

    setIsRequestingOtp(true);

    try {
      await authService.requestOtp({ mobile: normalizedMobile });

      setMobile(normalizedMobile);
      setOtp("");
      setStep("otp");
      setSuccessMessage("کد تأیید برای شماره موبایل شما ارسال شد.");
    } catch (err) {
      setError(
        getErrorMessage(
          err,
          "ارسال کد تأیید ناموفق بود. لطفاً دوباره تلاش کنید."
        )
      );
    } finally {
      setIsRequestingOtp(false);
    }
  };

  const handleVerify = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setSuccessMessage("");

    if (!/^09\d{9}$/.test(normalizedMobile)) {
      setError("شماره موبایل معتبر نیست.");
      setStep("mobile");
      return;
    }

    if (!/^\d{6}$/.test(otp)) {
      setError("کد تأیید باید ۶ رقم باشد.");
      return;
    }

    setIsVerifyingOtp(true);

    try {
      const { user, accessToken } = await authService.verifyOtp({
        mobile: normalizedMobile,
        code: otp,
      });

      dispatch(
        setCredentials({
          user,
          accessToken,
        })
      );

      router.replace(user.type === "admin" ? ROUTES.ADMIN : ROUTES.USER);
    } catch (err) {
      setError(
        getErrorMessage(
          err,
          "تأیید کد ناموفق بود. کد را بررسی کنید و دوباره تلاش کنید."
        )
      );
    } finally {
      setIsVerifyingOtp(false);
    }
  };

  const handleResendOtp = async () => {
    setError("");
    setSuccessMessage("");
    setIsRequestingOtp(true);

    try {
      await authService.requestOtp({ mobile: normalizedMobile });
      setOtp("");
      setSuccessMessage("درخواست ارسال مجدد کد ثبت شد.");
    } catch (err) {
      setError(
        getErrorMessage(
          err,
          "ارسال مجدد کد ناموفق بود. لطفاً کمی بعد دوباره تلاش کنید."
        )
      );
    } finally {
      setIsRequestingOtp(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-10 text-(--color-text)">
      <section className="w-full max-w-md rounded-2xl border border-(--color-border) bg-(--color-surface) p-6 sm:p-9">
        <div className="my-5">
          <h1 className="mb-3 text-center text-xl font-extrabold tracking-tighter">
            {step === "mobile"
              ? "ورود به حساب کاربری"
              : "تأیید شماره موبایل"}
          </h1>

          <p className="text-xs md:text-sm leading-7 text-(--color-text-secondary)">
            {step === "mobile"
              ? "برای ورود یا ساخت حساب کاربری، شماره موبایل را وارد کن."
              : `کد ۶ رقمی ارسال‌شده به شماره ${mobile} را وارد کن.`}
          </p>
        </div>

        {step === "mobile" ? (
          <form onSubmit={handleContinue} className=" space-y-5">
            <div>
              <TextField
                id="mobile"
                label="شماره موبایل"
                variant="outlined"
                fullWidth
                type="tel"
                disabled={isRequestingOtp}
                value={mobile}
                onChange={(event) => {
                  setMobile(event.target.value.replace(/\D/g, "").slice(0, 11));
                  setError("");
                  setSuccessMessage("");
                }}
                slotProps={{
                  htmlInput: {
                    inputMode: "numeric",
                    maxLength: 11,
                    autoComplete: "tel-national",
                  },
                }}
                sx={{
                  direction: "rtl",
                  "& .MuiInputLabel-root": {
                    right: 15,
                    left: "auto",
                    transformOrigin: "top right",
                    paddingRight: "15px",
                    paddingLeft: "8px",
                    fontSize: "14px"
                  },

                  "& .MuiInputLabel-root.MuiInputLabel-shrink": {
                    transform: "translate(0, -10px) scale(0.80)",
                    padding: "0 5px",
                  },

                  "& .MuiOutlinedInput-root": {
                    borderRadius: "12px",
                  },

                  "& .MuiOutlinedInput-input": {
                    textAlign: "left",
                  },

                  "& .MuiOutlinedInput-notchedOutline": {
                    textAlign: "right",
                  },

                  "& .MuiOutlinedInput-root fieldset": {
                    borderColor: "var(--color-border)",
                  },

                  "& .MuiOutlinedInput-root:hover fieldset": {
                    borderColor: "var(--color-primary)",
                  },

                  "& .MuiOutlinedInput-root.Mui-focused fieldset": {
                    borderColor: "var(--color-primary)",
                  },

                  "& .MuiInputLabel-root.Mui-focused": {
                    color: "var(--color-primary)",
                  },

                  "& input:-webkit-autofill": {
                    WebkitBoxShadow: "0 0 0 100px var(--color-surface) inset",
                    WebkitTextFillColor: "var(--color-text)",
                    caretColor: "var(--color-text)",
                    borderRadius: "12px",
                    transition: "background-color 9999s ease-out",
                  },
                }}
              />
            </div>

            {error && (
              <p role="alert" className="text-sm text-(--color-primary)">
                {error}
              </p>
            )}

            {successMessage && (
              <p role="status" className="text-sm text-green-700">
                {successMessage}
              </p>
            )}

            <button
              type="submit"
              disabled={isRequestingOtp}
              className="w-full rounded-xl bg-(--color-primary) px-4 py-3.5 font-bold text-(--color-text-inverse) hover:bg-(--color-primary-hover) disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isRequestingOtp ? "در حال ارسال کد..." : "ورود"}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerify} className="space-y-5">
            <div>
              <label
                htmlFor="otp"
                className="mb-2 block text-sm font-medium"
              >
                کد تأیید ۶ رقمی
              </label>

              <input
                id="otp"
                type="text"
                inputMode="numeric"
                autoComplete="one-time-code"
                dir="ltr"
                required
                disabled={isVerifyingOtp}
                value={otp}
                onChange={(event) => {
                  setOtp(event.target.value.replace(/\D/g, "").slice(0, 6));
                  setError("");
                  setSuccessMessage("");
                }}
                placeholder="------"
                maxLength={6}
                className="w-full rounded-xl border border-(--color-border) bg-(--color-surface) px-4 py-4 text-center text-2xl tracking-[0.5em] outline-none focus:border-(--color-primary) disabled:opacity-60"
              />
            </div>

            {error && (
              <p role="alert" className="text-sm text-(--color-primary)">
                {error}
              </p>
            )}

            {successMessage && (
              <p role="status" className="text-sm text-green-700">
                {successMessage}
              </p>
            )}

            <button
              type="submit"
              disabled={isVerifyingOtp || isRequestingOtp}
              className="w-full rounded-xl bg-(--color-primary) px-4 py-3.5 font-medium text-(--color-text-inverse) hover:bg-(--color-primary-hover) disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isVerifyingOtp ? "در حال بررسی کد..." : "تأیید و ورود"}
            </button>

            <button
              type="button"
              disabled={isVerifyingOtp || isRequestingOtp}
              onClick={() => {
                setStep("mobile");
                setOtp("");
                setError("");
                setSuccessMessage("");
              }}
              className="w-full rounded-xl border border-(--color-border) px-4 py-3 text-sm hover:bg-(--color-background) disabled:opacity-60"
            >
              تغییر شماره موبایل
            </button>

            <button
              type="button"
              disabled={isRequestingOtp || isVerifyingOtp}
              onClick={handleResendOtp}
              className="w-full py-2 text-sm text-(--color-primary) disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isRequestingOtp ? "در حال ارسال..." : "دریافت مجدد کد"}
            </button>
          </form>
        )}

        <p className="mt-7 border-t border-(--color-border) pt-5 text-center text-xs leading-6 text-(--color-text-secondary)">
          با ورود به فروشگاه، شرایط استفاده و قوانین حریم خصوصی را می‌پذیری.
        </p>
      </section>
    </main>
  );
}
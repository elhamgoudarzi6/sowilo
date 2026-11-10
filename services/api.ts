import axios, {
  type InternalAxiosRequestConfig,
} from "axios";

import { token } from "@/auth/token";

interface RetryableRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

const baseURL = process.env.NEXT_PUBLIC_API_URL;

const api = axios.create({
  baseURL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

const AUTH_ENDPOINTS = [
  "/auth/user/request-otp",
  "/auth/user/verify-otp",
  "/auth/admin/login",
  "/auth/refresh",
  "/auth/logout",
];

const isAuthEndpoint = (url?: string): boolean => {
  if (!url) return false;

  const pathname = url.split("?")[0];

  return AUTH_ENDPOINTS.some((endpoint) =>
    pathname.endsWith(endpoint),
  );
};

api.interceptors.request.use(
  (config) => {
    if (isAuthEndpoint(config.url)) {
      return config;
    }

    const accessToken = token.get();

    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

let refreshPromise: Promise<string> | null = null;

const refreshAccessToken = async (): Promise<string> => {
  if (!baseURL) {
    throw new Error("NEXT_PUBLIC_API_URL تنظیم نشده است.");
  }

  // از axios خام استفاده می‌کنیم تا درخواست Refresh دوباره
  // وارد همین interceptor و چرخهٔ Refresh نشود.
  const response = await axios.post(
    `${baseURL.replace(/\/$/, "")}/auth/refresh`,
    undefined,
    {
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
      },
    },
  );

  const data = response.data?.data;
  const newAccessToken = data?.accessToken;

  if (
    typeof newAccessToken !== "string" ||
    newAccessToken.length === 0
  ) {
    throw new Error("پاسخ Refresh فاقد Access Token معتبر است.");
  }

  token.set(newAccessToken);

  const profile = data?.user ?? data?.admin;

  if (profile?.type === "user" || profile?.type === "admin") {
    token.setAuthType(profile.type);
  }

  return newAccessToken;
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest =
      error.config as RetryableRequestConfig | undefined;

    if (
      error.response?.status !== 401 ||
      !originalRequest ||
      originalRequest._retry ||
      isAuthEndpoint(originalRequest.url)
    ) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    try {
      if (!refreshPromise) {
        refreshPromise = refreshAccessToken().finally(() => {
          refreshPromise = null;
        });
      }

      const newAccessToken = await refreshPromise;

      originalRequest.headers.Authorization =
        `Bearer ${newAccessToken}`;

      return api(originalRequest);
    } catch (refreshError) {
      const previousAuthType = token.getAuthType();

      token.remove();

      if (typeof window !== "undefined") {
        const loginRoute =
          previousAuthType === "admin"
            ? "/admin-login"
            : "/login";

        if (window.location.pathname !== loginRoute) {
          window.location.replace(loginRoute);
        }
      }

      return Promise.reject(refreshError);
    }
  },
);

export default api;
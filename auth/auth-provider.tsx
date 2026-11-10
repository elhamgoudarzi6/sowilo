"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { useDispatch } from "react-redux";

import { authService } from "@/services/auth.service";
import {
  clearAuth,
  setCredentials,
  setInitialized,
} from "@/store/slices/auth.slice";

interface AuthContextValue {
  initialized: boolean;
}

const AuthContext = createContext<AuthContextValue>({
  initialized: false,
});

export function AuthProvider({
  children,
}: {
  children: ReactNode;
}) {
  const dispatch = useDispatch();
  const [initialized, setLocalInitialized] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const initializeAuth = async () => {
      try {
        const result = await authService.restore();

        if (cancelled) return;

        dispatch(
          setCredentials({
            user: result.user,
            accessToken: result.accessToken,
          }),
        );
      } catch {
        if (cancelled) return;
        dispatch(clearAuth());
      } finally {
        if (!cancelled) {
          dispatch(setInitialized());
          setLocalInitialized(true);
        }
      }
    };

    void initializeAuth();

    return () => {
      cancelled = true;
    };
  }, [dispatch]);

  return (
    <AuthContext.Provider value={{ initialized }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuthContext = () => useContext(AuthContext);
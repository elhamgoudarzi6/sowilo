import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

import type { AuthState, AuthUser } from "@/auth/types";
import { token } from "@/auth/token";

const initialState: AuthState = {
  user: null,
  accessToken: null,
  isAuthenticated: false,
  loading: false,
  initialized: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{
        user: AuthUser;
        accessToken: string;
      }>,
    ) => {
      const { user, accessToken } = action.payload;

      state.user = user;
      state.accessToken = accessToken;
      state.isAuthenticated = true;
      state.loading = false;

      token.set(accessToken);
      token.setAuthType(user.type);
    },

    updateAccessToken: (state, action: PayloadAction<string>) => {
      state.accessToken = action.payload;
      token.set(action.payload);
    },

    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },

    setInitialized: (state) => {
      state.initialized = true;
    },

    clearAuth: (state) => {
      state.user = null;
      state.accessToken = null;
      state.isAuthenticated = false;
      state.loading = false;
      state.initialized = true;

      token.remove();
    },
  },
});

export const {
  setCredentials,
  updateAccessToken,
  setLoading,
  setInitialized,
  clearAuth,
} = authSlice.actions;

export default authSlice.reducer;
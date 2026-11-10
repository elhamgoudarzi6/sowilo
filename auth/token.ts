export type AuthType = "user" | "admin" | null;

let accessToken: string | null = null;
let authType: AuthType = null;

export const token = {
  get(): string | null {
    return accessToken;
  },

  set(value: string | null): void {
    accessToken = value;

    if (value === null) {
      authType = null;
    }
  },

  remove(): void {
    accessToken = null;
    authType = null;
  },

  getAuthType(): AuthType {
    return authType;
  },

  setAuthType(value: AuthType): void {
    authType = value;
  },
};
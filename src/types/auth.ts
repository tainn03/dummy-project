// Typescript types for auth-related operations

// Type for storing authentication state in React Query cache
export interface AuthState {
  isAuthenticated: boolean;
  user: AuthUser | null;
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
}

// Keys for React Query authentication cache
export const AUTH_CACHE_KEYS = {
  user: ["auth", "user"],
  isAuthenticated: ["auth", "isAuthenticated"],
};

// Event names for subscriptions to auth state changes
export const AUTH_EVENTS = {
  login: "auth:login",
  logout: "auth:logout",
  register: "auth:register",
};

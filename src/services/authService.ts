import { API_BASE_URL, handleApiResponse, getAuthHeaders } from "./api";

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
}

export interface AuthResponse {
  token: string;
  user: AuthUser;
}

export const authService = {
  // Login user
  login: async (credentials: LoginRequest): Promise<AuthResponse> => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(credentials),
    });

    const data = await handleApiResponse<{ token: string; user: AuthUser }>(
      response
    );
    return data;
  },

  // Register user
  register: async (userData: RegisterRequest): Promise<AuthResponse> => {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(userData),
    });

    const data = await handleApiResponse<{ token: string; user: AuthUser }>(
      response
    );
    return data;
  },

  // Logout user
  logout: async (): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/auth/logout`, {
      method: "POST",
      credentials: "include",
    });

    await handleApiResponse<void>(response);
  },

  // Change password
  changePassword: async (
    passwordData: ChangePasswordRequest,
    token: string
  ): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/auth/change-password`, {
      method: "PUT",
      headers: getAuthHeaders(token),
      credentials: "include",
      body: JSON.stringify(passwordData),
    });

    await handleApiResponse<void>(response);
  },
};

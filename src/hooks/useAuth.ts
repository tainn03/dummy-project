"use client";

import {
  useMutation,
  UseMutationResult,
  useQueryClient,
  useQuery,
} from "@tanstack/react-query";
import {
  authService,
  LoginRequest,
  RegisterRequest,
  ChangePasswordRequest,
  AuthResponse,
  AuthUser,
} from "@/services/authService";
import { useState, useEffect } from "react";

// Get user from localStorage
const getUserFromStorage = (): AuthUser | null => {
  if (typeof window === "undefined") return null;
  const userJson = localStorage.getItem("user");
  if (!userJson) return null;
  try {
    return JSON.parse(userJson);
  } catch {
    return null;
  }
};

export const useLogin = (): UseMutationResult<
  AuthResponse,
  Error,
  LoginRequest,
  unknown
> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authService.login,
    onSuccess: (data: AuthResponse) => {
      // Save token and user to localStorage for persistence
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      // Update auth state in cache
      queryClient.setQueryData(["auth", "user"], data.user);
      queryClient.setQueryData(["auth", "isAuthenticated"], true);
    },
  });
};

export const useRegister = (): UseMutationResult<
  AuthResponse,
  Error,
  RegisterRequest,
  unknown
> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authService.register,
    onSuccess: (data: AuthResponse) => {
      // Save token to localStorage for persistence
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      // Update auth state in cache
      queryClient.setQueryData(["auth", "user"], data.user);
      queryClient.setQueryData(["auth", "isAuthenticated"], true);

      // Invalidate queries that might depend on auth status
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
  });
};

export const useLogout = (): UseMutationResult<void, Error, void, unknown> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authService.logout,
    onSuccess: () => {
      // Remove token and user from localStorage
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      // Update auth state in cache
      queryClient.setQueryData(["auth", "user"], null);
      queryClient.setQueryData(["auth", "isAuthenticated"], false);

      // Clear all queries from cache
      queryClient.clear();
    },
  });
};

export const useChangePassword = (
  token: string
): UseMutationResult<void, Error, ChangePasswordRequest, unknown> => {
  return useMutation({
    mutationFn: (data: ChangePasswordRequest) =>
      authService.changePassword(data, token),
  });
};

// Hook to get the current authentication state
export const useAuthState = () => {
  const [initialized, setInitialized] = useState(false);
  const queryClient = useQueryClient();

  // Initialize auth state from localStorage on mount
  useEffect(() => {
    if (!initialized && typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      const user = getUserFromStorage();

      queryClient.setQueryData(["auth", "user"], user);
      queryClient.setQueryData(["auth", "isAuthenticated"], !!token && !!user);

      setInitialized(true);
    }
  }, [initialized, queryClient]);

  // Get auth state from React Query cache
  const { data: user = null } = useQuery({
    queryKey: ["auth", "user"],
    queryFn: () => getUserFromStorage(), // Fallback function to get user from localStorage
    enabled: initialized,
    staleTime: Infinity, // Don't refetch automatically
    gcTime: Infinity, // Never garbage collect this query
  });

  const { data: isAuthenticated = false } = useQuery({
    queryKey: ["auth", "isAuthenticated"],
    queryFn: () => {
      // Fallback function to check authentication from localStorage
      const token = localStorage.getItem("token");
      const user = getUserFromStorage();
      return !!token && !!user;
    },
    enabled: initialized,
    staleTime: Infinity,
    gcTime: Infinity,
  });

  return {
    user,
    isAuthenticated,
    loading: !initialized,
  };
};

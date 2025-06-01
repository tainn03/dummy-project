"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppSelector, useAppDispatch } from "@/hooks/redux";
import { checkAuthStatus } from "@/redux/reducers/authReducer";

export interface UseAuthGuardOptions {
  redirectTo?: string;
  requireAuth?: boolean;
}

/**
 * Custom hook for managing authentication protection
 * @param options Configuration options for the auth guard
 * @returns Authentication state and utilities
 */
export function useAuthGuard(options: UseAuthGuardOptions = {}) {
  const { redirectTo = "/login", requireAuth = true } = options;

  const router = useRouter();
  const dispatch = useAppDispatch();
  const { isAuthenticated, loading, user } = useAppSelector(
    (state) => state.auth
  );

  useEffect(() => {
    // Initialize auth state from localStorage on first load
    const initializeAuth = async () => {
      const token = localStorage.getItem("token");
      const storedUser = localStorage.getItem("user");

      if (token && storedUser) {
        // Restore auth state if we have stored credentials
        dispatch(checkAuthStatus());
      }
    };

    initializeAuth();
  }, [dispatch]);

  useEffect(() => {
    // Handle redirects based on auth status
    if (!loading) {
      if (requireAuth && !isAuthenticated) {
        // User should be authenticated but isn't - redirect to login
        router.push(redirectTo);
      } else if (!requireAuth && isAuthenticated && redirectTo === "/login") {
        // User is authenticated but on login page - redirect to dashboard
        router.push("/dashboard");
      }
    }
  }, [isAuthenticated, loading, requireAuth, redirectTo, router]);

  return {
    isAuthenticated,
    loading,
    user,
    isReady: !loading, // Helper to know when auth state is determined
  };
}

export default useAuthGuard;

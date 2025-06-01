"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAppSelector, useAppDispatch } from "@/hooks/redux";
import { checkAuthStatus } from "@/redux/reducers/authReducer";

interface AuthGuardProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export default function AuthGuard({ children, fallback }: AuthGuardProps) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { isAuthenticated, loading } = useAppSelector((state) => state.auth);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // Check authentication status on component mount
    const checkAuth = async () => {
      // Check if token exists in localStorage
      const storedToken = localStorage.getItem("token");
      const storedUser = localStorage.getItem("user");

      if (storedToken && storedUser) {
        // Dispatch action to restore auth state from localStorage
        dispatch(checkAuthStatus());
      }

      setIsInitialized(true);
    };

    checkAuth();
  }, [dispatch]);

  useEffect(() => {
    // Redirect to login if not authenticated and initialization is complete
    if (isInitialized && !loading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, loading, isInitialized, router]);

  // Show loading state while checking auth or during initialization
  if (!isInitialized || loading) {
    return (
      fallback || (
        <div className="flex items-center justify-center h-screen">
          <div className="flex flex-col items-center space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-blue-500 border-solid"></div>
            <p className="text-gray-600">Checking authentication...</p>
          </div>
        </div>
      )
    );
  }

  // If not authenticated, the useEffect will redirect
  if (!isAuthenticated) {
    return null;
  }

  // User is authenticated, render children
  return <>{children}</>;
}

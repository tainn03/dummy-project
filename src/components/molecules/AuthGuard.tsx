"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface AuthGuardProps {
  children: React.ReactNode;
}

export default function AuthGuard({ children }: AuthGuardProps) {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    // Check for token in localStorage
    const token = localStorage.getItem("token");

    if (!token) {
      // No token found, redirect to login
      setIsAuthenticated(false);
      router.push("/login");
    } else {
      // Token found, assuming user is authenticated
      setIsAuthenticated(true);
    }
  }, [router]);

  // Show loading state while checking auth
  if (isAuthenticated === null) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-blue-500 border-solid"></div>
      </div>
    );
  }

  // If not authenticated, the useEffect will redirect
  if (!isAuthenticated) {
    return null;
  }

  // User is authenticated, render children
  return <>{children}</>;
}

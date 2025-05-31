"use client";

import { useState, useEffect } from "react";
import { AuthUser } from "@/services/authService";

interface UseAuthReturn {
  isAuthenticated: boolean;
  user: AuthUser | null;
  token: string | null;
  logout: () => void;
}

export function useAuthState(): UseAuthReturn {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    // Check authentication state on mount and when localStorage changes
    const checkAuth = () => {
      const storedToken = localStorage.getItem("token");
      const storedUser = localStorage.getItem("user");

      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
        setIsAuthenticated(true);
      } else {
        setToken(null);
        setUser(null);
        setIsAuthenticated(false);
      }
    };

    // Initial check
    checkAuth();

    // Listen for storage changes
    window.addEventListener("storage", checkAuth);

    return () => {
      window.removeEventListener("storage", checkAuth);
    };
  }, []);

  // Logout function
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
  };

  return { isAuthenticated, user, token, logout };
}

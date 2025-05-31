"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuthState, useLogout } from "@/hooks/useAuth";
import Button from "../atoms/Button";

export default function NavBar() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthState();
  const logout = useLogout();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = async () => {
    logout.mutate();
  };

  return (
    <nav className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="text-xl font-bold text-blue-600">
                Task Manager
              </Link>
            </div>
            {isAuthenticated && (
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                <Link
                  href="/dashboard"
                  className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                >
                  Dashboard
                </Link>
              </div>
            )}
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            {isAuthenticated ? (
              <div className="ml-3 relative flex items-center space-x-4">
                <span className="text-sm font-medium text-gray-700">
                  {user?.name}
                </span>
                <Button
                  variant="outline"
                  size="small"
                  onClick={() => router.push("/profile")}
                >
                  Profile
                </Button>
                <Button
                  variant="primary"
                  size="small"
                  onClick={handleLogout}
                  disabled={logout.isPending}
                >
                  {logout.isPending ? "Logging out..." : "Logout"}
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Button
                  variant="outline"
                  size="small"
                  onClick={() => router.push("/login")}
                >
                  Login
                </Button>
                <Button
                  variant="primary"
                  size="small"
                  onClick={() => router.push("/register")}
                >
                  Register
                </Button>
              </div>
            )}
          </div>
          <div className="-mr-2 flex items-center sm:hidden">
            <button
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
              aria-expanded="false"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <span className="sr-only">Open main menu</span>
              <svg
                className="h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="sm:hidden">
          {isAuthenticated ? (
            <div className="pt-2 pb-3 space-y-1">
              <Link
                href="/dashboard"
                className="bg-blue-50 border-blue-500 text-blue-700 block pl-3 pr-4 py-2 border-l-4 text-base font-medium"
              >
                Dashboard
              </Link>
              <Link
                href="/profile"
                className="border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700 block pl-3 pr-4 py-2 border-l-4 text-base font-medium"
              >
                Profile
              </Link>
              <button
                className="border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700 block pl-3 pr-4 py-2 border-l-4 text-base font-medium w-full text-left"
                onClick={handleLogout}
                disabled={logout.isPending}
              >
                {logout.isPending ? "Logging out..." : "Logout"}
              </button>
            </div>
          ) : (
            <div className="pt-2 pb-3 space-y-1">
              <Link
                href="/login"
                className="border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700 block pl-3 pr-4 py-2 border-l-4 text-base font-medium"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700 block pl-3 pr-4 py-2 border-l-4 text-base font-medium"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}

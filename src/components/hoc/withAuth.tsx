"use client";

import { ComponentType } from "react";
import AuthGuard from "@/components/molecules/AuthGuard";

/**
 * Higher-order component that wraps a component with authentication protection
 * @param WrappedComponent - The component to protect
 * @param fallback - Optional loading fallback component
 * @returns Protected component that requires authentication
 */
export function withAuth<P extends object>(
  WrappedComponent: ComponentType<P>,
  fallback?: React.ReactNode
) {
  const AuthenticatedComponent = (props: P) => {
    return (
      <AuthGuard fallback={fallback}>
        <WrappedComponent {...props} />
      </AuthGuard>
    );
  };

  // Set display name for debugging
  AuthenticatedComponent.displayName = `withAuth(${
    WrappedComponent.displayName || WrappedComponent.name
  })`;

  return AuthenticatedComponent;
}

export default withAuth;

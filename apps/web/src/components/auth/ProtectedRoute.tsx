"use client";

import { useEffect } from "react";
import type { ReactElement } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/auth";
import type { UserRole } from "@/lib/auth";
import { Skeleton } from "@luxeverse/ui";

export interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: UserRole;
  fallbackUrl?: string;
}

export function ProtectedRoute({
  children,
  requiredRole,
  fallbackUrl = "/login",
}: ProtectedRouteProps): ReactElement {
  const { user, isAuthenticated, isLoading } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace(fallbackUrl);
      return;
    }
    if (!isLoading && isAuthenticated && requiredRole && user?.role !== requiredRole) {
      router.replace("/account");
    }
  }, [isLoading, isAuthenticated, requiredRole, user, router, fallbackUrl]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="space-y-4 w-72">
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-1/2" />
        </div>
      </div>
    );
  }

  if (!isAuthenticated) return <></>;
  if (requiredRole && user?.role !== requiredRole) return <></>;

  return <>{children}</>;
}

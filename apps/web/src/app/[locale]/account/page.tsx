"use client";

import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { useEffect } from "react";
import { AccountOverview } from "@/components/account/AccountOverview";

export default function AccountPage() {
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === "unauthenticated") {
      redirect(`/login?callbackUrl=/account`);
    }
  }, [status]);

  if (status === "loading") {
    return (
      <div className="container-custom py-8 animate-pulse">
        <div className="h-8 w-1/3 bg-obsidian-200 rounded mb-8" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="h-[200px] bg-obsidian-200 rounded" />
          <div className="h-[200px] bg-obsidian-200 rounded" />
        </div>
      </div>
    );
  }

  if (!session?.user) {
    return null;
  }

  return (
    <div className="container-custom py-8">
      <h1 className="text-3xl font-display mb-8">Account</h1>
      <AccountOverview userId={session.user.id} />
    </div>
  );
}

import { Suspense } from "react";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { AccountOverview } from "@/components/account/AccountOverview";
import { AIStylistDashboard } from "@/components/account/AIStylistDashboard";

// Account page: RSC with server auth.
// IMPORTANT: Next.js 15/16 params is a REAL Promise. Never remove `await`.
// See: https://nextjs.org/docs/app/api-reference/components/page#params

interface AccountPageProps {
  params: Promise<{ locale: string }>;
}

export default async function AccountPage({ params }: AccountPageProps) {
  const { locale } = await params;
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect(`/${locale}/login?callbackUrl=/${locale}/account`);
  }

  return (
    <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <header className="mb-8 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-display font-medium text-obsidian-900">
            Welcome back, {session.user.name || "Collector"}.
          </h1>
          <p className="mt-1 text-sm text-obsidian-600">
            Manage your atelier, track orders, and refine your style.
          </p>
        </div>
        <span className="text-xs font-mono font-medium tracking-widest uppercase text-metallic-champagne">
          {session.user.role === "ADMIN" ? "Admin" : "Gold"}
        </span>
      </header>

      <div className="grid gap-6 lg:grid-cols-12">
        {/* Quick Stats Row */}
        <div className="lg:col-span-12 grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-obsidian-200 bg-obsidian-50 p-5 shadow-sm">
            <span className="text-xs font-mono uppercase text-obsidian-500">Active Orders</span>
            <p className="mt-2 text-2xl font-display font-medium text-obsidian-900">2</p>
          </div>
          <div className="rounded-xl border border-obsidian-200 bg-obsidian-50 p-5 shadow-sm">
            <span className="text-xs font-mono uppercase text-obsidian-500">Loyalty Points</span>
            <p className="mt-2 text-2xl font-display font-medium text-obsidian-900">8,450</p>
          </div>
          <div className="rounded-xl border border-obsidian-200 bg-obsidian-50 p-5 shadow-sm">
            <span className="text-xs font-mono uppercase text-obsidian-500">Wishlist</span>
            <p className="mt-2 text-2xl font-display font-medium text-obsidian-900">14</p>
          </div>
        </div>

        {/* Account Overview */}
        <div className="lg:col-span-8">
          <AccountOverview userId={session.user.id} />
        </div>

        {/* AI Stylist Dashboard (Client Component) */}
        <div className="lg:col-span-4">
          <Suspense
            fallback={
              <div
                className="h-64 animate-pulse rounded-xl bg-obsidian-100"
                aria-busy="true"
              />
            }
          >
            <AIStylistDashboard userId={session.user.id} />
          </Suspense>
        </div>
      </div>
    </main>
  );
}

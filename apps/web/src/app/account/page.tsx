import type { Metadata } from "next";
import Link from "next/link";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "My Account | LuxeVerse",
  description: "Manage your orders, preferences, and style profile.",
};

export default function AccountPage() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <header className="mb-8 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-display font-medium text-obsidian-900">Welcome back, Collector.</h1>
          <p className="mt-1 text-sm text-obsidian-600">Manage your atelier, track orders, and refine your style.</p>
        </div>
        <span className="text-xs font-mono font-medium tracking-widest uppercase text-metallic-champagne">Tier: Gold</span>
      </header>

      <div className="grid gap-6 lg:grid-cols-12">
        {/* Quick Stats */}
        <div className="lg:col-span-8 grid gap-6 sm:grid-cols-3">
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

        {/* Style Profile Prompt */}
        <div className="lg:col-span-4 rounded-xl border border-obsidian-200 bg-obsidian-50 p-6 shadow-sm flex flex-col justify-between">
          <div>
            <h2 className="text-lg font-display font-medium text-obsidian-900">Your Style Profile</h2>
            <p className="mt-2 text-sm text-obsidian-600">Complete your style quiz to unlock AI-curated recommendations and personalized fits.</p>
          </div>
          <Link href="/style-quiz" className="mt-4 inline-flex items-center justify-center rounded-lg bg-metallic-champagne px-4 py-2 text-sm font-medium text-obsidian-950 transition-colors hover:bg-metallic-gold">
            Take the Quiz →
          </Link>
        </div>

        {/* Recent Orders Skeleton */}
        <div className="lg:col-span-12 rounded-xl border border-obsidian-200 bg-obsidian-50 p-6 shadow-sm" aria-busy="true">
          <h2 className="mb-4 text-lg font-display font-medium text-obsidian-900">Recent Orders</h2>
          <div className="flex flex-col gap-4">
            {[1, 2].map((i) => (
              <div key={i} className="flex items-center justify-between border-b border-obsidian-200 pb-4 last:border-0 last:pb-0">
                <div className="flex items-center gap-4">
                  <div className="h-16 w-12 rounded-md bg-obsidian-200 animate-pulse" />
                  <div className="flex flex-col gap-2">
                    <div className="h-4 w-32 rounded bg-obsidian-200 animate-pulse" />
                    <div className="h-3 w-20 rounded bg-obsidian-200 animate-pulse" />
                  </div>
                </div>
                <div className="h-6 w-24 rounded bg-obsidian-200 animate-pulse" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}

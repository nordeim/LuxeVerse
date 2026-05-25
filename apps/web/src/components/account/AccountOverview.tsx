"use client";

import { useCallback } from "react";
import { trpc } from "@/trpc/server";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Progress } from "@/components/ui/Progress";
import { TIER_THRESHOLDS } from "@/server/loyalty.service";
import type { Tier } from "@/server/loyalty.service";

interface AccountOverviewProps {
  userId: string;
}

export function AccountOverview({ userId }: AccountOverviewProps) {
  const { data: balance } = trpc.loyalty.getBalance.useQuery(
    { userId },
    { enabled: !!userId }
  );

  const { data: history } = trpc.loyalty.getHistory.useQuery(
    { userId },
    { enabled: !!userId }
  );

  const tier = (balance?.tier ?? "BRONZE") as Tier;
  const lifetime = balance?.lifetimePoints ?? 0;

  const tiers = Object.keys(TIER_THRESHOLDS) as Tier[];
  const tierIndex = tiers.indexOf(tier);
  const nextTier = tierIndex < tiers.length - 1 ? tiers[tierIndex + 1] : null;

  const progress = nextTier
    ? Math.min(
        100,
        Math.round(
          ((lifetime - TIER_THRESHOLDS[tier]) /
            (TIER_THRESHOLDS[nextTier] - TIER_THRESHOLDS[tier])) *
            100
        )
      )
    : 100;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <div className="p-6">
            <h2 className="text-lg font-medium mb-2">Loyalty Status</h2>
            <p className="text-2xl font-display text-metallic-gold">
              {tier}
            </p>
            <p className="text-sm text-obsidian-500 mt-1">
              {balance?.loyaltyPoints ?? 0} points available
            </p>
          </div>
        </Card>

        <Card>
          <div className="p-6">
            <h2 className="text-lg font-medium mb-2">Lifetime Points</h2>
            <p className="text-2xl font-display">{lifetime}</p>
            {nextTier && (
              <div className="mt-2">
                <Progress value={progress} className="h-2" />
                <p className="text-xs text-obsidian-500 mt-1">
                  {progress}% to {nextTier}
                </p>
              </div>
            )}
          </div>
        </Card>

        <Card>
          <div className="p-6">
            <h2 className="text-lg font-medium mb-2">Recent Activity</h2>
            <p className="text-2xl font-display">
              {history?.length ?? 0} transactions
            </p>
            <p className="text-sm text-obsidian-500 mt-1">
              {history?.filter((h) => h.type === "EARNED").length ?? 0} earned
            </p>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PointsHistoryCard userId={userId} />
        <ProfileSettings userId={userId} />
      </div>
    </div>
  );
}

function PointsHistoryCard({ userId }: { userId: string }) {
  const { data: history } = trpc.loyalty.getHistory.useQuery(
    { userId },
    { enabled: !!userId }
  );

  return (
    <Card>
      <div className="p-6">
        <h2 className="text-lg font-medium mb-4">Points History</h2>
        {history && history.length > 0 ? (
          <ul className="space-y-3 max-h-[300px] overflow-y-auto">
            {history.slice(0, 10).map((item) => (
              <li
                key={item.id}
                className="flex justify-between items-center py-2 border-b border-obsidian-100 last:border-0"
              >
                <div>
                  <p className="font-medium">{item.description ?? item.type}</p>
                  <p className="text-sm text-obsidian-500">
                    {new Date(item.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <span
                  className={`text-sm font-medium ${
                    item.amount >= 0 ? "text-success" : "text-error"
                  }`}
                >
                  {item.amount >= 0 ? "+" : ""}
                  {item.amount}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-obsidian-500">No points activity yet.</p>
        )}
      </div>
    </Card>
  );
}

function ProfileSettings({ userId }: { userId: string }) {
  const utils = trpc.useUtils();
  const { mutate } = trpc.user.updateProfile.useMutation({
    onSuccess: () => {
      utils.user.getProfile.invalidate();
    },
  });

  const handleSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const formData = new FormData(e.currentTarget);
      const name = formData.get("name") as string;
      mutate({ userId, name });
    },
    [userId, mutate]
  );

  return (
    <Card>
      <div className="p-6">
        <h2 className="text-lg font-medium mb-4">Profile Settings</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium mb-1"
            >
              Display Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              className="w-full border border-input rounded-md px-3 py-2 focus-visible:outline-hidden focus-visible:ring-1"
            />
          </div>
          <Button type="submit">Update Profile</Button>
        </form>
      </div>
    </Card>
  );
}

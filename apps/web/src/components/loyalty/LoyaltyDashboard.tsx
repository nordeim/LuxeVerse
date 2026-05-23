"use client";

import { trpc } from "@/trpc/index";
import { Card, CardHeader, CardContent } from "@/components/ui/Card";
import { Progress } from "@/components/ui/Progress";
import { TIER_THRESHOLDS } from "@/server/loyalty.service";

interface LoyaltyDashboardProps {
  userId: string;
}

export function LoyaltyDashboard({ userId }: LoyaltyDashboardProps) {
  const { data: balance, isLoading } = trpc.loyalty.getBalance.useQuery({
    userId,
  });

  if (isLoading) {
    return <div aria-label="Loading loyalty data">Loading...</div>;
  }

  if (!balance) {
    return <div>No loyalty data available</div>;
  }

  const { loyaltyPoints, lifetimePoints, tier } = balance;
  const tierKeys = Object.keys(TIER_THRESHOLDS) as Array<
    keyof typeof TIER_THRESHOLDS
  >;
  const currentTierIndex = tierKeys.indexOf(tier as keyof typeof TIER_THRESHOLDS);
  const nextTier = tierKeys[currentTierIndex + 1];
  const progressToNextTier = nextTier
    ? Math.min(
        100,
        ((lifetimePoints - TIER_THRESHOLDS[tierKeys[currentTierIndex]]) /
          (TIER_THRESHOLDS[nextTier] - TIER_THRESHOLDS[tierKeys[currentTierIndex]])) *
          100
      )
    : 100;

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <h2 className="text-2xl font-bold">Loyalty Status</h2>
        <div className="text-sm text-muted-foreground">
          Current Tier: <span className="font-semibold text-primary">{tier}</span>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <div className="text-sm text-muted-foreground">Loyalty Points</div>
            <div className="text-3xl font-bold">{loyaltyPoints}</div>
          </div>
          <div>
            <div className="text-sm text-muted-foreground">Lifetime Points</div>
            <div className="text-3xl font-bold">{lifetimePoints}</div>
          </div>
        </div>

        {nextTier && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Progress to {nextTier}</span>
              <span>
                {lifetimePoints - TIER_THRESHOLDS[tierKeys[currentTierIndex]]} /{" "}
                {TIER_THRESHOLDS[nextTier] - TIER_THRESHOLDS[tierKeys[currentTierIndex]]}
              </span>
            </div>
            <Progress value={progressToNextTier} />
          </div>
        )}

        <div className="pt-4 border-t">
          <h3 className="text-sm font-semibold mb-2">Tier Benefits</h3>
          <div className="grid grid-cols-2 gap-2">
            {tierKeys.map((t) => (
              <div
                key={t}
                className={`p-2 rounded-md text-sm ${
                  t === tier
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                <div className="font-semibold">{t}</div>
                <div className="text-xs">
                  {TIER_THRESHOLDS[t].toLocaleString()} pts
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

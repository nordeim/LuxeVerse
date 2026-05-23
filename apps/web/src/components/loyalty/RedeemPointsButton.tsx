"use client";

import { useState, useCallback } from "react";
import { trpc } from "@/trpc/index";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";

interface RedeemPointsButtonProps {
  userId: string;
  currentPoints: number;
}

export function RedeemPointsButton({
  userId,
  currentPoints,
}: RedeemPointsButtonProps) {
  const [pointsToRedeem, setPointsToRedeem] = useState<number>(100);
  const [error, setError] = useState<string | null>(null);

  const redeemMutation = trpc.loyalty.redeemPoints.useMutation({
    onSuccess: () => {
      setPointsToRedeem(100);
      setError(null);
    },
    onError: (err: unknown) => {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred");
      }
    },
  });

  const handleRedeem = useCallback(() => {
    if (pointsToRedeem <= 0) {
      setError("Points must be greater than 0");
      return;
    }

    if (pointsToRedeem > currentPoints) {
      setError("Insufficient points");
      return;
    }

    redeemMutation.mutate({
      userId,
      points: pointsToRedeem,
    });
  }, [pointsToRedeem, currentPoints, userId, redeemMutation]);

  const isRedeeming = redeemMutation.isPending;

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <h3 className="text-xl font-bold">Redeem Points</h3>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm text-muted-foreground">Available Points</div>
            <div className="text-2xl font-bold">{currentPoints}</div>
          </div>
        </div>

        <div className="flex gap-2">
          <Input
            type="number"
            min={1}
            max={currentPoints}
            value={pointsToRedeem}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              setPointsToRedeem(Number(e.target.value));
              setError(null);
            }}
            disabled={isRedeeming}
            className="w-32"
            aria-label="Points to redeem"
          />
          <Button
            onClick={handleRedeem}
            disabled={isRedeeming || currentPoints === 0}
            className="flex-1"
          >
            {isRedeeming ? "Redeeming..." : "Redeem Points"}
          </Button>
        </div>

        {error && (
          <div role="alert" className="text-sm text-red-600 bg-red-50 p-2 rounded">
            {error}
          </div>
        )}

        {redeemMutation.isSuccess && (
          <div
            role="status"
            className="text-sm text-green-600 bg-green-50 p-2 rounded"
          >
            Points redeemed successfully!
          </div>
        )}
      </CardContent>
    </Card>
  );
}

import type { PrismaClient } from "@prisma/client";

// Tier thresholds configuration (MEP-gated)
export const TIER_THRESHOLDS = {
  BRONZE: 0,
  SILVER: 1000,
  GOLD: 5000,
  PLATINUM: 10000,
} as const;

export type Tier = keyof typeof TIER_THRESHOLDS;

export interface PointHistoryItem {
  id: string;
  userId: string;
  orderId: string | null;
  amount: number;
  type: string;
  description: string | null;
  createdAt: Date;
}

export interface LoyaltyService {
  calculatePoints(total: number, tier: string): number;
  addPoints(userId: string, orderId: string, points: number): Promise<{
    loyaltyPoints: number;
    lifetimePoints: number;
    tier: string;
  }>;
  redeemPoints(userId: string, points: number): Promise<{
    loyaltyPoints: number;
    lifetimePoints: number;
    tier: string;
  }>;
  getHistory(userId: string): Promise<PointHistoryItem[]>;
  adjustPoints(userId: string, amount: number, description: string): Promise<unknown>;
  reverseTransaction(orderId: string): Promise<{
    loyaltyPoints: number;
    lifetimePoints: number;
    tier: string;
  }>;
}

export function createLoyaltyService(prisma: PrismaClient): LoyaltyService {
  const getTierFromPoints = (lifetimePoints: number): Tier => {
    if (lifetimePoints >= TIER_THRESHOLDS.PLATINUM) return "PLATINUM";
    if (lifetimePoints >= TIER_THRESHOLDS.GOLD) return "GOLD";
    if (lifetimePoints >= TIER_THRESHOLDS.SILVER) return "SILVER";
    return "BRONZE";
  };

  return {
    calculatePoints(total: number, tier: string): number {
      if (total <= 0) return 0;

      const multipliers: Record<string, number> = {
        BRONZE: 0.1,
        SILVER: 0.15,
        GOLD: 0.25,
        PLATINUM: 0.3,
      };

      const multiplier = multipliers[tier] ?? 0.1;
      return Math.round(total * multiplier);
    },

    async addPoints(userId: string, orderId: string, points: number) {
      return prisma.$transaction(async (tx) => {
        const user = await tx.user.findUnique({
          where: { id: userId },
        });

        if (!user) {
          throw new Error("User not found");
        }

        const newLifetime = user.lifetimePoints + points;
        const newTier = getTierFromPoints(newLifetime);

        const updatedUser = await tx.user.update({
          where: { id: userId },
          data: {
            loyaltyPoints: { increment: points },
            lifetimePoints: { increment: points },
            tier: newTier,
          },
        });

        await tx.pointHistory.create({
          data: {
            userId,
            orderId,
            amount: points,
            type: "EARNED",
            description: `Points earned from order`,
          },
        });

        return {
          loyaltyPoints: updatedUser.loyaltyPoints,
          lifetimePoints: updatedUser.lifetimePoints,
          tier: updatedUser.tier,
        };
      });
    },

    async redeemPoints(userId: string, points: number) {
      return prisma.$transaction(async (tx) => {
        const user = await tx.user.findUnique({
          where: { id: userId },
        });

        if (!user) {
          throw new Error("User not found");
        }

        if (user.loyaltyPoints < points) {
          throw new Error("Insufficient loyalty points");
        }

        const updatedUser = await tx.user.update({
          where: { id: userId },
          data: {
            loyaltyPoints: { decrement: points },
          },
        });

        await tx.pointHistory.create({
          data: {
            userId,
            amount: -points,
            type: "REDEEMED",
            description: "Points redeemed",
          },
        });

        return {
          loyaltyPoints: updatedUser.loyaltyPoints,
          lifetimePoints: updatedUser.lifetimePoints,
          tier: updatedUser.tier,
        };
      });
    },

    async getHistory(userId: string) {
      return prisma.pointHistory.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
      });
    },

    async adjustPoints(userId: string, amount: number, description: string) {
      return prisma.$transaction(async (tx) => {
        const user = await tx.user.findUnique({
          where: { id: userId },
        });

        if (!user) {
          throw new Error("User not found");
        }

        const newTier = getTierFromPoints(user.lifetimePoints + amount);

        const updatedUser = await tx.user.update({
          where: { id: userId },
          data: {
            loyaltyPoints: { increment: amount },
            lifetimePoints: { increment: amount },
            tier: newTier,
          },
        });

        await tx.pointHistory.create({
          data: {
            userId,
            amount,
            type: "ADJUSTED",
            description,
          },
        });

        return updatedUser;
      });
    },

    async reverseTransaction(orderId: string) {
      return prisma.$transaction(async (tx) => {
        const order = await tx.order.findUnique({
          where: { id: orderId },
          include: { User: true },
        });

        if (!order) {
          throw new Error("Order not found");
        }

        const pointsToReverse = order.pointsEarned;

        if (pointsToReverse <= 0) {
          throw new Error("No points to reverse for this order");
        }

        // Reset order points to prevent double-reversal
        await tx.order.update({
          where: { id: orderId },
          data: { pointsEarned: 0 },
        });

        const updatedUser = await tx.user.update({
          where: { id: order.userId },
          data: {
            loyaltyPoints: { decrement: pointsToReverse },
            lifetimePoints: { decrement: pointsToReverse },
          },
        });

        const newTier = getTierFromPoints(updatedUser.lifetimePoints);

        await tx.user.update({
          where: { id: order.userId },
          data: { tier: newTier },
        });

        await tx.pointHistory.create({
          data: {
            userId: order.userId,
            orderId: order.id,
            amount: -pointsToReverse,
            type: "ADJUSTED",
            description: "Points reversed due to order cancellation",
          },
        });

        return {
          loyaltyPoints: updatedUser.loyaltyPoints,
          lifetimePoints: updatedUser.lifetimePoints,
          tier: newTier,
        };
      });
    },
  };
}

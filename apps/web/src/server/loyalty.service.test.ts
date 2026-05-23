import { describe, it, expect, beforeEach, vi } from "vitest";
import { createLoyaltyService } from "./loyalty.service";

// Mock Prisma client
const mockTxClient = {
  user: {
    findUnique: vi.fn(),
    update: vi.fn(),
  },
  pointHistory: {
    create: vi.fn(),
    findMany: vi.fn(),
  },
  order: {
    findUnique: vi.fn(),
    update: vi.fn(),
  },
};

const mockPrisma = {
  $transaction: vi.fn((arg: unknown) => {
    if (typeof arg === "function") {
      return arg(mockTxClient);
    }
    return Promise.all(arg as Promise<unknown>[]);
  }),
  user: mockTxClient.user,
  pointHistory: mockTxClient.pointHistory,
  order: mockTxClient.order,
} as unknown as import("@prisma/client").PrismaClient;

describe("Loyalty Service", () => {
  let service: ReturnType<typeof createLoyaltyService>;

  beforeEach(() => {
    service = createLoyaltyService(mockPrisma);
    vi.clearAllMocks();
  });

  describe("calculatePoints", () => {
    it("should calculate correct points for BRONZE tier", () => {
      expect(service.calculatePoints(100, "BRONZE")).toBe(10);
    });

    it("should calculate correct points for GOLD tier with multiplier", () => {
      expect(service.calculatePoints(100, "GOLD")).toBe(25);
    });

    it("should return 0 for non-positive totals", () => {
      expect(service.calculatePoints(0, "BRONZE")).toBe(0);
      expect(service.calculatePoints(-10, "SILVER")).toBe(0);
    });
  });

  describe("addPoints", () => {
    it("should increase loyalty and lifetime points and create PointHistory", async () => {
      const userId = "user-123";
      const orderId = "order-456";
      const points = 100;

      mockTxClient.user.findUnique.mockResolvedValue({
        id: userId,
        loyaltyPoints: 50,
        lifetimePoints: 500,
        tier: "SILVER",
      });

      mockTxClient.user.update.mockResolvedValue({
        id: userId,
        loyaltyPoints: 150,
        lifetimePoints: 600,
        tier: "SILVER",
      });

      mockTxClient.pointHistory.create.mockResolvedValue({
        id: "history-789",
        userId,
        orderId,
        amount: points,
        type: "EARNED",
        description: "Points earned from order",
      });

      const result = await service.addPoints(userId, orderId, points);

      expect(result.loyaltyPoints).toBe(150);
      expect(result.lifetimePoints).toBe(600);
    });

    it("should throw error for invalid user", async () => {
      mockTxClient.user.findUnique.mockResolvedValue(null);

      await expect(service.addPoints("invalid-user", "order-1", 100)).rejects.toThrow(
        "User not found"
      );
    });

    it("should upgrade tier when lifetimePoints cross threshold", async () => {
      const userId = "user-123";

      mockTxClient.user.findUnique.mockResolvedValue({
        id: userId,
        loyaltyPoints: 500,
        lifetimePoints: 999,
        tier: "BRONZE",
      });

      mockTxClient.user.update.mockResolvedValue({
        id: userId,
        loyaltyPoints: 510,
        lifetimePoints: 1009,
        tier: "SILVER",
      });

      const result = await service.addPoints(userId, "order-1", 10);

      expect(result.tier).toBe("SILVER");
    });

    it("should upgrade from SILVER to GOLD", async () => {
      const userId = "user-123";

      mockTxClient.user.findUnique.mockResolvedValue({
        id: userId,
        loyaltyPoints: 1000,
        lifetimePoints: 4999,
        tier: "SILVER",
      });

      mockTxClient.user.update.mockResolvedValue({
        id: userId,
        loyaltyPoints: 1010,
        lifetimePoints: 5009,
        tier: "GOLD",
      });

      const result = await service.addPoints(userId, "order-1", 10);

      expect(result.tier).toBe("GOLD");
    });
  });

  describe("redeemPoints", () => {
    it("should decrease loyalty points and create REDEEMED PointHistory", async () => {
      const userId = "user-123";
      const pointsToRedeem = 50;

      mockTxClient.user.findUnique.mockResolvedValue({
        id: userId,
        loyaltyPoints: 100,
        lifetimePoints: 500,
        tier: "SILVER",
      });

      mockTxClient.user.update.mockResolvedValue({
        id: userId,
        loyaltyPoints: 50,
        lifetimePoints: 500,
        tier: "SILVER",
      });

      mockTxClient.pointHistory.create.mockResolvedValue({
        id: "history-999",
        userId,
        amount: -pointsToRedeem,
        type: "REDEEMED",
        description: "Points redeemed",
      });

      const result = await service.redeemPoints(userId, pointsToRedeem);

      expect(result.loyaltyPoints).toBe(50);
    });

    it("should throw error if insufficient points", async () => {
      const userId = "user-123";

      mockTxClient.user.findUnique.mockResolvedValue({
        id: userId,
        loyaltyPoints: 30,
        lifetimePoints: 500,
        tier: "SILVER",
      });

      await expect(service.redeemPoints(userId, 50)).rejects.toThrow(
        "Insufficient loyalty points"
      );
    });
  });

  describe("reverseTransaction", () => {
    it("should reverse points for cancelled order", async () => {
      const orderId = "order-456";

      mockTxClient.order.findUnique.mockResolvedValue({
        id: orderId,
        userId: "user-123",
        pointsEarned: 100,
        status: "CANCELLED",
      });

      mockTxClient.user.update.mockResolvedValue({
        id: "user-123",
        loyaltyPoints: 0,
        lifetimePoints: 400,
        tier: "BRONZE",
      });

      const result = await service.reverseTransaction(orderId);

      expect(result.loyaltyPoints).toBe(0);
    });

    it("should throw error for non-existent order", async () => {
      mockTxClient.order.findUnique.mockResolvedValue(null);

      await expect(service.reverseTransaction("invalid-order")).rejects.toThrow(
        "Order not found"
      );
    });
  });

  describe("atomicity", () => {
    it("should roll back all changes if mid-transaction fails", async () => {
      const userId = "user-123";

      mockTxClient.user.findUnique.mockResolvedValue({
        id: userId,
        loyaltyPoints: 50,
        lifetimePoints: 500,
        tier: "SILVER",
      });

      mockPrisma.$transaction.mockRejectedValueOnce(new Error("DB connection lost"));

      await expect(service.addPoints(userId, "order-1", 100)).rejects.toThrow(
        "DB connection lost"
      );

      expect(mockTxClient.user.update).not.toHaveBeenCalled();
      expect(mockTxClient.pointHistory.create).not.toHaveBeenCalled();
    });
  });
});

import { describe, it, expect, vi, beforeEach } from "vitest";
import { reviewRouter } from "./review";
import { prisma } from "@/lib/prisma";

// Mock Prisma client to avoid real DB calls
vi.mock("@/lib/prisma", () => ({
  prisma: {
    review: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
      aggregate: vi.fn(),
      groupBy: vi.fn(),
    },
    order: {
      findFirst: vi.fn(),
    },
    product: {
      update: vi.fn(),
    },
  },
}));

// ------------------------------------------------------------------
// Helper: build a mock caller with optional auth context
// ------------------------------------------------------------------
function createCaller(options: { authed?: boolean; role?: string } = {}) {
  const ctx = {
    prisma,
    user: options.authed
      ? {
          id: "user-123",
          name: "Elena Voss",
          email: "elena@voss.com",
          role: (options.role ?? "CUSTOMER") as "CUSTOMER" | "ADMIN" | "EDITOR" | "STYLIST",
        }
      : null,
  };
  return reviewRouter.createCaller(ctx as any);
}

// ------------------------------------------------------------------
// Helper: mock review shape
// ------------------------------------------------------------------
function makeReview(overrides: Record<string, unknown> = {}) {
  return {
    id: "rev-1",
    userId: "user-123",
    productId: "prod-456",
    rating: 5,
    title: "Absolutely stunning",
    body: "The craftsmanship is impeccable.",
    verifiedPurchase: true,
    helpfulCount: 3,
    unhelpfulCount: 0,
    size: "M",
    color: "Obsidian",
    createdAt: new Date("2026-05-01"),
    updatedAt: new Date("2026-05-01"),
    User: { id: "user-123", name: "Elena Voss", avatar: null },
    product: { id: "prod-456", slug: "velvet-obsidian-blazer", name: "Velvet Obsidian Blazer" },
    ...overrides,
  };
}

describe("reviewRouter", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // ================================================================
  // Queries
  // ================================================================

  describe("list", () => {
    it("returns reviews with default sort (newest)", async () => {
      const mockReviews = [makeReview()];
      (prisma.review.findMany as any).mockResolvedValue(mockReviews);

      const caller = createCaller();
      const result = await caller.list({ productId: "prod-456" });

      expect(result).toHaveLength(1);
      expect(result[0]).toMatchObject({
        id: "rev-1",
        userName: "Elena Voss",
        rating: 5,
        verifiedPurchase: true,
      });

      const call = (prisma.review.findMany as any).mock.calls[0][0];
      expect(call.orderBy).toEqual({ createdAt: "desc" });
    });

    it("filters by verified purchase", async () => {
      (prisma.review.findMany as any).mockResolvedValue([]);

      const caller = createCaller();
      await caller.list({ verified: true });

      const call = (prisma.review.findMany as any).mock.calls[0][0];
      expect(call.where.verifiedPurchase).toBe(true);
    });

    it("sorts by most helpful", async () => {
      (prisma.review.findMany as any).mockResolvedValue([]);

      const caller = createCaller();
      await caller.list({ sort: "mostHelpful" });

      const call = (prisma.review.findMany as any).mock.calls[0][0];
      expect(call.orderBy).toEqual({ helpfulCount: "desc" });
    });
  });

  describe("byId", () => {
    it("returns a review by ID", async () => {
      (prisma.review.findUnique as any).mockResolvedValue(makeReview({ id: "rev-2" }));

      const caller = createCaller();
      const result = await caller.byId({ id: "rev-2" });

      expect(result?.id).toBe("rev-2");
      expect(result?.userName).toBe("Elena Voss");
    });

    it("returns null for non-existent review", async () => {
      (prisma.review.findUnique as any).mockResolvedValue(null);

      const caller = createCaller();
      const result = await caller.byId({ id: "rev-missing" });

      expect(result).toBeNull();
    });
  });

  // ================================================================
  // Mutations
  // ================================================================

  describe("create", () => {
    it("creates a review and marks verified if user ordered", async () => {
      (prisma.order.findFirst as any).mockResolvedValue({ id: "ord-1" });
      (prisma.review.create as any).mockResolvedValue({ id: "rev-new" });
      (prisma.review.aggregate as any).mockResolvedValue({ _avg: { rating: 4.5 } });

      const caller = createCaller({ authed: true });
      const result = await caller.create({
        productId: "prod-456",
        rating: 5,
        title: "Love it",
        body: "Amazing quality.",
      });

      expect(result.id).toBe("rev-new");
      const createCall = (prisma.review.create as any).mock.calls[0][0];
      expect(createCall.data.verifiedPurchase).toBe(true);
    });

    it("creates an unverified review if no order", async () => {
      (prisma.order.findFirst as any).mockResolvedValue(null);
      (prisma.review.create as any).mockResolvedValue({ id: "rev-new" });
      (prisma.review.aggregate as any).mockResolvedValue({ _avg: { rating: 3.0 } });

      const caller = createCaller({ authed: true });
      await caller.create({
        productId: "prod-456",
        rating: 3,
        title: "Okay",
        body: "It's fine.",
      });

      const createCall = (prisma.review.create as any).mock.calls[0][0];
      expect(createCall.data.verifiedPurchase).toBe(false);
    });
  });

  describe("update", () => {
    it("allows author to update their review", async () => {
      (prisma.review.findUnique as any).mockResolvedValue({
        userId: "user-123",
        productId: "prod-456",
      });
      (prisma.review.update as any).mockResolvedValue({ id: "rev-1" });
      (prisma.review.aggregate as any).mockResolvedValue({ _avg: { rating: 4.0 } });

      const caller = createCaller({ authed: true });
      const result = await caller.update({ id: "rev-1", rating: 4, body: "Updated." });

      expect(result.id).toBe("rev-1");
    });
  });

  describe("delete", () => {
    it("allows author to delete their review", async () => {
      (prisma.review.findUnique as any).mockResolvedValue({
        userId: "user-123",
        productId: "prod-456",
      });
      (prisma.review.aggregate as any).mockResolvedValue({ _avg: { rating: 0 } });

      const caller = createCaller({ authed: true });
      const result = await caller.delete({ id: "rev-1" });

      expect(result.success).toBe(true);
      expect(prisma.review.delete).toHaveBeenCalledWith({ where: { id: "rev-1" } });
    });
  });

  describe("vote", () => {
    it("increments helpful count", async () => {
      (prisma.review.findUnique as any).mockResolvedValue({
        id: "rev-1",
        helpfulCount: 2,
        unhelpfulCount: 0,
      });

      const caller = createCaller({ authed: true });
      const result = await caller.vote({ id: "rev-1", helpful: true });

      expect(result.success).toBe(true);
      expect(prisma.review.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: "rev-1" },
          data: { helpfulCount: { increment: 1 } },
        })
      );
    });
  });

  describe("statistics", () => {
    it("returns aggregate stats for a product", async () => {
      (prisma.review.aggregate as any).mockResolvedValue({
        _avg: { rating: 4.2 },
        _count: { id: 12 },
      });
      (prisma.review.groupBy as any).mockResolvedValue([
        { rating: 5, _count: { id: 6 } },
        { rating: 4, _count: { id: 4 } },
        { rating: 3, _count: { id: 2 } },
      ]);

      const caller = createCaller();
      const result = await caller.statistics({ productId: "prod-456" });

      expect(result.total).toBe(12);
      expect(result.average).toBe(4.2);
      expect(result.distribution[5]).toBe(6);
      expect(result.distribution[4]).toBe(4);
      expect(result.distribution[3]).toBe(2);
      expect(result.distribution[2]).toBe(0);
    });
  });

  describe("moderate + flag", () => {
    it("allows admin to moderate", async () => {
      const caller = createCaller({ authed: true, role: "ADMIN" });
      const result = await caller.moderate({ id: "rev-1", action: "reject" });
      expect(result.success).toBe(true);
    });

    it("rejects non-admin moderation", async () => {
      const caller = createCaller({ authed: true, role: "CUSTOMER" });
      await expect(caller.moderate({ id: "rev-1", action: "reject" })).rejects.toThrow(
        "FORBIDDEN"
      );
    });

    it("allows any authenticated user to flag", async () => {
      const caller = createCaller({ authed: true });
      const result = await caller.flag({ id: "rev-1", reason: "Inappropriate language" });
      expect(result.success).toBe(true);
      expect(result.reason).toBe("Inappropriate language");
    });
  });
});

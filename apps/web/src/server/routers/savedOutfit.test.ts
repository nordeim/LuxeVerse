import { describe, it, expect, vi, beforeEach } from "vitest";
import { savedOutfitRouter } from "./savedOutfit";
import { prisma } from "@/lib/prisma";

// Mock Prisma client
vi.mock("@/lib/prisma", () => ({
  prisma: {
    savedOutfit: {
      findMany: vi.fn(),
      create: vi.fn(),
      delete: vi.fn(),
      update: vi.fn(),
      findUnique: vi.fn(),
    },
  },
}));

function createCaller(options: { authed?: boolean; userId?: string } = {}) {
  const ctx = {
    prisma,
    user: options.authed
      ? {
          id: options.userId ?? "user-123",
          name: "Elena Voss",
          email: "elena@voss.com",
          role: "CUSTOMER" as const,
        }
      : null,
  };
  return savedOutfitRouter.createCaller(ctx as unknown as Parameters<typeof savedOutfitRouter.createCaller>[0]);
}

describe("savedOutfitRouter", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("list", () => {
    it("returns saved outfits for the current user", async () => {
      const mockOutfits = [
        {
          id: "outfit-1",
          name: "Autumn Look",
          items: [{ productId: "p1", name: "Silk Trench", price: 2450 }],
          occasion: "cocktail",
          season: "autumn",
          aiGenerated: true,
          createdAt: new Date("2026-05-01"),
          User: { id: "user-123", name: "Elena Voss" },
        },
      ];

      (prisma.savedOutfit.findMany as ReturnType<typeof vi.fn>).mockResolvedValue(mockOutfits);

      const caller = createCaller({ authed: true });
      const result = await caller.list({});

      expect(result).toHaveLength(1);
      expect(result[0].name).toBe("Autumn Look");
      expect(result[0].aiGenerated).toBe(true);
    });

    it("respects limit parameter", async () => {
      (prisma.savedOutfit.findMany as ReturnType<typeof vi.fn>).mockResolvedValue([]);

      const caller = createCaller({ authed: true });
      await caller.list({ limit: 5 });

      const call = (prisma.savedOutfit.findMany as ReturnType<typeof vi.fn>).mock.calls[0][0];
      expect(call.take).toBe(5);
    });
  });

  describe("create", () => {
    it("creates a saved outfit for the user", async () => {
      (prisma.savedOutfit.create as ReturnType<typeof vi.fn>).mockResolvedValue({
        id: "outfit-new",
      });

      const caller = createCaller({ authed: true });
      const result = await caller.create({
        name: "Spring Look",
        items: [{ productId: "p1", name: "Linen Blazer", price: 1200 }],
        occasion: "work",
        season: "spring",
        aiGenerated: true,
      });

      expect(result.id).toBe("outfit-new");
      const createCall = (prisma.savedOutfit.create as ReturnType<typeof vi.fn>).mock.calls[0][0];
      expect(createCall.data.userId).toBe("user-123");
      expect(createCall.data.name).toBe("Spring Look");
    });
  });

  describe("delete", () => {
    it("allows owner to delete their outfit", async () => {
      (prisma.savedOutfit.findUnique as ReturnType<typeof vi.fn>).mockResolvedValue({
        userId: "user-123",
      });

      const caller = createCaller({ authed: true, userId: "user-123" });
      const result = await caller.delete({ id: "outfit-1" });

      expect(result.success).toBe(true);
      expect(prisma.savedOutfit.delete).toHaveBeenCalledWith({ where: { id: "outfit-1" } });
    });

    it("rejects deletion by non-owner", async () => {
      (prisma.savedOutfit.findUnique as ReturnType<typeof vi.fn>).mockResolvedValue({
        userId: "user-456",
      });

      const caller = createCaller({ authed: true, userId: "user-123" });
      await expect(caller.delete({ id: "outfit-1" })).rejects.toThrow("FORBIDDEN");
    });
  });

  describe("update", () => {
    it("allows owner to update name", async () => {
      (prisma.savedOutfit.findUnique as ReturnType<typeof vi.fn>).mockResolvedValue({
        userId: "user-123",
      });
      (prisma.savedOutfit.update as ReturnType<typeof vi.fn>).mockResolvedValue({
        id: "outfit-1",
      });

      const caller = createCaller({ authed: true, userId: "user-123" });
      const result = await caller.update({ id: "outfit-1", name: "Updated Name" });

      expect(result.id).toBe("outfit-1");
    });
  });
});

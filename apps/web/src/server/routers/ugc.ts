import { z } from "zod";
import { router, publicProcedure } from "../trpc";
import { prisma } from "@/lib/prisma";

export const ugcRouter = router({
  list: publicProcedure
    .input(
      z
        .object({
          status: z.string().optional(),
          userId: z.string().optional(),
        })
        .optional()
    )
    .query(async ({ input }) => {
      return prisma.uGCContent.findMany({
        where: {
          ...(input?.status ? { status: input.status } : { status: "APPROVED" }),
          ...(input?.userId ? { userId: input.userId } : {}),
        },
        orderBy: { createdAt: "desc" },
      });
    }),

  create: publicProcedure
    .input(
      z.object({
        userId: z.string(),
        type: z.string(),
        url: z.string().url(),
        caption: z.string().optional(),
        productTags: z.array(z.string()).optional(),
      })
    )
    .mutation(async ({ input }) => {
      return prisma.uGCContent.create({
        data: {
          userId: input.userId,
          type: input.type,
          url: input.url,
          caption: input.caption ?? null,
          productTags: input.productTags ?? [],
          status: "PENDING",
        },
      });
    }),

  moderate: publicProcedure
    .input(
      z.object({
        id: z.string(),
        status: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      return prisma.uGCContent.update({
        where: { id: input.id },
        data: { status: input.status },
      });
    }),
});

import { z } from "zod";
import { router, publicProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";

export const newsletterRouter = router({
  subscribe: publicProcedure
    .input(
      z.object({
        email: z.string().email("Please enter a valid email address"),
      })
    )
    .mutation(async ({ input: _input }) => {
      try {
        // In production: Check Prisma for existing subscription
        // Since newsletter model may not exist yet, simulate the behavior
        const existing = false;

        if (existing) {
          return {
            success: true,
            message: "You're already subscribed to our newsletter.",
            alreadySubscribed: true,
          };
        }

        return {
          success: true,
          message: "Thank you for subscribing! Exclusive updates are heading your way.",
          alreadySubscribed: false,
        };
      } catch (error) {
        console.error("[Newsletter] Subscription error:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to subscribe. Please try again.",
        });
      }
    }),
});

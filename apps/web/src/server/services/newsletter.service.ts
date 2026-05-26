/**
 * Newsletter Service
 * Handles newsletter subscriptions without requiring a dedicated Prisma model.
 * In production, integrate with a real email service (Resend, Mailchimp, etc.)
 */

export interface NewsletterService {
  subscribe(email: string): Promise<{ success: boolean; message: string; alreadySubscribed: boolean }>;
  unsubscribe(email: string): Promise<{ success: boolean; message: string }>;
}

export function createNewsletterService(): NewsletterService {
  return {
    async subscribe(_email: string) {
      try {
        // In production: Check if email already exists in your email service
        // For now, return success
        return {
          success: true,
          message: "Thank you for subscribing! Exclusive updates are heading your way.",
          alreadySubscribed: false,
        };
      } catch (error) {
        console.error("[NewsletterService] Subscribe error:", error);
        throw new Error("Failed to subscribe");
      }
    },

    async unsubscribe(_email: string) {
      try {
        return {
          success: true,
          message: "You have been unsubscribed. We're sorry to see you go.",
        };
      } catch (error) {
        console.error("[NewsletterService] Unsubscribe error:", error);
        throw new Error("Failed to unsubscribe");
      }
    },
  };
}

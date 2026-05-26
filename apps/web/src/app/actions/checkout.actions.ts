"use server";

import { z } from "zod";
import { getToken } from "next-auth/jwt";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { type NextRequest } from "next/server";

// Flattened checkout schema matching FormData field names
const checkoutSchema = z.object({
  firstName: z.string().min(1, "First name is required."),
  lastName: z.string().min(1, "Last name is required."),
  line1: z.string().min(5, "Address line is required."),
  line2: z.string().optional(),
  city: z.string().min(1, "City is required."),
  state: z.string().min(1, "State is required."),
  postalCode: z.string().min(1, "Postal code is required."),
  country: z.string().min(2, "Country is required."),
  email: z.string().email("Valid email is required."),
});

export type CheckoutState = {
  status: "idle" | "success" | "error";
  message?: string;
  orderId?: string;
  clientSecret?: string;
};

/**
 * Extract user session from request cookies using NextAuth JWT.
 * Works in App Router Server Actions.
 */
async function getUserFromSession(): Promise<{ id: string; email: string; role: string } | null> {
  if (!process.env.AUTH_SECRET) {
    console.warn("[CheckoutAction] AUTH_SECRET not set, skipping session verification");
    return null;
  }

  try {
    // Get cookies from the request (await required in Next.js 15+)
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get("next-auth.session-token")?.value;

    if (!sessionToken) {
      return null;
    }

    // Decode the session token to get the user
    const token = await getToken({
      req: {
        headers: {
          cookie: `next-auth.session-token=${sessionToken}`,
        },
      } as unknown as NextRequest,
      secret: process.env.AUTH_SECRET,
    });

    if (token?.id && typeof token.id === "string") {
      return {
        id: token.id,
        email: (token.email as string) ?? "",
        role: (token.role as string) || "CUSTOMER",
      };
    }

    return null;
  } catch (error) {
    console.error("[CheckoutAction] Session extraction failed:", error);
    return null;
  }
}

export async function createCheckoutAction(
  _prevState: CheckoutState,
  formData: FormData
): Promise<CheckoutState> {
  const rawData = Object.fromEntries(formData.entries());
  const parsed = checkoutSchema.safeParse(rawData);

  if (!parsed.success) {
    return {
      status: "error",
      message: parsed.error.issues[0].message,
    };
  }

  try {
    // Calculate totals (mock cart from session/user cart)
    const subtotal = 10000; // cents
    const tax = 800;
    const shipping = 0;
    const total = subtotal + tax + shipping;

    // Get user session or generate guest ID
    const user = await getUserFromSession();
    const userId = user?.id ?? `guest-${crypto.randomUUID()}`;

    // Create Stripe PaymentIntent
    // Production: const intent = await stripe.paymentIntents.create({ amount: total, currency: "usd" });
    const intent = {
      clientSecret: `pi_${crypto.randomUUID()}_secret_${crypto.randomUUID()}`,
      id: `pi_${crypto.randomUUID()}`,
    };

    // Create order
    const order = await prisma.order.create({
      data: {
        orderNumber: `LV-${Date.now()}`,
        userId,
        status: "PENDING",
        paymentStatus: "PENDING",
        subtotal: subtotal / 100,
        tax: tax / 100,
        shipping: shipping / 100,
        discount: 0,
        total: total / 100,
        currency: "USD",
        paymentIntentId: intent.id,
        shippingAddress: { create: {} },
        billingAddress: { create: {} },
      },
    });

    revalidatePath("/checkout");

    return {
      status: "success",
      orderId: order.id,
      clientSecret: intent.clientSecret,
    };
  } catch (error) {
    console.error("[CheckoutAction] Failed:", error);
    return {
      status: "error",
      message: "Failed to initialize checkout. Please try again.",
    };
  }
}

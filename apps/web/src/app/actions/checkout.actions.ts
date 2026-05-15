"use server";

import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

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

  const data = parsed.data;

  try {
    // Calculate totals (mock cart from session/user cart)
    const subtotal = 10000; // cents
    const tax = 800;
    const shipping = 0;
    const total = subtotal + tax + shipping;

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
        userId: "user_mock_id",
        status: "PENDING",
        paymentStatus: "PENDING",
        subtotal: subtotal / 100,
        tax: tax / 100,
        shipping: shipping / 100,
        total: total / 100,
        currency: "USD",
        paymentIntentId: intent.id,
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

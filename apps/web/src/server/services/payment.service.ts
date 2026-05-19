// Payment service stub for development
// Production: replace with real Stripe integration

const stripe = {
  paymentIntents: {
    create: async () => ({ id: "", client_secret: "" }),
  },
};

interface CreatePaymentIntentInput {
  amount: number;
  currency?: string;
  metadata?: Record<string, string>;
}

interface PaymentIntentResult {
  id: string;
  client_secret: string;
  status: "requires_confirmation" | "succeeded" | "requires_payment_method";
}

export function createPaymentService() {
  return {
    async createIntent(input: CreatePaymentIntentInput): Promise<PaymentIntentResult> {
      // Development: log amount for debugging
      console.log(`[PaymentService] Creating mock intent for amount: ${input.amount} ${input.currency ?? "USD"}`);
      if (process.env.STRIPE_SECRET_KEY && !process.env.NEXT_PUBLIC_MOCK_PAYMENTS) {
        const intent = await stripe.paymentIntents.create();

        return {
          id: intent.id,
          client_secret: intent.client_secret!,
          status: "requires_confirmation" as PaymentIntentResult["status"],
        };
      }

      // Development stub: return a mock payment intent
      return {
        id: `pi_${crypto.randomUUID()}`,
        client_secret: `secret_${crypto.randomUUID()}`,
        status: "requires_confirmation",
      };
    },
  };
}

export type { PaymentIntentResult };
export const paymentService = createPaymentService();

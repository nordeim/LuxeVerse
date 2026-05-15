"use client";

import { useState, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { Button } from "@luxeverse/ui";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? ""
);

interface PaymentStepProps {
  onNext: () => void;
  onBack: () => void;
  clientSecret: string | null;
}

function PaymentForm({ onNext, onBack }: Omit<PaymentStepProps, "clientSecret">): JSX.Element {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState<string | null>(null);
  const [isReady, setIsReady] = useState(false);

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    if (!stripe || !elements) return;

    const { error: stripeError } = await elements.submit();
    if (stripeError) {
      setError(stripeError.message ?? "Payment details incomplete.");
      return;
    }
    onNext();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="rounded-lg border border-obsidian-200 bg-obsidian-50 p-4">
        <PaymentElement
          onReady={() => setIsReady(true)}
          options={{ layout: "tabs" }}
        />
      </div>
      {error && (
        <p role="alert" className="text-sm text-error">
          {error}
        </p>
      )}
      <div className="flex gap-4">
        <Button type="button" size="lg" onClick={onBack} className="flex-1" variant="outline">
          Back
        </Button>
        <Button type="submit" variant="luxury" size="lg" className="flex-1" disabled={!isReady}>
          Review Order
        </Button>
      </div>
    </form>
  );
}

export function PaymentStep({ onNext, onBack, clientSecret }: PaymentStepProps): JSX.Element {
  if (!clientSecret) {
    return (
      <div className="py-12 text-center text-obsidian-600">
        Initializing secure payment environment...
      </div>
    );
  }

  return (
    <section
      aria-labelledby="payment-heading"
      className="rounded-xl border border-obsidian-200 bg-obsidian-50 p-6 shadow-sm"
    >
      <h2
        id="payment-heading"
        className="mb-6 text-xl font-display font-medium text-obsidian-900"
      >
        Payment Details
      </h2>
      <Elements
        stripe={stripePromise}
        options={{ clientSecret, appearance: { theme: "stripe" } }}
      >
        <PaymentForm onNext={onNext} onBack={onBack} />
      </Elements>
      <p className="mt-4 text-xs text-obsidian-500 flex items-center gap-2">
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
        Secured by Stripe. We never store your card details.
      </p>
    </section>
  );
}

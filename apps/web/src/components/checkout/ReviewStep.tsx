import type { ReactElement } from "react";
"use client";

import { Button } from "@luxeverse/ui";
import Link from "next/link";

interface ReviewStepProps {
  onBack: () => void;
  onSubmit: (formData: FormData) => void;
  isPending: boolean;
}

export function ReviewStep({ onBack, onSubmit, isPending }: ReviewStepProps): ReactElement {
  return (
    <section
      aria-labelledby="review-heading"
      className="rounded-xl border border-obsidian-200 bg-obsidian-50 p-6 shadow-sm"
    >
      <h2
        id="review-heading"
        className="mb-6 text-xl font-display font-medium text-obsidian-900"
      >
        Review and Place Order
      </h2>

      <div className="space-y-4 mb-6">
        <div className="flex justify-between border-b border-obsidian-200 pb-2">
          <span className="text-obsidian-600">Subtotal</span>
          <span className="font-medium">$100.00</span>
        </div>
        <div className="flex justify-between border-b border-obsidian-200 pb-2">
          <span className="text-obsidian-600">Shipping</span>
          <span className="font-medium">Complimentary</span>
        </div>
        <div className="flex justify-between text-lg font-semibold text-obsidian-900 pt-2">
          <span>Total</span>
          <span>$108.00</span>
        </div>
      </div>

      <form action={onSubmit} className="space-y-4">
        <div className="flex items-start gap-3">
          <input
            type="checkbox"
            id="terms"
            required
            className="mt-1 h-4 w-4 rounded border-obsidian-300 text-neon-cyan focus:ring-neon-cyan accent-neon-cyan"
          />
          <label htmlFor="terms" className="text-sm text-obsidian-700 leading-relaxed">
            I agree to the{" "}
            <Link href="/terms" className="underline hover:text-neon-cyan transition-colors">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link href="/privacy" className="underline hover:text-neon-cyan transition-colors">
              Privacy Policy
            </Link>
          </label>
        </div>

        <div className="flex gap-4 pt-2">
          <Button
            type="button"
            size="lg"
            onClick={onBack}
            disabled={isPending}
            className="flex-1"
            variant="outline"
          >
            Back
          </Button>
          <Button
            type="submit"
            variant="luxury"
            size="lg"
            className="flex-1"
            loading={isPending}
            disabled={isPending}
          >
            Place Order
          </Button>
        </div>
      </form>
    </section>
  );
}

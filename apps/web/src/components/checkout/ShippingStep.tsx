"use client";

import { useActionState, useEffect } from "react";
import { Input } from "@luxeverse/ui";
import { Button } from "@luxeverse/ui";

interface ShippingStepProps {
  onNext: () => void;
}

type FormState = { status: "idle" | "error" | "success"; message?: string };

export function ShippingStep({ onNext }: ShippingStepProps): JSX.Element {
  const [state, formAction, isPending] = useActionState<FormState, FormData>(
    async (_prev: FormState, formData: FormData) => {
      const firstName = String(formData.get("firstName"));
      const lastName = String(formData.get("lastName"));
      const line1 = String(formData.get("line1"));
      const city = String(formData.get("city"));
      const stateField = String(formData.get("state"));
      const postalCode = String(formData.get("postalCode"));
      const country = String(formData.get("country"));

      if (!firstName || !lastName || !line1 || !city || !stateField || !postalCode || !country) {
        return { status: "error", message: "All fields are required." };
      }

      return { status: "success" };
    },
    { status: "idle" }
  );

  // Advanced to next step on success
  useEffect(() => {
    if (state.status === "success") {
      onNext();
    }
  }, [state.status, onNext]);

  return (
    <section
      aria-labelledby="shipping-heading"
      className="rounded-xl border border-obsidian-200 bg-obsidian-50 p-6 shadow-sm"
    >
      <h2
        id="shipping-heading"
        className="mb-6 text-xl font-display font-medium text-obsidian-900"
      >
        Shipping Address
      </h2>

      <form action={formAction} className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <Input name="firstName" label="First Name" required />
          <Input name="lastName" label="Last Name" required />
        </div>
        <Input
          name="line1"
          label="Address Line 1"
          placeholder="Street address, P.O. box"
          required
        />
        <Input
          name="line2"
          label="Address Line 2 (Optional)"
          placeholder="Apartment, suite, unit, building, floor"
        />
        <div className="grid gap-4 sm:grid-cols-3">
          <Input name="city" label="City" required />
          <Input name="state" label="State / Province" required />
          <Input name="postalCode" label="Postal Code" required />
        </div>
        <Input name="country" label="Country" defaultValue="US" required />

        {state.status === "error" && (
          <p role="alert" className="text-sm text-error" aria-live="assertive">
            {state.message}
          </p>
        )}

        <div className="pt-4">
          <Button
            type="submit"
            variant="luxury"
            size="lg"
            className="w-full"
            loading={isPending}
          >
            Continue to Payment
          </Button>
        </div>
      </form>
    </section>
  );
}

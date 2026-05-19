"use client";

import { useState, useCallback, useRef, useEffect, useActionState } from "react";
import type { ReactElement } from "react";
import {
  createCheckoutAction,
  type CheckoutState,
} from "@/app/actions/checkout.actions";
import { ShippingStep } from "@/components/checkout/ShippingStep";
import { PaymentStep } from "@/components/checkout/PaymentStep";
import { ReviewStep } from "@/components/checkout/ReviewStep";
import { ConfirmationStep } from "@/components/checkout/ConfirmationStep";
import { cn } from "@luxeverse/utils";

type Step = "shipping" | "payment" | "review" | "confirmation";

const steps: Step[] = ["shipping", "payment", "review", "confirmation"];

export default function CheckoutForm(): ReactElement {
  const [currentStep, setCurrentStep] = useState<Step>("shipping");
  const [state, formAction, isPending] = useActionState(
    createCheckoutAction,
    {
      status: "idle",
    } as CheckoutState
  );
  const stepRef = useRef<HTMLDivElement>(null);

  const currentIdx = steps.indexOf(currentStep);

  const nextStep = useCallback(() => {
    if (currentIdx < steps.length - 1) {
      setCurrentStep(steps[currentIdx + 1]);
    }
  }, [currentIdx]);

  const prevStep = useCallback(() => {
    if (currentIdx > 0) {
      setCurrentStep(steps[currentIdx - 1]);
    }
  }, [currentIdx]);

  useEffect(() => {
    stepRef.current?.focus();
  }, [currentStep]);

  return (
    <main className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="sr-only">Checkout</h1>

      {/* Stepper */}
      <nav
        aria-label="Checkout progress"
        className="mb-8 flex items-center justify-center gap-2"
      >
        {steps
          .filter((s) => s !== "confirmation")
          .map((step, idx) => (
            <div key={step} className="flex items-center gap-2">
              <span
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium transition-colors",
                  idx <= currentIdx
                    ? "bg-obsidian-900 text-metallic-champagne"
                    : "bg-obsidian-200 text-obsidian-600"
                )}
                aria-current={idx === currentIdx ? "step" : undefined}
              >
                {idx + 1}
              </span>
              <span
                className={cn(
                  "text-sm font-medium capitalize",
                  idx <= currentIdx
                    ? "text-obsidian-900"
                    : "text-obsidian-500"
                )}
              >
                {step}
              </span>
              {idx < 2 && <span className="mx-2 h-px w-8 bg-obsidian-200" />}
            </div>
          ))}
      </nav>

      {/* Step Content */}
      <div ref={stepRef} tabIndex={-1} className="outline-hidden">
        {state.status === "error" && (state as CheckoutState).message && (
          <div
            role="alert"
            className="mb-6 rounded-lg bg-error-light p-4 text-sm text-error"
          >
            {(state as CheckoutState).message}
          </div>
        )}

        {currentStep === "shipping" && <ShippingStep onNext={nextStep} />}

        {currentStep === "payment" && (
          <PaymentStep
            onNext={nextStep}
            onBack={prevStep}
            clientSecret={(state as CheckoutState).clientSecret ?? null}
          />
        )}

        {currentStep === "review" && (
          <ReviewStep
            onBack={prevStep}
            onSubmit={formAction}
            isPending={isPending}
          />
        )}

        {currentStep === "confirmation" &&
          (state as CheckoutState).orderId && (
            <ConfirmationStep
              orderId={(state as CheckoutState).orderId || ""}
            />
          )}
      </div>
    </main>
  );
}

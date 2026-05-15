"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { createCheckoutAction, type CheckoutState } from "@/app/actions/checkout.actions";
import { ShippingStep } from "@/components/checkout/ShippingStep";
import { PaymentStep } from "@/components/checkout/PaymentStep";
import { ReviewStep } from "@/components/checkout/ReviewStep";
import { ConfirmationStep } from "@/components/checkout/ConfirmationStep";
import { cn } from "@luxeverse/utils";

type Step = "shipping" | "payment" | "review" | "confirmation";

const steps: Step[] = ["shipping", "payment", "review", "confirmation"];

export default function CheckoutPage(): JSX.Element {
  const [currentStep, setCurrentStep] = useState<Step>("shipping");
  const [state, formAction, isPending] = useActionState(createCheckoutAction, {
    status: "idle",
  });
  const stepRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    stepRef.current?.focus();
  }, [currentStep]);

  const currentIdx = steps.indexOf(currentStep);

  const nextStep = (): void => {
    if (currentIdx < steps.length - 1) {
      setCurrentStep(steps[currentIdx + 1]);
    }
  };
  const prevStep = (): void => {
    if (currentIdx > 0) {
      setCurrentStep(steps[currentIdx - 1]);
    }
  };

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
              {idx < 2 && (
                <span className="mx-2 h-px w-8 bg-obsidian-200" />
              )}
            </div>
          ))}
      </nav>

      {/* Step Content */}
      <div ref={stepRef} tabIndex={-1} className="outline-none">
        {state.status === "error" && state.message && (
          <div
            role="alert"
            className="mb-6 rounded-lg bg-error-light p-4 text-sm text-error"
          >
            {state.message}
          </div>
        )}

        {currentStep === "shipping" && (
          <ShippingStep
            onNext={nextStep}
          />
        )}

        {currentStep === "payment" && (
          <PaymentStep onNext={nextStep} onBack={prevStep} clientSecret={state.clientSecret ?? null} />
        )}

        {currentStep === "review" && (
          <ReviewStep onBack={prevStep} onSubmit={formAction} isPending={isPending} />
        )}

        {currentStep === "confirmation" && state.orderId && (
          <ConfirmationStep orderId={state.orderId} router={router} />
        )}
      </div>
    </main>
  );
}

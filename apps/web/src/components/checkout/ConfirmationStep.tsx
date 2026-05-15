"use client";

import { useRouter } from "next/navigation";
import { Button } from "@luxeverse/ui";
import { CheckCircle } from "lucide-react";

interface ConfirmationStepProps {
  orderId: string;
}

export function ConfirmationStep({ orderId }: ConfirmationStepProps): JSX.Element {
  const router = useRouter();

  return (
    <section className="flex min-h-[50vh] flex-col items-center justify-center rounded-xl border border-obsidian-200 bg-obsidian-50 p-8 text-center shadow-sm">
      <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-success-light">
        <CheckCircle className="h-8 w-8 text-success" />
      </div>
      <h2 className="mb-2 text-2xl font-display font-medium text-obsidian-900">
        Order Confirmed
      </h2>
      <p className="mb-6 max-w-md text-obsidian-600 leading-relaxed">
        Thank you for your purchase. Your order{" "}
        <span className="font-mono font-medium text-obsidian-900">
          {orderId}
        </span>{" "}
        is being prepared with care.
      </p>
      <div className="flex gap-4">
        <Button
          variant="luxury"
          onClick={() => router.push(`/account/orders/${orderId}`)}
        >
          Track Order
        </Button>
        <Button
          variant="outline"
          onClick={() => router.push("/shop")}
        >
          Continue Shopping
        </Button>
      </div>
    </section>
  );
}

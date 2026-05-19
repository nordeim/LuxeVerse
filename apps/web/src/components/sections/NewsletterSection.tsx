"use client";

import { useActionState } from "react";
import { z } from "zod";
import { Button } from "@luxeverse/ui";
import { Input } from "@luxeverse/ui";

const newsletterSchema = z.object({
  email: z.string().min(1, "Email is required.").email("Invalid email format."),
});

type NewsletterState = { status: "idle" | "success" | "error"; message?: string };

async function subscribeAction(_prev: NewsletterState, formData: FormData): Promise<NewsletterState> {
  const result = newsletterSchema.safeParse(Object.fromEntries(formData));
  if (!result.success) {
    return { status: "error", message: result.error.issues[0].message };
  }
  // TODO: Wire to API/Resend
  await new Promise((r) => setTimeout(r, 800));
  return { status: "success", message: "Welcome to the inner circle." };
}

export function NewsletterSection() {
  const [state, formAction, isPending] = useActionState(subscribeAction, { status: "idle" });

  return (
    <section className="bg-obsidian-950 py-24 px-4 sm:px-6 lg:px-8 text-center" aria-labelledby="newsletter-heading">
      <div className="mx-auto max-w-xl">
        <h2 id="newsletter-heading" className="text-3xl font-display font-medium text-metallic-champagne mb-4">
          Join the Atelier
        </h2>
        <p className="text-sm text-obsidian-300 mb-8">
          Early access to collections, private events, and curated editorial. No noise, only signal.
        </p>
        {state.status === "success" ? (
          <p className="text-sm text-success font-medium">{state.message}</p>
        ) : (
          <form action={formAction} className="flex flex-col gap-4 sm:flex-row">
            <Input name="email" type="email" placeholder="Your email address" className="flex-1 bg-obsidian-900 border-obsidian-800 text-obsidian-100 placeholder:text-obsidian-500" />
            <Button type="submit" variant="luxury" disabled={isPending} loading={isPending}>
              Subscribe
            </Button>
          </form>
        )}
        {state.status === "error" && <p role="alert" className="mt-2 text-sm text-error">{state.message}</p>}
      </div>
    </section>
  );
}

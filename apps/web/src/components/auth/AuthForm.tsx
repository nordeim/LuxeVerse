"use client";

import { useActionState, useId } from "react";
import Link from "next/link";
import { Button } from "@luxeverse/ui";
import { Input } from "@luxeverse/ui";
import type { AuthState } from "@/app/actions/auth.actions";

interface AuthFormProps {
  type: "login" | "register";
  action: (prev: AuthState, formData: FormData) => Promise<AuthState>;
  initialState: AuthState;
}

export function AuthForm({ type, action, initialState }: AuthFormProps): JSX.Element {
  const [state, formAction, isPending] = useActionState(action, initialState);
  const formId = useId();

  return (
    <form
      action={formAction}
      className="flex flex-col gap-5"
      aria-labelledby={`${formId}-title`}
    >
      <h2 id={`${formId}-title`} className="sr-only">
        {type === "login" ? "Sign in to your account" : "Create your account"}
      </h2>

      {type === "register" && (
        <Input
          name="name"
          label="Full Name"
          placeholder="e.g., Elena Voss"
          required
          autoComplete="name"
        />
      )}

      <Input
        name="email"
        label="Email Address"
        type="email"
        placeholder="you@example.com"
        required
        autoComplete="email"
      />
      <Input
        name="password"
        label="Password"
        type="password"
        placeholder="Min. 8 characters"
        required
        autoComplete={type === "login" ? "current-password" : "new-password"}
      />

      {type === "register" && (
        <Input
          name="confirmPassword"
          label="Confirm Password"
          type="password"
          placeholder="Re-enter password"
          required
          autoComplete="new-password"
        />
      )}

      {state.status === "error" && state.message && (
        <p role="alert" className="text-sm text-error font-medium">
          {state.message}
        </p>
      )}

      <Button
        type="submit"
        variant="luxury"
        size="lg"
        className="w-full mt-2"
        loading={isPending}
        disabled={isPending}
      >
        {isPending
          ? type === "login"
            ? "Signing in..."
            : "Creating account..."
          : type === "login"
            ? "Sign In"
            : "Create Account"}
      </Button>

      <p className="text-center text-xs text-obsidian-600">
        {type === "login" ? (
          <>
            Don&apos;t have an account?{" "}
            <Link
              href="/register"
              className="font-medium text-obsidian-900 underline underline-offset-4 hover:text-neon-cyan transition-colors"
            >
              Register
            </Link>
          </>
        ) : (
          <>
            Already a member?{" "}
            <Link
              href="/login"
              className="font-medium text-obsidian-900 underline underline-offset-4 hover:text-neon-cyan transition-colors"
            >
              Sign in
            </Link>
          </>
        )}
      </p>
    </form>
  );
}

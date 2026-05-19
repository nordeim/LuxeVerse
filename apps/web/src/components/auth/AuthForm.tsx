"use client";

import { useActionState, useEffect, useId, useState } from "react";
import type { ReactElement } from "react";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { Button, Input } from "@luxeverse/ui";
import type { AuthState } from "@/app/actions/auth.actions";

interface AuthFormProps {
  type: "login" | "register";
  action: (prev: AuthState, formData: FormData) => Promise<AuthState>;
  initialState: AuthState;
}

export function AuthForm({ type, action, initialState }: AuthFormProps): ReactElement {
  const [state, formAction, isPending] = useActionState(action, initialState);
  const formId = useId();

  // Track credentials so we can call signIn after server action success
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // On server action success, call NextAuth signIn to establish session
  useEffect(() => {
    if (state.status === "success" && email && password) {
      void signIn("credentials", {
        email,
        password,
        callbackUrl: "/",
      });
    }
  }, [state.status, email, password]);

  return (
    <form
      action={(formData) => {
        // Capture credentials before form submission
        const emailValue = String(formData.get("email") ?? "");
        const passwordValue = String(formData.get("password") ?? "");
        setEmail(emailValue);
        setPassword(passwordValue);
        formAction(formData);
      }}
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

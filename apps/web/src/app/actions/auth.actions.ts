"use server";

import { prisma } from "@/lib/prisma";
import { hashPassword, verifyPassword } from "@/lib/crypto";
import { loginSchema, registerSchema } from "@/lib/schemas";

export type AuthState = {
  status: "idle" | "success" | "error";
  message?: string;
};

// ─── Login Action ──────────────────────────────────────────────────────────
export async function loginAction(
  _prevState: AuthState,
  formData: FormData
): Promise<AuthState> {
  const data = Object.fromEntries(formData.entries());
  const parsed = loginSchema.safeParse(data);

  if (!parsed.success) {
    return {
      status: "error",
      message: parsed.error.issues[0].message,
    };
  }

  const { email, password } = parsed.data;

  try {
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user || !user.password) {
      return { status: "error", message: "Invalid email or password." };
    }

    const isValid = await verifyPassword(password, user.password);

    if (!isValid) {
      return { status: "error", message: "Invalid email or password." };
    }

    // NOTE: The actual session creation is handled by the NextAuth API route.
    // The AuthForm component should call signIn("credentials", ...) on the client
    // after receiving status "success".
    return { status: "success" };
  } catch {
    return {
      status: "error",
      message: "Authentication failed. Please try again.",
    };
  }
}

// ─── Register Action ────────────────────────────────────────────────────────
export async function registerAction(
  _prevState: AuthState,
  formData: FormData
): Promise<AuthState> {
  const data = Object.fromEntries(formData.entries());
  const parsed = registerSchema.safeParse(data);

  if (!parsed.success) {
    return {
      status: "error",
      message: parsed.error.issues[0].message,
    };
  }

  const { email, password, name } = parsed.data;

  try {
    const existing = await prisma.user.findUnique({ where: { email } });

    if (existing) {
      return {
        status: "error",
        message: "An account with this email already exists.",
      };
    }

    const hashedPassword = await hashPassword(password);

    await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        role: "CUSTOMER",
        status: "ACTIVE",
      },
    });

    // NOTE: The client AuthForm component should call signIn("credentials", ...)
    // after receiving status "success" to create the session.
    return { status: "success" };
  } catch {
    return {
      status: "error",
      message: "Registration failed. Please try again.",
    };
  }
}

"use server";

import { z } from "zod";
import { signIn } from "next-auth/react";
import { redirect } from "next/navigation";
import { loginSchema, registerSchema } from "@/lib/schemas";
import { prisma } from "@/lib/prisma";
import { hashPassword, verifyPassword } from "@/lib/crypto";

export type AuthState = {
  status: "idle" | "success" | "error";
  message?: string;
};

const initialState: AuthState = { status: "idle" };

// ─── Login Action ─────────────────────────────────────────────────────────
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

    // Sign in via NextAuth
    await signIn("credentials", {
      email,
      password,
      redirectTo: "/account",
    });

    return { status: "success" };
  } catch (error) {
    return {
      status: "error",
      message: "Authentication failed. Please try again.",
    };
  }
}

// ─── Register Action ────────────────────────────────────────────────────
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

    // Auto-login after registration
    await signIn("credentials", {
      email,
      password,
      redirectTo: "/account",
    });

    return { status: "success" };
  } catch (error) {
    return {
      status: "error",
      message: "Registration failed. Please try again.",
    };
  }
}

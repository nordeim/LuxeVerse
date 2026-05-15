import { createTRPCReact } from "@trpc/react-query";
import { httpBatchLink, loggerLink } from "@trpc/client";
import type { AppRouter } from "@/server";

const getBaseUrl = () => {
  if (typeof window !== "undefined") return "";
  // In production: const envUrl = process.env.NEXT_PUBLIC_VERCEL_URL;
  return `http://localhost:${process.env.PORT ?? 3000}`;
};

export const trpc = createTRPCReact<AppRouter>();

export const createTRPCClient = () => {
  return createTRPCReact<AppRouter>();
};

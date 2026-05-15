import { AuthForm } from "@/components/auth/AuthForm";
import { registerAction } from "@/app/actions/auth.actions";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create Account | LuxeVerse",
  description: "Join LuxeVerse for personalized luxury commerce.",
};

export default function RegisterPage(): JSX.Element {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-4 py-12 bg-obsidian-50">
      <div className="w-full max-w-md rounded-2xl border border-obsidian-200 bg-obsidian-50/80 p-8 shadow-sm backdrop-blur-sm">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-display font-medium text-obsidian-900">
            Join the Atelier
          </h1>
          <p className="mt-2 text-sm text-obsidian-600">
            Create your account to begin your curated journey.
          </p>
        </div>
        <AuthForm
          type="register"
          action={registerAction}
          initialState={{ status: "idle" }}
        />
      </div>
    </main>
  );
}

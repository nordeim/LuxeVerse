import { AuthForm } from "@/components/auth/AuthForm";
import { loginAction } from "@/app/actions/auth.actions";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign In | LuxeVerse",
  description: "Access your personalized luxury boutique.",
};

export default function LoginPage(): JSX.Element {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-4 py-12 bg-obsidian-50">
      <div className="w-full max-w-md rounded-2xl border border-obsidian-200 bg-obsidian-50/80 p-8 shadow-sm backdrop-blur-sm">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-display font-medium text-obsidian-900">
            Welcome Back
          </h1>
          <p className="mt-2 text-sm text-obsidian-600">
            Enter your credentials to access your atelier.
          </p>
        </div>
        <AuthForm
          type="login"
          action={loginAction}
          initialState={{ status: "idle" }}
        />
      </div>
    </main>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getSessionUser } from "@/server/auth";
import { LoginForm } from "./login-form";

export const metadata: Metadata = {
  title: "Sign in",
  description: "Sign in to manage your MyHomestay listings.",
};

export default async function LoginPage() {
  // Already signed in? Go straight to the dashboard.
  const user = await getSessionUser();
  if (user) {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen bg-paper">
      <header className="border-b border-stone">
        <div className="mx-auto flex w-full max-w-public items-center px-4 py-4 sm:px-6">
          <Link href="/" className="font-display text-lg font-medium text-ink">
            MyHomestay
          </Link>
        </div>
      </header>

      <main className="mx-auto w-full max-w-md px-4 py-12 sm:px-6">
        <h1 className="font-display text-3xl text-ink">Sign in</h1>
        <p className="mt-2 text-base leading-relaxed text-muted-ink">
          Manage your homestay listings. We use a one-time email code, so there
          is no password to remember.
        </p>

        <div className="mt-8 rounded-card border border-stone bg-white p-5 sm:p-6">
          <LoginForm />
        </div>

        <p className="mt-6 text-sm text-muted-ink">
          Just browsing?{" "}
          <Link href="/listings" className="underline hover:text-ink">
            Explore homestays
          </Link>
        </p>
      </main>
    </div>
  );
}

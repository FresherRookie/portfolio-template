import Link from "next/link";

import ForgotPasswordForm from "./ForgotPasswordForm";

export default function ForgotPasswordPage() {
  return (
    <main className="flex min-h-screen items-center justify-center px-6">
      <div className="w-full max-w-md space-y-6">
        <div>
          <h1 className="text-3xl font-semibold">Forgot your password?</h1>

          <p className="mt-2 text-sm text-muted-foreground">
            Enter your email address and we&apos;ll send you a password reset
            link.
          </p>
        </div>

        <ForgotPasswordForm />

        <p className="text-center text-sm">
          <Link href="/login" className="underline">
            Back to sign in
          </Link>
        </p>
      </div>
    </main>
  );
}

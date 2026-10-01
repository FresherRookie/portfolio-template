import Link from "next/link";

import ResetPasswordForm from "./ResetPasswordForm";

type ResetPasswordPageProps = {
  searchParams: Promise<{
    token?: string;
  }>;
};

export default async function ResetPasswordPage({
  searchParams,
}: ResetPasswordPageProps) {
  const { token } = await searchParams;

  return (
    <main className="flex min-h-screen items-center justify-center px-6">
      <div className="w-full max-w-md space-y-6">
        <div>
          <h1 className="text-3xl font-semibold">Reset your password</h1>

          <p className="mt-2 text-sm text-muted-foreground">
            Choose a new password for your account.
          </p>
        </div>

        {token ? (
          <ResetPasswordForm token={token} />
        ) : (
          <div className="space-y-4">
            <p className="text-sm text-red-600">
              This password reset link is invalid or has expired.
            </p>

            <Link href="/forgot-password" className="underline">
              Request a new reset link
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}

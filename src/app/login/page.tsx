import Link from "next/link";

import LoginForm from "./LoginForm";

type LoginPageProps = {
  searchParams: Promise<{
    reset?: string;
  }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const { reset } = await searchParams;

  const resetSuccessful = reset === "success";

  return (
    <main className="flex min-h-screen items-center justify-center px-6">
      <div className="w-full max-w-md space-y-6">
        <div>
          <h1 className="text-3xl font-semibold">Sign in</h1>

          <p className="mt-2 text-sm text-muted-foreground">
            Sign in to access the administration area.
          </p>
        </div>

        {resetSuccessful && (
          <p className="text-sm text-green-600" role="status">
            Your password has been reset successfully. You can now sign in with
            your new password.
          </p>
        )}

        <LoginForm />

        <p className="text-center text-sm">
          <Link href="/" className="underline">
            Back to website
          </Link>
        </p>
      </div>
    </main>
  );
}

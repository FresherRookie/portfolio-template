"use client";

import { useActionState } from "react";

import { resetPassword, type PasswordResetActionState } from "@/actions/auth";

type ResetPasswordFormProps = {
  token: string;
};

const initialState: PasswordResetActionState = {
  success: false,
  message: "",
};

export default function ResetPasswordForm({ token }: ResetPasswordFormProps) {
  const [state, formAction, pending] = useActionState(
    resetPassword,
    initialState,
  );

  return (
    <form action={formAction} className="space-y-6">
      <input type="hidden" name="token" value={token} />

      <div>
        <label htmlFor="password">New password</label>

        <input
          id="password"
          name="password"
          type="password"
          required
          minLength={8}
          autoComplete="new-password"
          className="w-full rounded-md border px-3 py-2"
        />

        {state.errors?.password && (
          <p className="mt-1 text-sm text-red-600">
            {state.errors.password[0]}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="confirmPassword">Confirm new password</label>

        <input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          required
          minLength={8}
          autoComplete="new-password"
          className="w-full rounded-md border px-3 py-2"
        />

        {state.errors?.confirmPassword && (
          <p className="mt-1 text-sm text-red-600">
            {state.errors.confirmPassword[0]}
          </p>
        )}
      </div>

      {state.message && (
        <p
          className={
            state.success ? "text-sm text-green-600" : "text-sm text-red-600"
          }
          role="status"
        >
          {state.message}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-md bg-black px-4 py-2 text-white disabled:opacity-50"
      >
        {pending ? "Resetting..." : "Reset password"}
      </button>
    </form>
  );
}

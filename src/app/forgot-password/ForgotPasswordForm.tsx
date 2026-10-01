"use client";

import { useActionState } from "react";

import {
  requestPasswordReset,
  type PasswordResetActionState,
} from "@/actions/auth";

const initialState: PasswordResetActionState = {
  success: false,
  message: "",
};

export default function ForgotPasswordForm() {
  const [state, formAction, pending] = useActionState(
    requestPasswordReset,
    initialState,
  );

  return (
    <form action={formAction} className="space-y-6">
      <div>
        <label htmlFor="email">Email</label>

        <input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="email"
          className="w-full rounded-md border px-3 py-2"
        />

        {state.errors?.email && (
          <p className="mt-1 text-sm text-red-600">{state.errors.email[0]}</p>
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
        {pending ? "Sending..." : "Send reset link"}
      </button>
    </form>
  );
}

"use server";

import { auth } from "@/lib/auth";

export type PasswordResetActionState = {
  success: boolean;
  message: string;
  errors?: {
    email?: string[];
    password?: string[];
    confirmPassword?: string[];
  };
};

export async function requestPasswordReset(
  _previousState: PasswordResetActionState,
  formData: FormData,
): Promise<PasswordResetActionState> {
  const email = String(formData.get("email") ?? "").trim();

  if (!email) {
    return {
      success: false,
      message: "Please enter your email address.",
      errors: {
        email: ["Email address is required."],
      },
    };
  }

  try {
    await auth.api.requestPasswordReset({
      body: {
        email,
        redirectTo: "/reset-password",
      },
    });

    return {
      success: true,
      message:
        "If an account exists for that email address, a password reset link has been sent.",
    };
  } catch (error) {
    console.error("Password reset request failed:", error);

    return {
      success: false,
      message:
        "Unable to process the password reset request. Please try again later.",
    };
  }
}

export async function resetPassword(
  _previousState: PasswordResetActionState,
  formData: FormData,
): Promise<PasswordResetActionState> {
  const password = String(formData.get("password") ?? "");
  const confirmPassword = String(formData.get("confirmPassword") ?? "");
  const token = String(formData.get("token") ?? "");

  const errors: PasswordResetActionState["errors"] = {};

  if (!token) {
    return {
      success: false,
      message: "This password reset link is invalid or has expired.",
    };
  }

  if (password.length < 8) {
    errors.password = ["Password must be at least 8 characters long."];
  }

  if (password !== confirmPassword) {
    errors.confirmPassword = ["Passwords do not match."];
  }

  if (Object.keys(errors).length > 0) {
    return {
      success: false,
      message: "Please check the form and try again.",
      errors,
    };
  }

  try {
    await auth.api.resetPassword({
      body: {
        newPassword: password,
        token,
      },
    });

    return {
      success: true,
      message: "Your password has been reset successfully.",
    };
  } catch (error) {
    console.error("Password reset failed:", error);

    return {
      success: false,
      message: "Unable to reset your password. The link may have expired.",
    };
  }
}
export type LoginActionState = {
  success: boolean;
  message: string;
};

export async function login(
  _previousState: LoginActionState,
  formData: FormData,
): Promise<LoginActionState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    return {
      success: false,
      message: "Email and password are required.",
    };
  }

  try {
    await auth.api.signInEmail({
      body: {
        email,
        password,
      },
    });

    return {
      success: true,
      message: "",
    };
  } catch (error) {
    console.error("Login failed:", error);

    return {
      success: false,
      message: "Invalid email or password.",
    };
  }
}

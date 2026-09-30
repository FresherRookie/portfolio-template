import { redirect } from "next/navigation";

import { getCurrentUser } from "@/lib/auth-utils";

export async function requireAdmin() {
  const user = await getCurrentUser();

  if (!user) {
    throw new Error("UNAUTHENTICATED");
  }

  if (user.role !== "admin") {
    throw new Error("FORBIDDEN");
  }

  return user;
}

export async function requireAdminPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  if (user.role !== "admin") {
    redirect("/forbidden");
  }

  return user;
}

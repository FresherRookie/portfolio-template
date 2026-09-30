import { getCurrentUser } from "@/lib/auth-utils";
export default async function AdminPage() {
  const user = await getCurrentUser();

  return (
    <main className="p-8">
      <h1 className="text-3xl font-semibold">Admin</h1>
      <p className="mt-2">You are authenticated.</p>
      <p>Hi {user?.email}</p>
    </main>
  );
}

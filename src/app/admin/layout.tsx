import { LogoutButton } from "@/components/auth/LogoutButton";
import { requireAdminPage } from "@/lib/permissions";

export default async function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await requireAdminPage();

  return (
    <div className="min-h-screen">
      <header>
        Signed in as {user?.email} <LogoutButton />
      </header>
      {children}
    </div>
  );
}

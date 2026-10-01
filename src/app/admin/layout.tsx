import Link from "next/link";

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
      <header className="border-b">
        <div className="flex items-center justify-between px-6 py-4">
          <nav className="flex items-center gap-6">
            <Link href="/admin" className="font-semibold">
              Admin
            </Link>

            <Link href="/admin/projects">Projects</Link>
          </nav>

          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">{user.email}</span>

            <LogoutButton />
          </div>
        </div>
      </header>

      {children}
    </div>
  );
}

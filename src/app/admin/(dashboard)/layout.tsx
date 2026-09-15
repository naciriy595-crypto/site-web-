import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { Logo } from "@/components/Logo";
import { AdminNav } from "@/components/admin/AdminNav";
import { LogoutButton } from "@/components/admin/LogoutButton";

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  if (!session) redirect("/admin/login");

  return (
    <div className="min-h-screen bg-background md:flex">
      <aside className="flex flex-col justify-between bg-[#131215] px-4 py-6 md:w-64 md:min-h-screen">
        <div>
          <div className="px-2">
            <Logo dark className="text-xl" />
          </div>
          <div className="mt-8">
            <AdminNav />
          </div>
        </div>
        <div className="space-y-2">
          <p className="px-3 text-xs text-white/50">{session.email}</p>
          <LogoutButton />
        </div>
      </aside>

      <div className="flex-1 px-4 py-8 sm:px-8">{children}</div>
    </div>
  );
}

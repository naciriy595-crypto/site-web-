"use client";

import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";

export function LogoutButton() {
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <button
      onClick={handleLogout}
      className="flex min-h-11 items-center gap-2 rounded-lg px-3 text-sm text-white/70 hover:bg-white/10 hover:text-white"
    >
      <LogOut size={16} /> Log Out
    </button>
  );
}

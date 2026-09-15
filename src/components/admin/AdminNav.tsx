"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Package, ClipboardList } from "lucide-react";
import clsx from "clsx";

const links = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/orders", label: "Orders", icon: ClipboardList },
];

export function AdminNav() {
  const pathname = usePathname();

  return (
    <nav className="space-y-1">
      {links.map((link) => {
        const active =
          link.href === "/admin" ? pathname === "/admin" : pathname.startsWith(link.href);
        return (
          <Link
            key={link.href}
            href={link.href}
            className={clsx(
              "flex min-h-11 items-center gap-3 rounded-lg px-3 text-sm transition-colors",
              active ? "bg-white text-[#131215]" : "text-white/70 hover:bg-white/10 hover:text-white"
            )}
          >
            <link.icon size={17} />
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}

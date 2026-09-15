"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X, ShoppingBag, Truck } from "lucide-react";
import { Logo } from "./Logo";
import { CartCount } from "./CartCount";

type NavCategory = { slug: string; nameFr: string; nameAr: string };

export function Header({ categories }: { categories: NavCategory[] }) {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur supports-[backdrop-filter]:bg-background/70">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
        <button
          className="p-2 -ml-2 md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label="Ouvrir le menu"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>

        <Logo />

        <nav className="hidden md:flex items-center gap-7 text-sm font-medium tracking-wide">
          {categories.map((c) => (
            <Link
              key={c.slug}
              href={`/shop/${c.slug}`}
              className="text-foreground/80 hover:text-foreground transition-colors"
            >
              {c.nameFr}
            </Link>
          ))}
          <Link
            href="/track"
            className="inline-flex items-center gap-1.5 text-foreground/60 hover:text-foreground transition-colors"
          >
            <Truck size={15} /> Suivre ma commande
          </Link>
        </nav>

        <Link
          href="/cart"
          className="relative p-2 -mr-2 text-foreground hover:opacity-70 transition-opacity"
          aria-label="Voir le panier"
        >
          <ShoppingBag size={22} />
          <CartCount />
        </Link>
      </div>

      {open && (
        <nav className="md:hidden border-t border-border bg-surface px-4 py-3 flex flex-col gap-3 text-sm font-medium">
          {categories.map((c) => (
            <Link
              key={c.slug}
              href={`/shop/${c.slug}`}
              onClick={() => setOpen(false)}
              className="py-1.5"
            >
              {c.nameFr} <span className="text-muted">· {c.nameAr}</span>
            </Link>
          ))}
          <Link href="/track" onClick={() => setOpen(false)} className="py-1.5 flex items-center gap-1.5">
            <Truck size={15} /> Suivre ma commande
          </Link>
        </nav>
      )}
    </header>
  );
}

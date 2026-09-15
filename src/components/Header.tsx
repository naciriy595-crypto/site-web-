"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X, ShoppingBag, Truck, Heart } from "lucide-react";
import { Logo } from "./Logo";
import { CartCount } from "./CartCount";
import { WishlistCount } from "./WishlistCount";
import { SearchBar } from "./SearchBar";
import { useCartStore } from "@/lib/cart-store";

type NavCategory = { slug: string; name: string };

export function Header({ categories }: { categories: NavCategory[] }) {
  const [open, setOpen] = useState(false);
  const openCart = useCartStore((s) => s.openCart);

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur supports-[backdrop-filter]:bg-background/70">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-2 px-3 py-2 sm:px-6 sm:py-3">
        <button
          className="flex h-11 w-11 items-center justify-center md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label="Open menu"
          aria-expanded={open}
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
              {c.name}
            </Link>
          ))}
          <Link
            href="/track"
            className="inline-flex items-center gap-1.5 text-foreground/60 hover:text-foreground transition-colors"
          >
            <Truck size={15} /> Track Order
          </Link>
        </nav>

        <div className="flex items-center gap-0.5 sm:gap-1">
          <SearchBar />
          <Link
            href="/wishlist"
            aria-label="Wishlist"
            className="relative flex h-11 w-11 items-center justify-center text-foreground hover:opacity-70"
          >
            <Heart size={20} />
            <WishlistCount />
          </Link>
          <button
            onClick={openCart}
            aria-label="Open cart"
            className="relative flex h-11 w-11 items-center justify-center text-foreground hover:opacity-70"
          >
            <ShoppingBag size={20} />
            <CartCount />
          </button>
        </div>
      </div>

      {open && (
        <nav className="md:hidden border-t border-border bg-surface px-4 py-3 flex flex-col text-sm font-medium">
          {categories.map((c) => (
            <Link
              key={c.slug}
              href={`/shop/${c.slug}`}
              onClick={() => setOpen(false)}
              className="flex min-h-11 items-center py-2"
            >
              {c.name}
            </Link>
          ))}
          <Link
            href="/track"
            onClick={() => setOpen(false)}
            className="flex min-h-11 items-center gap-1.5 py-2"
          >
            <Truck size={15} /> Track Order
          </Link>
        </nav>
      )}
    </header>
  );
}

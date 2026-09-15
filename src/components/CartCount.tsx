"use client";

import { useCartStore } from "@/lib/cart-store";
import { useHasMounted } from "@/lib/use-has-mounted";

export function CartCount() {
  const mounted = useHasMounted();
  const count = useCartStore((s) => s.totalItems());

  if (!mounted || count === 0) return null;

  return (
    <span className="absolute -top-1 -right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-accent px-1 text-[10px] font-semibold text-white">
      {count}
    </span>
  );
}

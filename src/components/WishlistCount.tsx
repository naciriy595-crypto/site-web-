"use client";

import { useWishlistStore } from "@/lib/wishlist-store";
import { useHasMounted } from "@/lib/use-has-mounted";

export function WishlistCount() {
  const mounted = useHasMounted();
  const count = useWishlistStore((s) => s.items.length);

  if (!mounted || count === 0) return null;

  return (
    <span className="absolute -top-1 -right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-accent px-1 text-[10px] font-semibold text-white">
      {count}
    </span>
  );
}

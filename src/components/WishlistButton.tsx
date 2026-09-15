"use client";

import { Heart } from "lucide-react";
import { useWishlistStore } from "@/lib/wishlist-store";
import { useHasMounted } from "@/lib/use-has-mounted";

export function WishlistButton({
  productId,
  slug,
  name,
  price,
  image,
  className,
  size = 18,
}: {
  productId: string;
  slug: string;
  name: string;
  price: number;
  image: string;
  className?: string;
  size?: number;
}) {
  const mounted = useHasMounted();
  const has = useWishlistStore((s) => (mounted ? s.has(productId) : false));
  const toggle = useWishlistStore((s) => s.toggle);

  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggle({ productId, slug, name, price, image });
      }}
      aria-label={has ? "Remove from wishlist" : "Add to wishlist"}
      aria-pressed={has}
      className={
        className ??
        "flex h-10 w-10 items-center justify-center rounded-full border border-border bg-surface/90 backdrop-blur transition-colors hover:border-foreground/40"
      }
    >
      <Heart size={size} className={has ? "fill-foreground text-foreground" : "text-foreground"} />
    </button>
  );
}

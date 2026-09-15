"use client";

import Link from "next/link";
import Image from "next/image";
import { Trash2 } from "lucide-react";
import { useWishlistStore } from "@/lib/wishlist-store";
import { useCartStore } from "@/lib/cart-store";
import { useHasMounted } from "@/lib/use-has-mounted";
import { formatMAD } from "@/lib/format";

export default function WishlistPage() {
  const mounted = useHasMounted();
  const items = useWishlistStore((s) => s.items);
  const remove = useWishlistStore((s) => s.remove);
  const addItem = useCartStore((s) => s.addItem);

  if (!mounted) return null;

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-xl px-4 py-24 text-center sm:px-6">
        <h1 className="font-display text-3xl uppercase tracking-wide">
          Your Wishlist is Empty
        </h1>
        <p className="mt-3 text-sm text-muted">
          Tap the heart icon on any product to save it here.
        </p>
        <Link
          href="/shop/all"
          className="mt-6 inline-flex min-h-12 items-center rounded-full bg-foreground px-6 text-sm font-medium text-white"
        >
          Shop All
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 sm:py-10">
      <h1 className="font-display text-2xl uppercase tracking-wide sm:text-3xl">Wishlist</h1>

      <div className="mt-6 divide-y divide-border border-y border-border sm:mt-8">
        {items.map((item) => (
          <div key={item.productId} className="flex flex-wrap items-center gap-4 py-5">
            <Link href={`/product/${item.slug}`} className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg border border-border bg-surface">
              {item.image && (
                <Image src={item.image} alt={item.name} fill className="object-cover" sizes="80px" />
              )}
            </Link>

            <div className="min-w-[140px] flex-1">
              <Link href={`/product/${item.slug}`} className="text-sm font-medium hover:underline">
                {item.name}
              </Link>
              <p className="mt-1 text-sm text-muted">{formatMAD(item.price)}</p>
            </div>

            <div className="ml-auto flex items-center gap-2 sm:ml-0">
              <button
                onClick={() =>
                  addItem({
                    productId: item.productId,
                    slug: item.slug,
                    name: item.name,
                    price: item.price,
                    image: item.image,
                    quantity: 1,
                    stockStatus: "IN_STOCK",
                  })
                }
                className="flex min-h-10 items-center rounded-full bg-foreground px-4 text-xs font-medium text-white"
              >
                Add to Cart
              </button>
              <button
                onClick={() => remove(item.productId)}
                className="flex h-10 w-10 items-center justify-center text-muted hover:text-foreground"
                aria-label="Remove from wishlist"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

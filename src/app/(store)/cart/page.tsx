"use client";

import Link from "next/link";
import Image from "next/image";
import { Minus, Plus, Trash2 } from "lucide-react";
import { useCartStore } from "@/lib/cart-store";
import { formatMAD } from "@/lib/format";
import { useHasMounted } from "@/lib/use-has-mounted";

export default function CartPage() {
  const mounted = useHasMounted();
  const lines = useCartStore((s) => s.lines);
  const setQuantity = useCartStore((s) => s.setQuantity);
  const removeItem = useCartStore((s) => s.removeItem);
  const totalPrice = useCartStore((s) => s.totalPrice());

  if (!mounted) return null;

  if (lines.length === 0) {
    return (
      <div className="mx-auto max-w-xl px-4 py-24 text-center sm:px-6">
        <h1 className="font-display text-3xl uppercase tracking-wide">
          Your Cart is Empty
        </h1>
        <p className="mt-3 text-sm text-muted">
          Browse the shop and add your favorite Clifstone pieces.
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
      <h1 className="font-display text-2xl uppercase tracking-wide sm:text-3xl">Your Cart</h1>

      <div className="mt-6 divide-y divide-border border-y border-border sm:mt-8">
        {lines.map((line) => (
          <div key={line.productId} className="flex flex-wrap items-center gap-4 py-5">
            <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg border border-border bg-surface">
              {line.image && (
                <Image src={line.image} alt={line.name} fill className="object-cover" sizes="80px" />
              )}
            </div>

            <div className="min-w-[140px] flex-1">
              <Link href={`/product/${line.slug}`} className="text-sm font-medium hover:underline">
                {line.name}
              </Link>
              <p className="mt-1 text-sm text-muted">{formatMAD(line.price)}</p>
            </div>

            <div className="ml-auto flex items-center gap-3 sm:ml-0">
              <div className="flex items-center rounded-full border border-border">
                <button
                  onClick={() => setQuantity(line.productId, line.quantity - 1)}
                  className="flex h-10 w-10 items-center justify-center"
                  aria-label="Decrease quantity"
                >
                  <Minus size={14} />
                </button>
                <span className="w-6 text-center text-sm">{line.quantity}</span>
                <button
                  onClick={() => setQuantity(line.productId, line.quantity + 1)}
                  className="flex h-10 w-10 items-center justify-center"
                  aria-label="Increase quantity"
                >
                  <Plus size={14} />
                </button>
              </div>

              <div className="w-16 shrink-0 text-right text-sm font-medium sm:w-20">
                {formatMAD(line.price * line.quantity)}
              </div>

              <button
                onClick={() => removeItem(line.productId)}
                className="flex h-10 w-10 items-center justify-center text-muted hover:text-foreground"
                aria-label="Remove item"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 flex flex-col items-end gap-2">
        <div className="flex w-full max-w-xs justify-between text-sm text-muted sm:w-64">
          <span>Shipping</span>
          <span className="text-foreground">Free</span>
        </div>
        <div className="flex w-full max-w-xs justify-between text-base font-semibold sm:w-64">
          <span>Total</span>
          <span>{formatMAD(totalPrice)}</span>
        </div>
        <Link
          href="/checkout"
          className="mt-4 flex min-h-12 w-full max-w-xs items-center justify-center rounded-full bg-foreground px-6 text-center text-sm font-medium text-white transition-opacity hover:opacity-90 sm:w-64"
        >
          Checkout
        </Link>
      </div>
    </div>
  );
}

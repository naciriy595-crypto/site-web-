"use client";

import { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Minus, Plus, Trash2, X } from "lucide-react";
import { useCartStore } from "@/lib/cart-store";
import { useHasMounted } from "@/lib/use-has-mounted";
import { formatMAD } from "@/lib/format";

export function MiniCart() {
  const mounted = useHasMounted();
  const isOpen = useCartStore((s) => s.isOpen);
  const closeCart = useCartStore((s) => s.closeCart);
  const lines = useCartStore((s) => s.lines);
  const setQuantity = useCartStore((s) => s.setQuantity);
  const removeItem = useCartStore((s) => s.removeItem);
  const totalPrice = useCartStore((s) => s.totalPrice());

  useEffect(() => {
    if (!isOpen) return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") closeCart();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [closeCart]);

  if (!mounted || !isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <button
        className="absolute inset-0 bg-black/40"
        aria-label="Close cart"
        onClick={closeCart}
      />
      <div className="relative flex h-full w-full max-w-sm flex-col bg-surface shadow-xl">
        <div className="flex items-center justify-between border-b border-border px-4 py-4">
          <h2 className="font-display text-lg uppercase tracking-wide">
            Your Cart {lines.length > 0 && `(${lines.length})`}
          </h2>
          <button
            onClick={closeCart}
            aria-label="Close cart"
            className="flex h-11 w-11 items-center justify-center rounded-full hover:bg-background"
          >
            <X size={20} />
          </button>
        </div>

        {lines.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
            <p className="text-sm text-muted">Your cart is empty.</p>
            <Link
              href="/shop/all"
              onClick={closeCart}
              className="rounded-full bg-foreground px-6 py-3 text-sm font-medium text-white"
            >
              Browse the shop
            </Link>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto px-4">
              {lines.map((line) => (
                <div key={line.productId} className="flex gap-3 border-b border-border py-4">
                  <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg border border-border bg-background">
                    {line.image && (
                      <Image src={line.image} alt={line.name} fill className="object-cover" sizes="64px" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <Link
                      href={`/product/${line.slug}`}
                      onClick={closeCart}
                      className="text-sm font-medium hover:underline"
                    >
                      {line.name}
                    </Link>
                    <p className="mt-0.5 text-xs text-muted">{formatMAD(line.price)}</p>
                    <div className="mt-2 flex items-center gap-3">
                      <div className="flex items-center rounded-full border border-border">
                        <button
                          onClick={() => setQuantity(line.productId, line.quantity - 1)}
                          className="flex h-8 w-8 items-center justify-center"
                          aria-label="Decrease quantity"
                        >
                          <Minus size={13} />
                        </button>
                        <span className="w-6 text-center text-sm">{line.quantity}</span>
                        <button
                          onClick={() => setQuantity(line.productId, line.quantity + 1)}
                          className="flex h-8 w-8 items-center justify-center"
                          aria-label="Increase quantity"
                        >
                          <Plus size={13} />
                        </button>
                      </div>
                      <button
                        onClick={() => removeItem(line.productId)}
                        aria-label="Remove item"
                        className="flex h-8 w-8 items-center justify-center text-muted hover:text-foreground"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-3 border-t border-border p-4">
              <div className="flex justify-between text-sm text-muted">
                <span>Shipping</span>
                <span className="text-foreground">Free</span>
              </div>
              <div className="flex justify-between text-base font-semibold">
                <span>Total</span>
                <span>{formatMAD(totalPrice)}</span>
              </div>
              <Link
                href="/checkout"
                onClick={closeCart}
                className="block w-full rounded-full bg-foreground px-6 py-3.5 text-center text-sm font-medium text-white transition-opacity hover:opacity-90"
              >
                Checkout
              </Link>
              <Link
                href="/cart"
                onClick={closeCart}
                className="block w-full rounded-full border border-border px-6 py-3 text-center text-sm font-medium text-foreground hover:border-foreground/40"
              >
                View cart
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

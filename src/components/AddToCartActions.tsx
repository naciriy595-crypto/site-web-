"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Minus, Plus } from "lucide-react";
import { useCartStore } from "@/lib/cart-store";

export function AddToCartActions({
  productId,
  slug,
  name,
  price,
  image,
  stockStatus,
}: {
  productId: string;
  slug: string;
  name: string;
  price: number;
  image: string;
  stockStatus: "IN_STOCK" | "OUT_OF_STOCK";
}) {
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const addItem = useCartStore((s) => s.addItem);
  const router = useRouter();
  const outOfStock = stockStatus === "OUT_OF_STOCK";

  function handleAdd() {
    addItem({ productId, slug, name, price, image, quantity: qty, stockStatus });
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  }

  function handleBuyNow() {
    addItem({ productId, slug, name, price, image, quantity: qty, stockStatus });
    router.push("/checkout");
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <span className="text-sm text-muted">Quantity</span>
        <div className="flex items-center rounded-full border border-border">
          <button
            onClick={() => setQty((q) => Math.max(1, q - 1))}
            className="flex h-11 w-11 items-center justify-center"
            aria-label="Decrease quantity"
          >
            <Minus size={14} />
          </button>
          <span className="w-8 text-center text-sm font-medium">{qty}</span>
          <button
            onClick={() => setQty((q) => Math.min(20, q + 1))}
            className="flex h-11 w-11 items-center justify-center"
            aria-label="Increase quantity"
          >
            <Plus size={14} />
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <button
          onClick={handleBuyNow}
          disabled={outOfStock}
          className="flex min-h-12 flex-1 items-center justify-center rounded-full bg-foreground px-6 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {outOfStock ? "Out of Stock" : "Buy Now"}
        </button>
        <button
          onClick={handleAdd}
          disabled={outOfStock}
          className="flex min-h-12 flex-1 items-center justify-center rounded-full border border-border px-6 text-sm font-medium text-foreground transition-colors hover:border-foreground/40 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {added ? "Added ✓" : "Add to Cart"}
        </button>
      </div>
    </div>
  );
}

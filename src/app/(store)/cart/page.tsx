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
          Votre panier est vide
        </h1>
        <p className="mt-3 text-sm text-muted">
          Parcourez la boutique et ajoutez vos pièces Clifstone préférées.
        </p>
        <Link
          href="/shop/all"
          className="mt-6 inline-block rounded-full bg-foreground px-6 py-3 text-sm font-medium text-white"
        >
          Voir la boutique
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <h1 className="font-display text-3xl uppercase tracking-wide">Panier</h1>

      <div className="mt-8 divide-y divide-border border-y border-border">
        {lines.map((line) => (
          <div key={line.productId} className="flex items-center gap-4 py-5">
            <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg border border-border bg-surface">
              {line.image && (
                <Image src={line.image} alt={line.name} fill className="object-cover" sizes="80px" />
              )}
            </div>

            <div className="flex-1 min-w-0">
              <Link href={`/product/${line.slug}`} className="text-sm font-medium hover:underline">
                {line.name}
              </Link>
              <p className="mt-1 text-sm text-muted">{formatMAD(line.price)}</p>
            </div>

            <div className="flex items-center rounded-full border border-border">
              <button
                onClick={() => setQuantity(line.productId, line.quantity - 1)}
                className="p-2"
                aria-label="Diminuer la quantité"
              >
                <Minus size={14} />
              </button>
              <span className="w-6 text-center text-sm">{line.quantity}</span>
              <button
                onClick={() => setQuantity(line.productId, line.quantity + 1)}
                className="p-2"
                aria-label="Augmenter la quantité"
              >
                <Plus size={14} />
              </button>
            </div>

            <div className="w-20 shrink-0 text-right text-sm font-medium">
              {formatMAD(line.price * line.quantity)}
            </div>

            <button
              onClick={() => removeItem(line.productId)}
              className="p-2 text-muted hover:text-foreground"
              aria-label="Retirer l'article"
            >
              <Trash2 size={16} />
            </button>
          </div>
        ))}
      </div>

      <div className="mt-8 flex flex-col items-end gap-2">
        <div className="flex w-full max-w-xs justify-between text-sm text-muted sm:w-64">
          <span>Livraison</span>
          <span className="text-foreground">Gratuite</span>
        </div>
        <div className="flex w-full max-w-xs justify-between text-base font-semibold sm:w-64">
          <span>Total</span>
          <span>{formatMAD(totalPrice)}</span>
        </div>
        <Link
          href="/checkout"
          className="mt-4 w-full max-w-xs rounded-full bg-foreground px-6 py-3.5 text-center text-sm font-medium text-white transition-opacity hover:opacity-90 sm:w-64"
        >
          Passer la commande
        </Link>
      </div>
    </div>
  );
}

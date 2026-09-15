"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useCartStore } from "@/lib/cart-store";
import { formatMAD } from "@/lib/format";
import { useHasMounted } from "@/lib/use-has-mounted";

export default function CheckoutPage() {
  const mounted = useHasMounted();
  const router = useRouter();
  const lines = useCartStore((s) => s.lines);
  const totalPrice = useCartStore((s) => s.totalPrice());
  const clear = useCartStore((s) => s.clear);

  const [form, setForm] = useState({
    customerName: "",
    phone: "",
    city: "",
    address: "",
    notes: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  if (!mounted) return null;

  if (lines.length === 0) {
    return (
      <div className="mx-auto max-w-xl px-4 py-24 text-center sm:px-6">
        <h1 className="font-display text-3xl uppercase tracking-wide">
          Votre panier est vide
        </h1>
        <Link
          href="/shop/all"
          className="mt-6 inline-block rounded-full bg-foreground px-6 py-3 text-sm font-medium text-white"
        >
          Voir la boutique
        </Link>
      </div>
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          items: lines.map((l) => ({ productId: l.productId, quantity: l.quantity })),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Une erreur est survenue.");
        setSubmitting(false);
        return;
      }

      clear();
      if (data.whatsappLink) {
        window.open(data.whatsappLink, "_blank", "noopener,noreferrer");
      }
      router.push(`/order/${data.orderId}`);
    } catch {
      setError("Impossible de contacter le serveur. Réessayez.");
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <h1 className="font-display text-3xl uppercase tracking-wide">Commande</h1>
      <p className="mt-2 text-sm text-muted">
        Paiement à la livraison (COD) uniquement · Livraison gratuite partout au Maroc.
      </p>

      <div className="mt-8 grid gap-10 md:grid-cols-2">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium">Nom complet</label>
            <input
              required
              value={form.customerName}
              onChange={(e) => setForm({ ...form, customerName: e.target.value })}
              className="w-full rounded-lg border border-border bg-surface px-4 py-2.5 text-sm outline-none focus:border-foreground"
              placeholder="Votre nom"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">Téléphone</label>
            <input
              required
              type="tel"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              className="w-full rounded-lg border border-border bg-surface px-4 py-2.5 text-sm outline-none focus:border-foreground"
              placeholder="06 12 34 56 78"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">Ville</label>
            <input
              required
              value={form.city}
              onChange={(e) => setForm({ ...form, city: e.target.value })}
              className="w-full rounded-lg border border-border bg-surface px-4 py-2.5 text-sm outline-none focus:border-foreground"
              placeholder="Casablanca, Rabat, Marrakech..."
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">Adresse de livraison</label>
            <textarea
              required
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
              className="w-full rounded-lg border border-border bg-surface px-4 py-2.5 text-sm outline-none focus:border-foreground"
              rows={3}
              placeholder="Quartier, rue, numéro..."
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">
              Note de commande <span className="text-muted">(optionnel)</span>
            </label>
            <textarea
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              className="w-full rounded-lg border border-border bg-surface px-4 py-2.5 text-sm outline-none focus:border-foreground"
              rows={2}
              placeholder="Instructions particulières..."
            />
          </div>

          <div className="rounded-lg border border-border bg-surface p-4 text-sm">
            <p className="font-medium">Paiement à la livraison</p>
            <p className="mt-1 text-muted">
              Vous payez en espèces au livreur à la réception de votre colis.
            </p>
          </div>

          {error && (
            <p className="rounded-lg bg-red-50 px-4 py-2.5 text-sm text-red-700">{error}</p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-full bg-foreground px-6 py-3.5 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            {submitting ? "Confirmation en cours..." : `Confirmer la commande — ${formatMAD(totalPrice)}`}
          </button>
        </form>

        <div className="h-fit rounded-xl border border-border bg-surface p-5">
          <h2 className="font-display text-lg uppercase tracking-wide">Résumé</h2>
          <div className="mt-4 space-y-3">
            {lines.map((l) => (
              <div key={l.productId} className="flex justify-between text-sm">
                <span className="text-muted">
                  {l.name} <span className="text-foreground">× {l.quantity}</span>
                </span>
                <span className="font-medium">{formatMAD(l.price * l.quantity)}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 border-t border-border pt-4 space-y-2 text-sm">
            <div className="flex justify-between text-muted">
              <span>Livraison</span>
              <span className="text-foreground">Gratuite</span>
            </div>
            <div className="flex justify-between text-base font-semibold">
              <span>Total</span>
              <span>{formatMAD(totalPrice)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

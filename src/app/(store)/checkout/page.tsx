"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Banknote } from "lucide-react";
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
          Your Cart is Empty
        </h1>
        <Link
          href="/shop/all"
          className="mt-6 inline-flex min-h-12 items-center rounded-full bg-foreground px-6 text-sm font-medium text-white"
        >
          Shop All
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
        setError(data.error || "Something went wrong.");
        setSubmitting(false);
        return;
      }

      clear();
      if (data.whatsappLink) {
        window.open(data.whatsappLink, "_blank", "noopener,noreferrer");
      }
      router.push(`/order/${data.orderId}`);
    } catch {
      setError("Could not reach the server. Please try again.");
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 sm:py-10">
      <h1 className="font-display text-2xl uppercase tracking-wide sm:text-3xl">Checkout</h1>

      <div className="mt-4 flex items-center gap-3 rounded-xl border border-accent/25 bg-accent/[0.06] p-4">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent text-accent-ink">
          <Banknote size={18} />
        </span>
        <div>
          <p className="text-sm font-semibold text-foreground">Cash on Delivery</p>
          <p className="text-xs text-muted">Pay only when you receive your order — no card, no online payment.</p>
        </div>
      </div>

      <div className="mt-6 grid gap-8 md:grid-cols-2 md:gap-10">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="ck-name" className="mb-1 block text-sm font-medium">Full name</label>
            <input
              id="ck-name"
              required
              autoComplete="name"
              value={form.customerName}
              onChange={(e) => setForm({ ...form, customerName: e.target.value })}
              className="flex h-12 w-full rounded-lg border border-border bg-surface px-4 text-sm outline-none focus:border-foreground"
              placeholder="Your name"
            />
          </div>

          <div>
            <label htmlFor="ck-phone" className="mb-1 block text-sm font-medium">Phone number</label>
            <input
              id="ck-phone"
              required
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              className="flex h-12 w-full rounded-lg border border-border bg-surface px-4 text-sm outline-none focus:border-foreground"
              placeholder="06 12 34 56 78"
            />
          </div>

          <div>
            <label htmlFor="ck-city" className="mb-1 block text-sm font-medium">City</label>
            <input
              id="ck-city"
              required
              autoComplete="address-level2"
              value={form.city}
              onChange={(e) => setForm({ ...form, city: e.target.value })}
              className="flex h-12 w-full rounded-lg border border-border bg-surface px-4 text-sm outline-none focus:border-foreground"
              placeholder="Casablanca, Rabat, Marrakech..."
            />
          </div>

          <div>
            <label htmlFor="ck-address" className="mb-1 block text-sm font-medium">Delivery address</label>
            <textarea
              id="ck-address"
              required
              autoComplete="street-address"
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
              className="w-full rounded-lg border border-border bg-surface px-4 py-3 text-sm outline-none focus:border-foreground"
              rows={3}
              placeholder="Neighborhood, street, building number..."
            />
          </div>

          <div>
            <label htmlFor="ck-notes" className="mb-1 block text-sm font-medium">
              Order notes <span className="font-normal text-muted">(optional)</span>
            </label>
            <textarea
              id="ck-notes"
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              className="w-full rounded-lg border border-border bg-surface px-4 py-3 text-sm outline-none focus:border-foreground"
              rows={2}
              placeholder="Delivery instructions, preferred time, etc."
            />
          </div>

          {error && (
            <p className="rounded-lg bg-red-50 px-4 py-2.5 text-sm text-red-700">{error}</p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="flex min-h-12 w-full items-center justify-center rounded-full bg-foreground px-6 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            {submitting ? "Placing order..." : `Place Order (COD) — ${formatMAD(totalPrice)}`}
          </button>
          <p className="text-center text-xs text-muted">
            100% Cash on Delivery — no online payment required.
          </p>
        </form>

        <div className="h-fit rounded-xl border border-border bg-surface p-5">
          <h2 className="font-display text-lg uppercase tracking-wide">Order Summary</h2>
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
              <span>Shipping</span>
              <span className="text-foreground">Free</span>
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

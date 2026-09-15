"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { formatMAD } from "@/lib/format";
import { OrderStatusTimeline } from "@/components/OrderStatusTimeline";

type TrackResult = {
  orderNumber: string;
  status: string;
  city: string;
  total: number;
  createdAt: string;
  items: { name: string; quantity: number; price: number }[];
  carrierName: string | null;
  carrierTrackingId: string | null;
  carrierTrackingUrl: string | null;
};

function TrackForm() {
  const searchParams = useSearchParams();
  const [orderNumber, setOrderNumber] = useState(searchParams.get("order") ?? "");
  const [phone, setPhone] = useState(searchParams.get("phone") ?? "");
  const [result, setResult] = useState<TrackResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setResult(null);
    setLoading(true);

    try {
      const res = await fetch("/api/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderNumber, phone }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Order not found");
        setLoading(false);
        return;
      }
      setResult(data);
    } catch {
      setError("Could not reach the server. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-lg px-4 py-12 sm:px-6 sm:py-16">
      <h1 className="font-display text-2xl uppercase tracking-wide text-center sm:text-3xl">
        Track Your Order
      </h1>
      <p className="mt-2 text-center text-sm text-muted">
        Enter your order number and phone number to see where your package is.
      </p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-4">
        <div>
          <label htmlFor="tr-order" className="mb-1 block text-sm font-medium">Order number</label>
          <input
            id="tr-order"
            required
            value={orderNumber}
            onChange={(e) => setOrderNumber(e.target.value)}
            placeholder="CLF-000123"
            className="flex h-12 w-full rounded-lg border border-border bg-surface px-4 text-sm outline-none focus:border-foreground"
          />
        </div>
        <div>
          <label htmlFor="tr-phone" className="mb-1 block text-sm font-medium">Phone number</label>
          <input
            id="tr-phone"
            required
            type="tel"
            inputMode="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="06 12 34 56 78"
            className="flex h-12 w-full rounded-lg border border-border bg-surface px-4 text-sm outline-none focus:border-foreground"
          />
        </div>

        {error && (
          <p className="rounded-lg bg-red-50 px-4 py-2.5 text-sm text-red-700">{error}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="flex min-h-12 w-full items-center justify-center rounded-full bg-foreground px-6 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          {loading ? "Searching..." : "Track Order"}
        </button>
      </form>

      {result && (
        <div className="mt-8 space-y-6 rounded-xl border border-border bg-surface p-6">
          <div className="text-center">
            <p className="text-xs uppercase tracking-wide text-muted">Order</p>
            <p className="font-display text-xl tracking-wide">{result.orderNumber}</p>
          </div>

          <OrderStatusTimeline status={result.status} />

          {result.carrierTrackingId && (
            <div className="rounded-lg border border-border bg-background p-4 text-sm">
              <p>
                <span className="text-muted">Carrier:</span> {result.carrierName}
              </p>
              <p className="mt-1">
                <span className="text-muted">Tracking number:</span> {result.carrierTrackingId}
              </p>
              {result.carrierTrackingUrl && (
                <a
                  href={result.carrierTrackingUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 inline-block text-foreground underline"
                >
                  Track package with {result.carrierName}
                </a>
              )}
            </div>
          )}

          <div className="border-t border-border pt-4 space-y-2">
            {result.items.map((item, i) => (
              <div key={i} className="flex justify-between text-sm">
                <span className="text-muted">
                  {item.name} <span className="text-foreground">× {item.quantity}</span>
                </span>
                <span className="font-medium">{formatMAD(item.price * item.quantity)}</span>
              </div>
            ))}
            <div className="flex justify-between border-t border-border pt-3 text-base font-semibold">
              <span>Total</span>
              <span>{formatMAD(result.total)}</span>
            </div>
          </div>

          <p className="text-center text-xs text-muted">Delivering to {result.city}</p>
        </div>
      )}
    </div>
  );
}

export default function TrackPage() {
  return (
    <Suspense>
      <TrackForm />
    </Suspense>
  );
}

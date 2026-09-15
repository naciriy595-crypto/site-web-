"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Truck, ExternalLink } from "lucide-react";

export function CarrierPanel({
  orderId,
  carrierName,
  carrierTrackingId,
  carrierLabelUrl,
  trackingUrl,
}: {
  orderId: string;
  carrierName: string | null;
  carrierTrackingId: string | null;
  carrierLabelUrl: string | null;
  trackingUrl: string | null;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [manualOpen, setManualOpen] = useState(false);
  const [manualCarrier, setManualCarrier] = useState("Ameex");
  const [manualTrackingId, setManualTrackingId] = useState("");

  async function sendToAmeex() {
    setLoading(true);
    setError(null);
    const res = await fetch(`/api/admin/orders/${orderId}/ship`, { method: "POST" });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) {
      setError(data.error || "Échec de l'envoi");
      if (data.notConfigured) setManualOpen(true);
      return;
    }
    router.refresh();
  }

  async function saveManual(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const res = await fetch(`/api/admin/orders/${orderId}/ship`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ carrierName: manualCarrier, carrierTrackingId: manualTrackingId }),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) {
      setError(data.error || "Échec de l'enregistrement");
      return;
    }
    setManualOpen(false);
    router.refresh();
  }

  if (carrierTrackingId) {
    return (
      <div className="rounded-xl border border-border bg-surface p-5">
        <h2 className="font-display text-lg uppercase tracking-wide">Transporteur</h2>
        <div className="mt-3 space-y-1 text-sm">
          <p><span className="text-muted">Transporteur :</span> {carrierName}</p>
          <p><span className="text-muted">N° de suivi :</span> {carrierTrackingId}</p>
        </div>
        <div className="mt-4 flex flex-wrap gap-3">
          {trackingUrl && (
            <a
              href={trackingUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm text-foreground hover:underline"
            >
              Suivre chez {carrierName} <ExternalLink size={14} />
            </a>
          )}
          {carrierLabelUrl && (
            <a
              href={carrierLabelUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm text-foreground hover:underline"
            >
              Bordereau d&apos;expédition <ExternalLink size={14} />
            </a>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-border bg-surface p-5">
      <h2 className="font-display text-lg uppercase tracking-wide">Transporteur</h2>
      <p className="mt-1 text-sm text-muted">Aucun envoi enregistré pour cette commande.</p>

      <div className="mt-4 flex flex-wrap gap-3">
        <button
          onClick={sendToAmeex}
          disabled={loading}
          className="inline-flex items-center gap-2 rounded-full bg-foreground px-4 py-2.5 text-sm font-medium text-white hover:opacity-90 disabled:opacity-50"
        >
          <Truck size={16} /> Envoyer à Ameex
        </button>
        <button
          onClick={() => setManualOpen((v) => !v)}
          className="rounded-full border border-border px-4 py-2.5 text-sm font-medium hover:border-foreground/40"
        >
          Ajouter un n° de suivi manuellement
        </button>
      </div>

      {error && <p className="mt-3 rounded-lg bg-red-50 px-4 py-2.5 text-sm text-red-700">{error}</p>}

      {manualOpen && (
        <form onSubmit={saveManual} className="mt-4 space-y-3 border-t border-border pt-4">
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs font-medium text-muted">Transporteur</label>
              <input
                required
                value={manualCarrier}
                onChange={(e) => setManualCarrier(e.target.value)}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-foreground"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-muted">N° de suivi</label>
              <input
                required
                value={manualTrackingId}
                onChange={(e) => setManualTrackingId(e.target.value)}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-foreground"
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="rounded-full bg-foreground px-4 py-2 text-sm font-medium text-white hover:opacity-90 disabled:opacity-50"
          >
            Enregistrer
          </button>
        </form>
      )}
    </div>
  );
}

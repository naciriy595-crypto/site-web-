"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const statuses = [
  { value: "NEW", label: "Nouvelle" },
  { value: "PROCESSING", label: "En traitement" },
  { value: "SHIPPED", label: "Expédiée" },
  { value: "DELIVERED", label: "Livrée" },
  { value: "CANCELLED", label: "Annulée" },
];

export function OrderStatusSelect({ orderId, status }: { orderId: string; status: string }) {
  const router = useRouter();
  const [current, setCurrent] = useState(status);
  const [loading, setLoading] = useState(false);

  async function handleChange(value: string) {
    setCurrent(value);
    setLoading(true);
    await fetch(`/api/admin/orders/${orderId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: value }),
    });
    setLoading(false);
    router.refresh();
  }

  return (
    <select
      value={current}
      disabled={loading}
      onChange={(e) => handleChange(e.target.value)}
      className="rounded-full border border-border bg-surface px-3 py-1.5 text-xs font-medium disabled:opacity-50"
    >
      {statuses.map((s) => (
        <option key={s.value} value={s.value}>
          {s.label}
        </option>
      ))}
    </select>
  );
}

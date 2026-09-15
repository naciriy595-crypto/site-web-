import type { Prisma } from "@prisma/client";

const ORDER_COUNTER_KEY = "order";

export function formatOrderNumber(n: number): string {
  return `CLF-${String(n).padStart(6, "0")}`;
}

export function parseOrderNumber(value: string): number | null {
  const match = value.trim().toUpperCase().match(/^(?:CLF-)?0*(\d+)$/);
  if (!match) return null;
  const n = Number(match[1]);
  return Number.isInteger(n) && n > 0 ? n : null;
}

export async function nextOrderNumber(tx: Prisma.TransactionClient): Promise<number> {
  const counter = await tx.counter.upsert({
    where: { key: ORDER_COUNTER_KEY },
    create: { key: ORDER_COUNTER_KEY, value: 1 },
    update: { value: { increment: 1 } },
  });
  return counter.value;
}

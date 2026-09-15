export function formatOrderNumber(n: number): string {
  return `CLF-${String(n).padStart(6, "0")}`;
}

export function parseOrderNumber(value: string): number | null {
  const match = value.trim().toUpperCase().match(/^(?:CLF-)?0*(\d+)$/);
  if (!match) return null;
  const n = Number(match[1]);
  return Number.isInteger(n) && n > 0 ? n : null;
}

import { Truck, ShieldCheck, Banknote } from "lucide-react";

const badges = [
  {
    icon: Truck,
    title: "Free Shipping",
    desc: "Nationwide, no exceptions",
  },
  {
    icon: Banknote,
    title: "Cash on Delivery",
    desc: "Pay in cash when it arrives",
  },
  {
    icon: ShieldCheck,
    title: "Quality Guaranteed",
    desc: "Selected materials, quality checked",
  },
];

export function TrustBadges() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      {badges.map((b) => (
        <div
          key={b.title}
          className="flex items-center gap-3 rounded-xl border border-border bg-surface p-4"
        >
          <b.icon size={22} className="shrink-0 text-foreground" />
          <div>
            <p className="text-sm font-medium text-foreground">{b.title}</p>
            <p className="text-xs text-muted">{b.desc}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

import Link from "next/link";

const categoryIcons: Record<string, string> = {
  watches: "⏱",
  sunglasses: "🕶",
  wallets: "👛",
  jewelry: "💍",
  accessories: "✦",
};

export function CategoryGrid({
  categories,
}: {
  categories: { slug: string; name: string }[];
}) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">
      {categories.map((c) => (
        <Link
          key={c.slug}
          href={`/shop/${c.slug}`}
          className="group flex min-h-24 flex-col items-center justify-center gap-2 rounded-xl border border-border bg-surface px-4 py-8 text-center transition-colors hover:border-foreground/40"
        >
          <span className="text-2xl grayscale opacity-80 transition-opacity group-hover:opacity-100">
            {categoryIcons[c.slug] ?? "✦"}
          </span>
          <span className="font-display uppercase tracking-wide text-foreground">
            {c.name}
          </span>
        </Link>
      ))}
    </div>
  );
}

import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { ProductCard } from "@/components/ProductCard";
import { groupProducts } from "@/lib/variants";

export const metadata: Metadata = {
  title: "Search",
};

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q = "" } = await searchParams;
  const query = q.trim();

  const products = query
    ? await prisma.product.findMany({
        where: {
          OR: [
            { name: { contains: query, mode: "insensitive" } },
            { shortDesc: { contains: query, mode: "insensitive" } },
            { description: { contains: query, mode: "insensitive" } },
          ],
        },
        orderBy: { createdAt: "desc" },
      })
    : [];

  const grouped = groupProducts(products);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <h1 className="font-display text-3xl uppercase tracking-wide">Search</h1>
      <p className="mt-2 text-sm text-muted">
        {query ? (
          <>
            {grouped.length} result{grouped.length === 1 ? "" : "s"} for{" "}
            <span className="font-medium text-foreground">&ldquo;{query}&rdquo;</span>
          </>
        ) : (
          "Enter a search term to find products."
        )}
      </p>

      {query && grouped.length === 0 && (
        <p className="py-16 text-center text-muted">
          No products matched your search. Try a different term.
        </p>
      )}

      {grouped.length > 0 && (
        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
          {grouped.map((g) => (
            <ProductCard key={g.key} product={g} />
          ))}
        </div>
      )}
    </div>
  );
}

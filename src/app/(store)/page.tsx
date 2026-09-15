import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { ProductCard } from "@/components/ProductCard";
import { CategoryGrid } from "@/components/CategoryGrid";
import { TrustBadges } from "@/components/TrustBadges";
import { groupProducts } from "@/lib/variants";

// Belt-and-suspenders: (store)/layout.tsx already forces dynamic rendering
// for this whole route group, but the homepage has no dynamic segment of
// its own, so it's the one most likely to get statically prerendered again
// if the layout-level setting is ever changed.
export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [bestSellers, categories, newest] = await Promise.all([
    prisma.product.findMany({
      where: { featured: true },
      take: 8,
      orderBy: { createdAt: "desc" },
    }),
    prisma.category.findMany({ orderBy: { name: "asc" } }),
    prisma.product.findMany({ take: 8, orderBy: { createdAt: "desc" } }),
  ]);

  const bestSellerGroups = groupProducts(bestSellers);
  const bestSellerGroupKeys = new Set(bestSellerGroups.map((g) => g.key));
  const newArrivalGroups = groupProducts(
    newest.filter((p) => !bestSellerGroupKeys.has(p.variantGroup || p.id))
  ).slice(0, 4);

  return (
    <div>
      <section className="relative overflow-hidden border-b border-border bg-gradient-to-b from-surface to-background">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-5 px-4 py-14 text-center sm:gap-6 sm:px-6 sm:py-24">
          <span className="text-xs font-medium uppercase tracking-[0.3em] text-muted">
            Gothic streetwear-luxe
          </span>
          <Image
            src="/brand/logo-wordmark.webp"
            alt="Clifstone"
            width={815}
            height={345}
            priority
            className="h-16 w-auto rounded-lg sm:h-24"
          />
          <p className="max-w-xl text-balance text-sm text-muted sm:text-base">
            Watches, sunglasses, leather goods and jewelry with a chrome
            finish. Cash on delivery, free shipping everywhere.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-1">
            <Link
              href="/shop/all"
              className="flex min-h-12 items-center rounded-full bg-foreground px-6 text-sm font-medium text-white transition-opacity hover:opacity-90"
            >
              Shop the collection
            </Link>
            <a
              href="https://instagram.com/clifstone.co"
              target="_blank"
              rel="noopener noreferrer"
              className="flex min-h-12 items-center rounded-full border border-border px-6 text-sm font-medium text-foreground transition-colors hover:border-foreground/40"
            >
              Follow on Instagram
            </a>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <section className="py-10 sm:py-14">
          <TrustBadges />
        </section>

        <section className="py-6">
          <div className="mb-6 flex items-end justify-between">
            <h2 className="font-display text-2xl uppercase tracking-wide">
              Categories
            </h2>
          </div>
          <CategoryGrid categories={categories} />
        </section>

        {bestSellerGroups.length > 0 && (
          <section className="py-12 sm:py-14">
            <div className="mb-6 flex items-end justify-between">
              <div>
                <h2 className="font-display text-2xl uppercase tracking-wide">
                  Best Sellers
                </h2>
                <p className="mt-1 text-sm text-muted">Our most popular pieces</p>
              </div>
              <Link href="/shop/all" className="text-sm text-muted hover:text-foreground">
                View all
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
              {bestSellerGroups.map((g) => (
                <ProductCard key={g.key} product={g} />
              ))}
            </div>
          </section>
        )}

        {newArrivalGroups.length > 0 && (
          <section className="py-12 sm:py-14">
            <div className="mb-6 flex items-end justify-between">
              <h2 className="font-display text-2xl uppercase tracking-wide">
                New Arrivals
              </h2>
              <Link href="/shop/all" className="text-sm text-muted hover:text-foreground">
                View all
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
              {newArrivalGroups.map((g) => (
                <ProductCard key={g.key} product={g} />
              ))}
            </div>
          </section>
        )}
      </div>

      <section className="border-t border-border bg-surface">
        <div className="mx-auto max-w-3xl px-4 py-14 text-center sm:px-6 sm:py-16">
          <h2 className="font-display text-2xl uppercase tracking-wide">
            Our Story
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-muted sm:text-base">
            Born in Morocco, Clifstone dresses a generation that refuses to
            choose between street and refinement. Every piece is designed in
            a chrome-and-black palette, minimalist, built to last beyond
            trends — worn just as well in the city as on a night out.
          </p>
          <Link
            href="/about"
            className="mt-5 inline-block text-sm font-medium underline underline-offset-4 hover:text-foreground"
          >
            Read our full story
          </Link>
        </div>
      </section>
    </div>
  );
}

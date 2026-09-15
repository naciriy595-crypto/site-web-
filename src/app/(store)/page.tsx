import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { ProductCard } from "@/components/ProductCard";
import { CategoryGrid } from "@/components/CategoryGrid";
import { TrustBadges } from "@/components/TrustBadges";

export default async function HomePage() {
  const [featured, categories] = await Promise.all([
    prisma.product.findMany({
      where: { featured: true },
      take: 8,
      orderBy: { createdAt: "desc" },
    }),
    prisma.category.findMany({ orderBy: { nameFr: "asc" } }),
  ]);

  const products = featured.length
    ? featured
    : await prisma.product.findMany({ take: 8, orderBy: { createdAt: "desc" } });

  return (
    <div>
      <section className="relative overflow-hidden border-b border-border bg-gradient-to-b from-surface to-background">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-6 px-4 py-20 text-center sm:px-6 sm:py-28">
          <span className="text-xs font-medium uppercase tracking-[0.3em] text-muted">
            Gothic streetwear-luxe · Maroc
          </span>
          <h1 className="font-display chrome-text text-6xl uppercase leading-none sm:text-8xl">
            Clifstone
          </h1>
          <p className="max-w-xl text-balance text-sm text-muted sm:text-base">
            Montres, lunettes, maroquinerie et bijoux minimalistes au fini
            chrome. Paiement à la livraison, livraison gratuite partout au
            Maroc.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Link
              href="/shop/watches"
              className="rounded-full bg-foreground px-6 py-3 text-sm font-medium text-white transition-opacity hover:opacity-90"
            >
              Découvrir la collection
            </Link>
            <a
              href="https://instagram.com/clifstone.co"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full border border-border px-6 py-3 text-sm font-medium text-foreground transition-colors hover:border-foreground/40"
            >
              Suivre sur Instagram
            </a>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <TrustBadges />
      </section>

      <section className="mx-auto max-w-6xl px-4 py-6 sm:px-6">
        <div className="mb-6 flex items-end justify-between">
          <h2 className="font-display text-2xl uppercase tracking-wide">
            Catégories
          </h2>
        </div>
        <CategoryGrid categories={categories} />
      </section>

      <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <div className="mb-6 flex items-end justify-between">
          <h2 className="font-display text-2xl uppercase tracking-wide">
            Sélection Clifstone
          </h2>
          <Link href="/shop/watches" className="text-sm text-muted hover:text-foreground">
            Voir tout
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      <section className="border-t border-border bg-surface">
        <div className="mx-auto max-w-3xl px-4 py-16 text-center sm:px-6">
          <h2 className="font-display text-2xl uppercase tracking-wide">
            Notre histoire
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-muted sm:text-base">
            Née au Maroc, Clifstone habille une génération qui refuse de
            choisir entre rue et raffinement. Chaque pièce est pensée dans une
            palette chrome et noire, minimaliste, pour durer au-delà des
            tendances — et se porter aussi bien en ville qu&apos;en soirée.
          </p>
        </div>
      </section>
    </div>
  );
}

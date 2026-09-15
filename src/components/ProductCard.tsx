"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { formatMAD } from "@/lib/format";
import { colorHex } from "@/lib/colors";
import { WishlistButton } from "@/components/WishlistButton";
import type { GroupedProduct } from "@/lib/variants";

export function ProductCard({ product }: { product: GroupedProduct }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const active = product.variants[activeIndex];

  return (
    <div className="group relative">
      <Link href={`/product/${active.slug}`} className="block">
        <div className="relative aspect-square overflow-hidden rounded-xl border border-border bg-surface">
          {active.image && (
            <Image
              src={active.image}
              alt={`${product.baseName}${
                active.color !== "Default" ? ` — ${active.color}` : ""
              }`}
              fill
              loading="lazy"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            />
          )}
          <div className="absolute left-2 top-2 flex flex-col items-start gap-1">
            {active.stockStatus === "OUT_OF_STOCK" && (
              <span className="rounded-full bg-foreground px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-white">
                Out of Stock
              </span>
            )}
            {active.compareAtPrice && active.compareAtPrice > active.price && (
              <span className="rounded-full bg-accent px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-accent-ink">
                Sale
              </span>
            )}
          </div>
        </div>
        <div className="mt-3 space-y-0.5">
          <h3 className="text-sm font-medium text-foreground">{product.baseName}</h3>
          <p className="line-clamp-1 text-xs text-muted">{product.shortDesc}</p>
          <div className="flex items-center gap-2 pt-1">
            <span className="text-sm font-semibold text-foreground">
              {formatMAD(active.price)}
            </span>
            {active.compareAtPrice && active.compareAtPrice > active.price && (
              <span className="text-xs text-muted line-through">
                {formatMAD(active.compareAtPrice)}
              </span>
            )}
          </div>
        </div>
      </Link>

      {product.variants.length > 1 && (
        <div className="mt-2 flex flex-wrap items-center gap-1.5">
          {product.variants.map((v, i) => (
            <button
              key={v.slug}
              type="button"
              title={v.color}
              aria-label={`View ${v.color} color`}
              onClick={() => setActiveIndex(i)}
              className={`h-5 w-5 rounded-full border-2 transition-colors ${
                i === activeIndex ? "border-foreground" : "border-border hover:border-foreground/40"
              }`}
              style={{ backgroundColor: colorHex(v.color) }}
            />
          ))}
        </div>
      )}

      <WishlistButton
        productId={active.id}
        slug={active.slug}
        name={product.baseName}
        price={active.price}
        image={active.image}
        size={16}
        className="absolute right-2 top-2 flex h-9 w-9 items-center justify-center rounded-full border border-border bg-surface/90 backdrop-blur transition-colors hover:border-foreground/40"
      />
    </div>
  );
}

import Link from "next/link";
import Image from "next/image";
import { formatMAD } from "@/lib/format";
import { parseImages } from "@/lib/types";

export function ProductCard({
  product,
}: {
  product: {
    slug: string;
    name: string;
    shortDesc: string;
    price: number;
    compareAtPrice?: number | null;
    images: string;
    stockStatus: string;
  };
}) {
  const images = parseImages(product.images);
  const image = images[0];

  return (
    <Link
      href={`/product/${product.slug}`}
      className="group block"
    >
      <div className="relative aspect-square overflow-hidden rounded-xl border border-border bg-surface">
        {image && (
          <Image
            src={image}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
        )}
        {product.stockStatus === "OUT_OF_STOCK" && (
          <span className="absolute left-2 top-2 rounded-full bg-foreground px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-white">
            Rupture de stock
          </span>
        )}
        {product.compareAtPrice && product.compareAtPrice > product.price && (
          <span className="absolute right-2 top-2 rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-foreground border border-border">
            Promo
          </span>
        )}
      </div>
      <div className="mt-3 space-y-0.5">
        <h3 className="text-sm font-medium text-foreground">{product.name}</h3>
        <p className="line-clamp-1 text-xs text-muted">{product.shortDesc}</p>
        <div className="flex items-center gap-2 pt-1">
          <span className="text-sm font-semibold text-foreground">
            {formatMAD(product.price)}
          </span>
          {product.compareAtPrice && product.compareAtPrice > product.price && (
            <span className="text-xs text-muted line-through">
              {formatMAD(product.compareAtPrice)}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}

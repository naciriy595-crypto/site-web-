import Link from "next/link";
import Image from "next/image";
import { formatMAD } from "@/lib/format";
import { parseImages } from "@/lib/types";
import { WishlistButton } from "@/components/WishlistButton";

export function ProductCard({
  product,
}: {
  product: {
    id: string;
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
    <div className="group relative">
      <Link href={`/product/${product.slug}`} className="block">
        <div className="relative aspect-square overflow-hidden rounded-xl border border-border bg-surface">
          {image && (
            <Image
              src={image}
              alt={product.name}
              fill
              loading="lazy"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            />
          )}
          <div className="absolute left-2 top-2 flex flex-col items-start gap-1">
            {product.stockStatus === "OUT_OF_STOCK" && (
              <span className="rounded-full bg-foreground px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-white">
                Out of Stock
              </span>
            )}
            {product.compareAtPrice && product.compareAtPrice > product.price && (
              <span className="rounded-full bg-accent px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-accent-ink">
                Sale
              </span>
            )}
          </div>
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
      <WishlistButton
        productId={product.id}
        slug={product.slug}
        name={product.name}
        price={product.price}
        image={image ?? ""}
        size={16}
        className="absolute right-2 top-2 flex h-9 w-9 items-center justify-center rounded-full border border-border bg-surface/90 backdrop-blur transition-colors hover:border-foreground/40"
      />
    </div>
  );
}

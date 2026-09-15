"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Category = { id: string; name: string };

type InitialProduct = {
  id?: string;
  name: string;
  slug: string;
  shortDesc: string;
  description: string;
  price: number;
  compareAtPrice?: number | null;
  categoryId: string;
  images: string[];
  stockStatus: "IN_STOCK" | "OUT_OF_STOCK";
  featured: boolean;
  metaTitle?: string | null;
  metaDesc?: string | null;
};

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function ProductForm({
  categories,
  initial,
}: {
  categories: Category[];
  initial?: InitialProduct;
}) {
  const router = useRouter();
  const isEdit = Boolean(initial?.id);

  const [name, setName] = useState(initial?.name ?? "");
  const [slug, setSlug] = useState(initial?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(isEdit);
  const [shortDesc, setShortDesc] = useState(initial?.shortDesc ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [price, setPrice] = useState(String(initial?.price ?? ""));
  const [compareAtPrice, setCompareAtPrice] = useState(
    initial?.compareAtPrice ? String(initial.compareAtPrice) : ""
  );
  const [categoryId, setCategoryId] = useState(initial?.categoryId ?? categories[0]?.id ?? "");
  const [images, setImages] = useState((initial?.images ?? []).join("\n"));
  const [stockStatus, setStockStatus] = useState(initial?.stockStatus ?? "IN_STOCK");
  const [featured, setFeatured] = useState(initial?.featured ?? false);
  const [metaTitle, setMetaTitle] = useState(initial?.metaTitle ?? "");
  const [metaDesc, setMetaDesc] = useState(initial?.metaDesc ?? "");

  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    const payload = {
      name,
      slug,
      shortDesc,
      description,
      price: Number(price),
      compareAtPrice: compareAtPrice ? Number(compareAtPrice) : null,
      categoryId,
      images: images.split("\n").map((s) => s.trim()).filter(Boolean),
      stockStatus,
      featured,
      metaTitle,
      metaDesc,
    };

    const res = await fetch(
      isEdit ? `/api/admin/products/${initial!.id}` : "/api/admin/products",
      {
        method: isEdit ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }
    );

    const data = await res.json();

    if (!res.ok) {
      setError(data.error || "Something went wrong.");
      setSubmitting(false);
      return;
    }

    router.push("/admin/products");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl space-y-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium">Name</label>
          <input
            required
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              if (!slugTouched) setSlug(slugify(e.target.value));
            }}
            className="flex h-11 w-full rounded-lg border border-border bg-surface px-4 text-sm outline-none focus:border-foreground"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Slug (URL)</label>
          <input
            required
            value={slug}
            onChange={(e) => {
              setSlug(e.target.value);
              setSlugTouched(true);
            }}
            className="flex h-11 w-full rounded-lg border border-border bg-surface px-4 text-sm outline-none focus:border-foreground"
          />
        </div>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">Short description</label>
        <input
          required
          value={shortDesc}
          onChange={(e) => setShortDesc(e.target.value)}
          maxLength={200}
          className="flex h-11 w-full rounded-lg border border-border bg-surface px-4 text-sm outline-none focus:border-foreground"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">Full description</label>
        <textarea
          required
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={5}
          className="w-full rounded-lg border border-border bg-surface px-4 py-2.5 text-sm outline-none focus:border-foreground"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div>
          <label className="mb-1 block text-sm font-medium">Price (MAD)</label>
          <input
            required
            type="number"
            min={0}
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="flex h-11 w-full rounded-lg border border-border bg-surface px-4 text-sm outline-none focus:border-foreground"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Compare-at price (optional)</label>
          <input
            type="number"
            min={0}
            value={compareAtPrice}
            onChange={(e) => setCompareAtPrice(e.target.value)}
            className="flex h-11 w-full rounded-lg border border-border bg-surface px-4 text-sm outline-none focus:border-foreground"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Category</label>
          <select
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            className="flex h-11 w-full rounded-lg border border-border bg-surface px-4 text-sm outline-none focus:border-foreground"
          >
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">
          Images (one URL per line — e.g. /products/my-image.webp)
        </label>
        <textarea
          required
          value={images}
          onChange={(e) => setImages(e.target.value)}
          rows={3}
          className="w-full rounded-lg border border-border bg-surface px-4 py-2.5 text-sm outline-none focus:border-foreground"
          placeholder="/products/example-1.webp"
        />
      </div>

      <div className="flex flex-wrap items-center gap-6">
        <div>
          <label className="mb-1 block text-sm font-medium">Stock</label>
          <select
            value={stockStatus}
            onChange={(e) => setStockStatus(e.target.value as "IN_STOCK" | "OUT_OF_STOCK")}
            className="flex h-11 rounded-lg border border-border bg-surface px-4 text-sm outline-none focus:border-foreground"
          >
            <option value="IN_STOCK">In Stock</option>
            <option value="OUT_OF_STOCK">Out of Stock</option>
          </select>
        </div>
        <label className="mt-6 flex min-h-11 items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={featured}
            onChange={(e) => setFeatured(e.target.checked)}
            className="h-4 w-4"
          />
          Feature on homepage (Best Sellers)
        </label>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium">Meta title (SEO)</label>
          <input
            value={metaTitle}
            onChange={(e) => setMetaTitle(e.target.value)}
            className="flex h-11 w-full rounded-lg border border-border bg-surface px-4 text-sm outline-none focus:border-foreground"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Meta description (SEO)</label>
          <input
            value={metaDesc}
            onChange={(e) => setMetaDesc(e.target.value)}
            className="flex h-11 w-full rounded-lg border border-border bg-surface px-4 text-sm outline-none focus:border-foreground"
          />
        </div>
      </div>

      {error && <p className="rounded-lg bg-red-50 px-4 py-2.5 text-sm text-red-700">{error}</p>}

      <button
        type="submit"
        disabled={submitting}
        className="flex min-h-12 items-center rounded-full bg-foreground px-6 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-50"
      >
        {submitting ? "Saving..." : isEdit ? "Update Product" : "Create Product"}
      </button>
    </form>
  );
}

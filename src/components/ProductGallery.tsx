"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { ZoomIn, X, ChevronLeft, ChevronRight } from "lucide-react";

export function ProductGallery({ images, name }: { images: string[]; name: string }) {
  const [active, setActive] = useState(0);
  const [zoomed, setZoomed] = useState(false);
  const src = images[active] ?? images[0];

  useEffect(() => {
    if (!zoomed) return;
    document.body.style.overflow = "hidden";
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setZoomed(false);
      if (e.key === "ArrowRight") setActive((i) => (i + 1) % images.length);
      if (e.key === "ArrowLeft") setActive((i) => (i - 1 + images.length) % images.length);
    }
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", onKey);
    };
  }, [zoomed, images.length]);

  return (
    <div>
      <button
        type="button"
        onClick={() => setZoomed(true)}
        className="group relative block aspect-square w-full overflow-hidden rounded-2xl border border-border bg-surface"
        aria-label={`Zoom in on ${name}`}
      >
        {src && (
          <Image
            src={src}
            alt={`${name} — product photo ${active + 1}`}
            fill
            priority
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        )}
        <span className="absolute bottom-3 right-3 flex h-9 w-9 items-center justify-center rounded-full bg-surface/90 text-foreground shadow-sm backdrop-blur transition-opacity group-hover:opacity-100 sm:opacity-0">
          <ZoomIn size={16} />
        </span>
      </button>

      {images.length > 1 && (
        <div className="mt-3 flex gap-2 overflow-x-auto">
          {images.map((img, i) => (
            <button
              key={img + i}
              onClick={() => setActive(i)}
              className={`relative h-16 w-16 shrink-0 overflow-hidden rounded-lg border ${
                i === active ? "border-foreground" : "border-border"
              }`}
              aria-label={`View photo ${i + 1} of ${name}`}
            >
              <Image src={img} alt="" fill className="object-cover" sizes="64px" />
            </button>
          ))}
        </div>
      )}

      {zoomed && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4">
          <button
            onClick={() => setZoomed(false)}
            aria-label="Close zoom"
            className="absolute right-4 top-4 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20"
          >
            <X size={22} />
          </button>

          {images.length > 1 && (
            <>
              <button
                onClick={() => setActive((i) => (i - 1 + images.length) % images.length)}
                aria-label="Previous photo"
                className="absolute left-2 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 sm:left-4"
              >
                <ChevronLeft size={22} />
              </button>
              <button
                onClick={() => setActive((i) => (i + 1) % images.length)}
                aria-label="Next photo"
                className="absolute right-2 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 sm:right-4"
              >
                <ChevronRight size={22} />
              </button>
            </>
          )}

          <div className="relative h-full max-h-[85vh] w-full max-w-3xl">
            {src && (
              <Image
                src={src}
                alt={`${name} — zoomed product photo ${active + 1}`}
                fill
                className="object-contain"
                sizes="100vw"
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
}

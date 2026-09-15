import type { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
  title: "About Us",
  description: "The Clifstone story — a Moroccan gothic streetwear-luxe brand for watches, sunglasses, wallets, jewelry and accessories.",
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
      <div className="flex justify-center">
        <Image
          src="/brand/logo-wordmark.webp"
          alt="Clifstone"
          width={815}
          height={345}
          className="h-14 w-auto rounded-lg"
        />
      </div>

      <h1 className="mt-8 text-center font-display text-2xl uppercase tracking-wide sm:text-3xl">
        Our Story
      </h1>

      <div className="mt-6 space-y-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <p>
          Clifstone was born in Morocco out of a simple idea: streetwear and
          refinement don&apos;t have to be opposites. We design pieces —
          watches, sunglasses, wallets, jewelry and accessories — for people
          who want a bold look that still feels considered.
        </p>
        <p>
          Every product in our catalog is chosen for its character: sculpted
          bezels, hand-illustrated leather goods, chrome and steel finishes
          that hold up to daily wear. We keep the palette minimal — chrome,
          black, and the occasional flash of color — so pieces mix and match
          effortlessly, worn in the city or out for the night.
        </p>
        <p>
          We&apos;re a small, independent operation. Every order is packed
          and shipped with care, and we back it with cash-on-delivery
          checkout, free shipping, and a no-risk return policy: if you
          change your mind, refuse the package at the door and you won&apos;t
          pay a thing.
        </p>
        <p>
          Follow along on{" "}
          <a
            href="https://instagram.com/clifstone.co"
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-4 hover:text-foreground"
          >
            Instagram @clifstone.co
          </a>{" "}
          for new drops and behind-the-scenes looks.
        </p>
      </div>
    </div>
  );
}

import type { Metadata } from "next";
import { ShieldCheck, PackageX, MessageCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "Return Policy",
  description: "Clifstone's return policy — refuse your package at delivery with no payment obligation, or request a return within 48 hours.",
};

export default function ReturnsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
      <h1 className="font-display text-2xl uppercase tracking-wide sm:text-3xl">
        Return Policy
      </h1>
      <p className="mt-3 text-sm leading-relaxed text-muted sm:text-base">
        Because every order is Cash on Delivery, returning an item you
        haven&apos;t accepted yet is risk-free — you simply never pay for it.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-border bg-surface p-5">
          <PackageX size={20} className="text-foreground" />
          <p className="mt-3 text-sm font-semibold">Refuse at delivery</p>
          <p className="mt-1 text-xs text-muted">
            Not what you expected? Simply decline the package from the
            courier. You pay nothing — no fee, no obligation.
          </p>
        </div>
        <div className="rounded-xl border border-border bg-surface p-5">
          <MessageCircle size={20} className="text-foreground" />
          <p className="mt-3 text-sm font-semibold">48-hour window</p>
          <p className="mt-1 text-xs text-muted">
            Already accepted the order? Message us within 48 hours of
            delivery to start a return or exchange.
          </p>
        </div>
        <div className="rounded-xl border border-border bg-surface p-5">
          <ShieldCheck size={20} className="text-foreground" />
          <p className="mt-3 text-sm font-semibold">Original condition</p>
          <p className="mt-1 text-xs text-muted">
            Items must be unused, in their original packaging, to be
            eligible for return or exchange.
          </p>
        </div>
      </div>

      <div className="mt-10 space-y-5 text-sm leading-relaxed text-foreground/90">
        <h2 className="font-display text-lg uppercase tracking-wide">
          How it works
        </h2>
        <ol className="list-decimal space-y-2 pl-5">
          <li>
            <strong>Before delivery:</strong> you can refuse the package when
            the courier hands it to you. Since payment only happens at that
            moment, refusing means you owe nothing.
          </li>
          <li>
            <strong>After delivery:</strong> contact us on WhatsApp or
            Instagram within 48 hours with your order number, the reason for
            the return, and photos if the item arrived damaged or incorrect.
          </li>
          <li>
            We&apos;ll confirm the pickup or drop-off details and process your
            exchange or refund once the item is received back in its
            original condition.
          </li>
        </ol>
        <p>
          Questions about a specific order? Reach us at{" "}
          <a href="mailto:clifstone44@gmail.com" className="underline underline-offset-4">
            clifstone44@gmail.com
          </a>{" "}
          or via the contact details in the footer.
        </p>
      </div>
    </div>
  );
}

import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "FAQ",
  description: "Frequently asked questions about Clifstone orders, cash on delivery, shipping and returns.",
};

const FAQS = [
  {
    q: "How does Cash on Delivery (COD) work?",
    a: "You place your order online with no payment upfront. A courier delivers your package to the address you provided, and you pay in cash directly to the courier at that moment — nothing to pay before your order arrives.",
  },
  {
    q: "Is shipping really free?",
    a: "Yes. Shipping is free on every order, everywhere we deliver, with no minimum order value.",
  },
  {
    q: "How long does delivery take?",
    a: "Most orders arrive within 2–5 business days depending on your city. You can check your order's exact status anytime on our Track Order page using your order number and phone number.",
  },
  {
    q: "Can I refuse my package?",
    a: "Yes. Since you haven't paid anything yet, you can refuse the package when the courier arrives with no cost and no obligation. See our Return Policy page for details.",
  },
  {
    q: "Can I return or exchange an item after accepting it?",
    a: "Contact us within 48 hours of delivery on WhatsApp or Instagram with your order number and we'll walk you through the return or exchange process.",
  },
  {
    q: "How do I track my order?",
    a: "Use the Track Order page with the order number you received at checkout and the phone number you used to place the order.",
  },
  {
    q: "Do I need to create an account to order?",
    a: "No. Checkout is guest-only — just your name, phone number, delivery address and any notes for the courier.",
  },
  {
    q: "How can I contact Clifstone?",
    a: "Message us on WhatsApp or Instagram @clifstone.co, or email clifstone44@gmail.com. Contact details are also in the footer of every page.",
  },
];

export default function FaqPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
      <h1 className="font-display text-2xl uppercase tracking-wide sm:text-3xl">
        Frequently Asked Questions
      </h1>
      <p className="mt-2 text-sm text-muted">
        Everything about delivery, Cash on Delivery, and returns. Still have a question?{" "}
        <Link href="/about" className="underline underline-offset-4">
          Learn more about us
        </Link>{" "}
        or reach out — contact details are in the footer.
      </p>

      <div className="mt-8 divide-y divide-border border-y border-border">
        {FAQS.map((item) => (
          <details key={item.q} className="group py-4">
            <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-4 text-sm font-medium marker:content-none">
              {item.q}
              <span className="shrink-0 text-muted transition-transform group-open:rotate-45">+</span>
            </summary>
            <p className="mt-2 text-sm leading-relaxed text-muted">{item.a}</p>
          </details>
        ))}
      </div>
    </div>
  );
}

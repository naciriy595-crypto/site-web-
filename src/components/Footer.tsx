import Link from "next/link";
import { Mail, MessageCircle, ShieldCheck } from "lucide-react";
import { Logo } from "./Logo";
import { STORE_WHATSAPP_NUMBER } from "@/lib/whatsapp";

function InstagramIcon({ size = 16 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="2" y="2" width="20" height="20" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function Footer() {
  const whatsappHref = `https://wa.me/${STORE_WHATSAPP_NUMBER}`;
  const displayPhone = `+${STORE_WHATSAPP_NUMBER.replace(/(\d{3})(\d{3})(\d{6})/, "$1 $2 $3")}`;

  return (
    <footer className="mt-24 border-t border-border bg-surface">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="grid gap-10 sm:grid-cols-2 md:grid-cols-4">
          <div>
            <Logo className="h-8" />
            <p className="mt-3 max-w-xs text-sm text-muted">
              Gothic streetwear-luxe, Moroccan made. Watches, sunglasses,
              leather goods and jewelry built to last.
            </p>
          </div>

          <div className="text-sm">
            <h3 className="font-display uppercase tracking-wide text-foreground/90 mb-3">
              Shop
            </h3>
            <ul className="space-y-2 text-muted">
              <li><Link href="/shop/watches" className="hover:text-foreground">Watches</Link></li>
              <li><Link href="/shop/sunglasses" className="hover:text-foreground">Sunglasses</Link></li>
              <li><Link href="/shop/wallets" className="hover:text-foreground">Wallets</Link></li>
              <li><Link href="/shop/jewelry" className="hover:text-foreground">Jewelry</Link></li>
              <li><Link href="/shop/accessories" className="hover:text-foreground">Accessories</Link></li>
            </ul>
          </div>

          <div className="text-sm">
            <h3 className="font-display uppercase tracking-wide text-foreground/90 mb-3">
              Company
            </h3>
            <ul className="space-y-2 text-muted">
              <li><Link href="/about" className="hover:text-foreground">About Us</Link></li>
              <li><Link href="/faq" className="hover:text-foreground">FAQ</Link></li>
              <li><Link href="/returns" className="hover:text-foreground">Return Policy</Link></li>
              <li><Link href="/track" className="hover:text-foreground">Track Order</Link></li>
              <li><Link href="/wishlist" className="hover:text-foreground">Wishlist</Link></li>
            </ul>
          </div>

          <div className="text-sm">
            <h3 className="font-display uppercase tracking-wide text-foreground/90 mb-3">
              Contact
            </h3>
            <ul className="space-y-2 text-muted">
              <li>
                <a
                  href={whatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 hover:text-foreground"
                >
                  <MessageCircle size={16} /> {displayPhone}
                </a>
              </li>
              <li>
                <a
                  href="https://instagram.com/clifstone.co"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 hover:text-foreground"
                >
                  <InstagramIcon size={16} /> @clifstone.co
                </a>
              </li>
              <li>
                <a
                  href="mailto:clifstone44@gmail.com"
                  className="inline-flex items-center gap-2 hover:text-foreground"
                >
                  <Mail size={16} /> clifstone44@gmail.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 flex items-center gap-2 rounded-xl border border-border bg-background px-4 py-3 text-sm text-muted">
          <ShieldCheck size={16} className="shrink-0 text-foreground" />
          100% Cash on Delivery — no online payment required.
        </div>

        <div className="mt-6 border-t border-border pt-6 text-xs text-muted flex flex-wrap items-center justify-between gap-3">
          <p>© {new Date().getFullYear()} Clifstone. All rights reserved.</p>
          <Link href="/admin" className="hover:text-foreground">
            Admin
          </Link>
        </div>
      </div>
    </footer>
  );
}

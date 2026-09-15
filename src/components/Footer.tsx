import Link from "next/link";
import { Mail } from "lucide-react";
import { Logo } from "./Logo";

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
  return (
    <footer className="mt-24 border-t border-border bg-surface">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="grid gap-10 sm:grid-cols-3">
          <div>
            <Logo className="h-8" />
            <p className="mt-3 max-w-xs text-sm text-muted">
              Gothic streetwear-luxe, façon marocaine. Montres, lunettes,
              maroquinerie et bijoux pensés pour durer.
            </p>
          </div>

          <div className="text-sm">
            <h3 className="font-display uppercase tracking-wide text-foreground/90 mb-3">
              Boutique
            </h3>
            <ul className="space-y-2 text-muted">
              <li><Link href="/shop/watches" className="hover:text-foreground">Montres</Link></li>
              <li><Link href="/shop/sunglasses" className="hover:text-foreground">Lunettes de soleil</Link></li>
              <li><Link href="/shop/wallets" className="hover:text-foreground">Portefeuilles</Link></li>
              <li><Link href="/shop/jewelry" className="hover:text-foreground">Bijoux</Link></li>
              <li><Link href="/shop/accessories" className="hover:text-foreground">Accessoires</Link></li>
              <li><Link href="/track" className="hover:text-foreground">Suivre ma commande</Link></li>
            </ul>
          </div>

          <div className="text-sm">
            <h3 className="font-display uppercase tracking-wide text-foreground/90 mb-3">
              Contact
            </h3>
            <ul className="space-y-2 text-muted">
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
              <li className="pt-1 text-xs text-muted">
                Paiement à la livraison · Livraison gratuite partout au Maroc
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-border pt-6 text-xs text-muted flex flex-wrap items-center justify-between gap-3">
          <p>© {new Date().getFullYear()} Clifstone. Tous droits réservés.</p>
          <Link href="/admin" className="hover:text-foreground">
            Espace admin
          </Link>
        </div>
      </div>
    </footer>
  );
}

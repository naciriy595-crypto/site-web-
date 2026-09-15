import type { Metadata } from "next";
import { Inter, Bebas_Neue } from "next/font/google";
import "./globals.css";

const bodyFont = Inter({
  variable: "--font-body",
  subsets: ["latin"],
});

const displayFont = Bebas_Neue({
  variable: "--font-display",
  weight: "400",
  subsets: ["latin"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Clifstone — Montres, lunettes & accessoires",
    template: "%s | Clifstone",
  },
  description:
    "Clifstone — marque marocaine de montres, lunettes de soleil, portefeuilles, bijoux et accessoires. Livraison gratuite, paiement à la livraison.",
  openGraph: {
    title: "Clifstone",
    description:
      "Gothic streetwear-luxe, façon marocaine. Livraison gratuite, paiement à la livraison.",
    siteName: "Clifstone",
    locale: "fr_MA",
    type: "website",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="fr"
      className={`${bodyFont.variable} ${displayFont.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}

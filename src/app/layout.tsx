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
    default: "Clifstone — Watches, Sunglasses & Accessories",
    template: "%s | Clifstone",
  },
  description:
    "Clifstone — a Moroccan brand of watches, sunglasses, wallets, jewelry and accessories. Free shipping, Cash on Delivery.",
  openGraph: {
    title: "Clifstone",
    description:
      "Gothic streetwear-luxe, Moroccan made. Free shipping, Cash on Delivery.",
    siteName: "Clifstone",
    locale: "en_US",
    type: "website",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${bodyFont.variable} ${displayFont.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}

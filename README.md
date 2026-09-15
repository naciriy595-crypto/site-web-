# Clifstone

E-commerce site for **Clifstone**, a Moroccan gothic streetwear-luxe brand
(watches, sunglasses, wallets, jewelry, accessories). Guest checkout only,
Cash on Delivery, free shipping, MAD currency, English-only UI, mobile-first.

Stack: Next.js (App Router) + TypeScript + Tailwind CSS v4 + Prisma
(PostgreSQL) + Zustand (cart/wishlist) + a lightweight JWT-cookie admin auth
(no external auth provider needed).

## Getting started

You need a Postgres database (local, Docker, or a free hosted one like
[Neon](https://neon.tech) — the same one you'd connect via Vercel's Storage
tab, see [Deploying to Vercel](#deploying-to-vercel) below).

```bash
npm install
cp .env.example .env       # then fill in DATABASE_URL and other values
npm run db:push            # creates tables from prisma/schema.prisma
npm run db:seed            # seeds categories, products, admin user
npm run dev
```

Storefront: http://localhost:3000
Admin panel: http://localhost:3000/admin/login

Default admin login (from `.env` / seed — **change these before going live**):

- Email: `admin@clifstone.co`
- Password: `Clifstone2024!`

## Project structure

- `src/app/(store)/...` — storefront: homepage, `/shop/[category]`,
  `/product/[slug]`, `/cart`, `/checkout`, `/order/[id]`, `/track`,
  `/search`, `/wishlist`, `/about`, `/faq`, `/returns`.
- `src/app/admin/...` — admin panel (protected by `src/proxy.ts`, the
  Next.js middleware/proxy convention): dashboard, product CRUD, order
  management, carrier/shipment panel.
- `src/app/api/...` — `/api/checkout` (guest order creation + automatic
  Ameex shipment attempt), `/api/track`, and `/api/admin/*` (products,
  order status, CSV export, ship).
- `prisma/schema.prisma` — `Category`, `Product`, `Order`, `OrderItem`,
  `AdminUser` models (PostgreSQL). `prisma/seed.ts` seeds everything.

All product content (name, price, description, images, category, stock) is
editable from the admin panel — nothing is hardcoded in the frontend.

## Product images

Watches and wallets ship with real product photography
(`public/products/*.webp`, sourced from the photos you provided and resized
by `scripts/process-product-photos.mjs`). Sunglasses, jewelry, and
accessories still use generated on-brand SVG placeholders
(`scripts/generate-placeholders.mjs`) since no real photos were supplied for
those categories yet — swap them out anytime from the admin product form's
"Images" field (one URL per line; drop files into `public/products/` or
host them anywhere).

Product photos support multiple angles (the gallery shows thumbnails for
every image) and tap/click-to-zoom into a full-screen lightbox.

## WhatsApp order notifications

Every order is saved to the database regardless of what happens next.
Notifications to **+212 640 848 752** use a **wa.me deep link** (no Meta
Business account / API token required):

- Right after a customer submits checkout, their browser opens a WhatsApp
  chat pre-filled with the full order summary, addressed to the store's
  number — they just tap send.
- The admin order detail page (`/admin/orders/[id]`) also has a
  "Send / resend on WhatsApp" button for manual resend, and a separate
  "Forward alert on WhatsApp" button when an order's automatic Ameex
  shipment failed.

Message building lives in `src/lib/whatsapp.ts`.

## Order tracking

Every order gets a sequential, customer-friendly number (`CLF-000123`,
`src/lib/order-number.ts`) alongside its internal id, assigned by Postgres's
native `autoincrement()`.

- Shown to the customer on the order confirmation page and in the WhatsApp
  message.
- `/track` (linked from the header, footer, and confirmation page) lets a
  customer look up their order by number + phone (phone must match, so
  order numbers alone can't be used to snoop on other customers) and see a
  status timeline (New → Processing → Shipped → Delivered, or Cancelled)
  plus the carrier tracking number once shipped.
- Admins update status from `/admin/orders` or an order's detail page;
  that status is what drives the tracking page.

## Ameex delivery integration

**Automatic at checkout:** right after an order is saved, the checkout API
route (`src/app/api/checkout/route.ts`) immediately tries to register a
shipment with Ameex. If that call fails for any reason — not configured,
network error, rejected request — the order still saves normally, the
customer still sees their confirmation page, and the failure is recorded on
the order (`shipmentError`) so admins are notified:

- The admin dashboard shows a banner ("N orders failed to auto-ship")
  linking to the affected orders.
- Each affected order's detail page shows the specific error and a
  "Forward alert on WhatsApp" button.
- `/admin/orders` lists a small warning icon next to any affected order.

**Current limitation:** we have an Ameex API ID and key
(`AMEEX_API_ID` / `AMEEX_API_KEY`, already in `.env`) but no base URL or
official endpoint documentation from Ameex, so the automatic call can't
actually succeed yet — it will always report "Ameex is not configured yet"
until `AMEEX_API_BASE_URL` is also set. The request shape in
`src/lib/delivery/ameex.ts` is a best-guess (POST `{base}/orders` with the
ID/key as headers and JSON fields) — **update the endpoint path, header
names, and field names in that file once you have Ameex's real docs.**
Nothing else needs to change: the automatic call, the graceful failure
path, the admin alerts, and the manual tracking-number fallback all already
work end-to-end.

**Always works today — CSV export.** `/admin/orders` has an "Export CSV
(Ameex)" button (`GET /api/admin/orders/export`, optionally `?status=NEW`)
with the standard columns Moroccan carriers ask for on manual bulk upload.

**Manual fallback.** Any order's detail page also has an "Add tracking
number manually" form, for when a shipment is created through Ameex's own
portal — it marks the order Shipped and immediately surfaces the tracking
info on `/track` for the customer, exactly like the automatic path would.

Set `AMEEX_TRACKING_URL_TEMPLATE` (e.g. `https://ameex.ma/track/{id}`) once
you know Ameex's own tracking page format, and both the admin and customer
tracking views will link out to it.

## Other features

- **Search** — header search icon opens a quick search overlay; results at
  `/search?q=...` match product name/description.
- **Filter & sort** — `/shop/[category]` supports sort (newest, price
  asc/desc) and an "in stock only" filter.
- **Wishlist** — heart icon on every product card and detail page, saved to
  `localStorage` (`src/lib/wishlist-store.ts`), viewable at `/wishlist`.
- **Mini-cart** — adding an item slides in a cart drawer (`MiniCart.tsx`)
  without leaving the page; the full `/cart` page still exists for a
  dedicated view.
- **Out-of-stock indicator** — badge on product cards/detail page; add-to-cart
  and buy-now are disabled for out-of-stock products.
- **About / FAQ / Return Policy** — static pages at `/about`, `/faq`,
  `/returns` covering the brand story, delivery/COD questions, and the
  refuse-at-delivery / 48-hour return policy.
- **SEO** — per-page meta titles/descriptions (homepage, categories,
  products), `app/sitemap.ts`, `app/robots.ts`, descriptive `alt` text on
  every product image.

## Logo

The real Clifstone graffiti wordmark lives at
`public/brand/clifstone-logo-original.jpg` (the source photo) with derived
assets checked in: `public/brand/logo-wordmark.webp` (header, footer, admin
sidebar, login page, homepage hero, About page) and `src/app/icon.png` /
`apple-icon.png` (favicon / home-screen icon). Re-run
`node scripts/crop-logo.mjs` after replacing the source photo to regenerate
all derived assets with the same crop framing.

## Deploying to Vercel

This app needs a real Postgres database — Vercel's serverless functions
don't have a persistent filesystem, so SQLite (the original prototype's
database) won't work there. The fastest path:

1. Push this branch to GitHub (already done if you're reading this in the
   repo).
2. On [vercel.com](https://vercel.com), **Add New → Project**, import the
   `naciriy595-crypto/site-web-` repo, and pick this branch.
3. Before the first deploy, go to the project's **Storage** tab → **Create
   Database → Postgres** (Vercel's own Postgres, powered by Neon). This
   automatically adds `DATABASE_URL` (and a few related env vars) to your
   project — use the **pooled** connection string it gives you, since
   serverless functions open many short-lived connections.
4. In **Settings → Environment Variables**, add the rest from `.env.example`:
   `ADMIN_SESSION_SECRET` (generate a long random string), `ADMIN_EMAIL`,
   `ADMIN_PASSWORD`, `WHATSAPP_ORDER_NUMBER`, `NEXT_PUBLIC_SITE_URL` (your
   Vercel URL), and `AMEEX_API_ID` / `AMEEX_API_KEY` (already have these —
   add `AMEEX_API_BASE_URL` once Ameex provides it).
5. Deploy. Vercel runs `npm install` (which runs `prisma generate` via the
   `postinstall` script) then `next build` automatically.
6. **One-time only**, run the schema push and seed against your new
   database from your machine (or a one-off script), pointing
   `DATABASE_URL` at the same pooled connection string:
   ```bash
   DATABASE_URL="<your Vercel Postgres URL>" npm run db:push
   DATABASE_URL="<your Vercel Postgres URL>" npm run db:seed
   ```
7. Vercel gives you a preview URL immediately (`your-project.vercel.app`,
   or a unique URL per branch/PR) — that's the link to review everything
   before pointing a custom domain at it or promoting it to production.

I can't do these steps myself since they require your Vercel account and
database credentials — but the app is fully prepared for it: Postgres
schema, `postinstall` hook, and all environment variables are already wired
up in `.env.example`.

## Scripts

- `npm run dev` / `build` / `start` — Next.js
- `npm run lint` — ESLint
- `npm run db:push` — sync Prisma schema to Postgres
- `npm run db:seed` — seed categories/products/admin user (safe to re-run,
  upserts by slug/email)

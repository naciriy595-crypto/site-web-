import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { MiniCart } from "@/components/MiniCart";
import { prisma } from "@/lib/prisma";

// Every storefront page reads live product/category data from the database,
// including data admins just added — this must never be statically
// prerendered at build time (which would also break the build itself if the
// database isn't reachable/seeded yet when `next build` runs, e.g. on the
// very first Vercel deploy before the DB has been set up).
export const dynamic = "force-dynamic";

export default async function StoreLayout({ children }: { children: React.ReactNode }) {
  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
    select: { slug: true, name: true },
  });

  return (
    <>
      <Header categories={categories} />
      <main className="flex-1">{children}</main>
      <Footer />
      <MiniCart />
    </>
  );
}

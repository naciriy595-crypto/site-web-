import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { productSchema } from "@/lib/validation";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const parsed = productSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid data" },
      { status: 400 }
    );
  }

  const existing = await prisma.product.findFirst({
    where: { slug: parsed.data.slug, NOT: { id } },
  });
  if (existing) {
    return NextResponse.json({ error: "This slug is already in use" }, { status: 409 });
  }

  const { images, metaTitle, metaDesc, ...rest } = parsed.data;

  const product = await prisma.product.update({
    where: { id },
    data: {
      ...rest,
      images: JSON.stringify(images),
      metaTitle: metaTitle || null,
      metaDesc: metaDesc || null,
    },
  });

  return NextResponse.json({ product });
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const usedInOrders = await prisma.orderItem.findFirst({ where: { productId: id } });
  if (usedInOrders) {
    await prisma.product.update({ where: { id }, data: { stockStatus: "OUT_OF_STOCK" } });
    return NextResponse.json({
      archived: true,
      message: "This product is used in existing orders, so it was marked out of stock instead of deleted.",
    });
  }

  await prisma.product.delete({ where: { id } });
  return NextResponse.json({ deleted: true });
}

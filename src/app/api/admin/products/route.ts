import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { productSchema } from "@/lib/validation";

export async function POST(req: Request) {
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

  const existing = await prisma.product.findUnique({ where: { slug: parsed.data.slug } });
  if (existing) {
    return NextResponse.json({ error: "This slug is already in use" }, { status: 409 });
  }

  const { images, metaTitle, metaDesc, color, variantGroup, ...rest } = parsed.data;

  const product = await prisma.product.create({
    data: {
      ...rest,
      images: JSON.stringify(images),
      metaTitle: metaTitle || null,
      metaDesc: metaDesc || null,
      color: color || null,
      variantGroup: variantGroup || null,
    },
  });

  return NextResponse.json({ product });
}

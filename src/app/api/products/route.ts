import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import slugify from "slugify";
import { z } from "zod";

const productSchema = z.object({
  nameFa: z.string().min(1),
  namePs: z.string().min(1),
  nameEn: z.string().min(1),
  descriptionFa: z.string().default(""),
  descriptionPs: z.string().default(""),
  descriptionEn: z.string().default(""),
  price: z.number().int().positive(),
  compareAtPrice: z.number().int().positive().optional().nullable(),
  stock: z.number().int().min(0).default(0),
  categoryId: z.string().min(1),
  isFeatured: z.boolean().optional(),
  isBestSeller: z.boolean().optional(),
  isNew: z.boolean().optional(),
  images: z.array(z.string()).default([]),
  colors: z.array(z.object({ nameFa: z.string(), hex: z.string().optional() })).default([]),
  sizes: z.array(z.object({ label: z.string() })).default([])
});

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get("category");
  const featured = searchParams.get("featured");
  const bestSeller = searchParams.get("bestSeller");
  const isNew = searchParams.get("new");
  const q = searchParams.get("q");

  const products = await prisma.product.findMany({
    where: {
      ...(category ? { category: { slug: category } } : {}),
      ...(featured ? { isFeatured: true } : {}),
      ...(bestSeller ? { isBestSeller: true } : {}),
      ...(isNew ? { isNew: true } : {}),
      ...(q
        ? {
            OR: [
              { nameFa: { contains: q, mode: "insensitive" } },
              { namePs: { contains: q, mode: "insensitive" } },
              { nameEn: { contains: q, mode: "insensitive" } }
            ]
          }
        : {})
    },
    include: { images: { orderBy: { order: "asc" } }, colors: true, sizes: true, category: true },
    orderBy: { createdAt: "desc" }
  });

  return NextResponse.json(products);
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const parsed = productSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }
  const data = parsed.data;

  const baseSlug = slugify(data.nameEn || data.nameFa, { lower: true, strict: true });
  let slug = baseSlug;
  let i = 1;
  while (await prisma.product.findUnique({ where: { slug } })) {
    slug = `${baseSlug}-${i++}`;
  }

  const product = await prisma.product.create({
    data: {
      slug,
      nameFa: data.nameFa,
      namePs: data.namePs,
      nameEn: data.nameEn,
      descriptionFa: data.descriptionFa,
      descriptionPs: data.descriptionPs,
      descriptionEn: data.descriptionEn,
      price: data.price,
      compareAtPrice: data.compareAtPrice ?? null,
      stock: data.stock,
      categoryId: data.categoryId,
      isFeatured: !!data.isFeatured,
      isBestSeller: !!data.isBestSeller,
      isNew: data.isNew ?? true,
      images: { create: data.images.map((url, order) => ({ url, order })) },
      colors: { create: data.colors.map((c) => ({ nameFa: c.nameFa, hex: c.hex })) },
      sizes: { create: data.sizes.map((s) => ({ label: s.label })) }
    },
    include: { images: true, colors: true, sizes: true }
  });

  return NextResponse.json(product, { status: 201 });
}

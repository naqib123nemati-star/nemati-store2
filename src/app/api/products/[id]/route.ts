import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const product = await prisma.product.findUnique({
    where: { id: params.id },
    include: { images: true, colors: true, sizes: true, category: true }
  });
  if (!product) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(product);
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();

  const product = await prisma.product.update({
    where: { id: params.id },
    data: {
      nameFa: body.nameFa,
      namePs: body.namePs,
      nameEn: body.nameEn,
      descriptionFa: body.descriptionFa,
      descriptionPs: body.descriptionPs,
      descriptionEn: body.descriptionEn,
      price: body.price,
      compareAtPrice: body.compareAtPrice ?? null,
      stock: body.stock,
      categoryId: body.categoryId,
      isFeatured: !!body.isFeatured,
      isBestSeller: !!body.isBestSeller,
      isNew: !!body.isNew
    }
  });

  return NextResponse.json(product);
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await prisma.product.delete({ where: { id: params.id } });
  return NextResponse.json({ success: true });
}

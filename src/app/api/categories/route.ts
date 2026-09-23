import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import slugify from "slugify";

export async function GET() {
  const categories = await prisma.category.findMany({ orderBy: { order: "asc" } });
  return NextResponse.json(categories);
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const slug = slugify(body.nameEn || body.nameFa, { lower: true, strict: true });

  const category = await prisma.category.create({
    data: {
      slug,
      nameFa: body.nameFa,
      namePs: body.namePs,
      nameEn: body.nameEn,
      icon: body.icon || null
    }
  });

  return NextResponse.json(category, { status: 201 });
}

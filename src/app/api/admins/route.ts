import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import bcrypt from "bcryptjs";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== "SUPER_ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const admins = await prisma.admin.findMany({
    select: { id: true, name: true, email: true, role: true, createdAt: true },
    orderBy: { createdAt: "asc" }
  });
  return NextResponse.json(admins);
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== "SUPER_ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  if (!body.name || !body.email || !body.password) {
    return NextResponse.json({ error: "اطلاعات ناقص است" }, { status: 400 });
  }

  const existing = await prisma.admin.findUnique({ where: { email: body.email } });
  if (existing) {
    return NextResponse.json({ error: "این ایمیل قبلاً ثبت شده" }, { status: 400 });
  }

  const passwordHash = await bcrypt.hash(body.password, 12);
  const admin = await prisma.admin.create({
    data: {
      name: body.name,
      email: body.email,
      passwordHash,
      role: body.role === "SUPER_ADMIN" || body.role === "ADMIN" ? body.role : "EDITOR"
    },
    select: { id: true, name: true, email: true, role: true, createdAt: true }
  });

  return NextResponse.json(admin, { status: 201 });
}

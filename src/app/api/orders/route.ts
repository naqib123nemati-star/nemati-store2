import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const orders = await prisma.order.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json(orders);
}

export async function POST(req: NextRequest) {
  const body = await req.json();

  const order = await prisma.order.create({
    data: {
      customerName: body.customerName || null,
      phone: body.phone || null,
      itemsJson: JSON.stringify(body.items || []),
      totalPrice: body.totalPrice || 0,
      status: "pending"
    }
  });

  return NextResponse.json(order, { status: 201 });
}

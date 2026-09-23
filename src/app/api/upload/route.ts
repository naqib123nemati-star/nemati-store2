import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import sharp from "sharp";

// توجه: این روش آپلود، فایل را روی دیسک سرور ذخیره می‌کند و برای توسعه محلی (Local)
// مناسب است. در بسیاری از سرویس‌های Hosting (مثل Vercel) فایل‌سیستم غیر دائمی است،
// بنابراین برای Production توصیه می‌شود از یک سرویس ذخیره‌سازی ابری مثل
// Cloudinary، AWS S3 یا Supabase Storage استفاده شود.

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const formData = await req.formData();
  const file = formData.get("file") as File | null;
  if (!file) return NextResponse.json({ error: "فایلی ارسال نشده" }, { status: 400 });

  const buffer = Buffer.from(await file.arrayBuffer());
  const uploadDir = path.join(process.cwd(), "public", "uploads");
  await mkdir(uploadDir, { recursive: true });

  const filename = `${Date.now()}-${Math.round(Math.random() * 1e6)}.webp`;
  const filepath = path.join(uploadDir, filename);

  await sharp(buffer).resize(1200, 1200, { fit: "inside" }).webp({ quality: 82 }).toFile(filepath);

  return NextResponse.json({ url: `/uploads/${filename}` });
}

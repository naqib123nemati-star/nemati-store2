import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const email = process.env.SUPER_ADMIN_EMAIL || "admin@nematistor.af";
  const password = process.env.SUPER_ADMIN_PASSWORD || "ChangeThisPassword123!";

  // این بخش هم‌زمان با هر بار Deploy اجرا می‌شود (upsert):
  // اگر ایمیل SUPER_ADMIN_EMAIL از قبل وجود داشته باشد، فقط رمز عبورش با مقدار
  // فعلی SUPER_ADMIN_PASSWORD همگام (Sync) می‌شود. یعنی برای تغییر رمز عبور
  // Super Admin کافی است مقدار متغیر محیطی را در Vercel عوض کنید و دوباره Deploy کنید.
  const passwordHash = await bcrypt.hash(password, 12);
  await prisma.admin.upsert({
    where: { email },
    update: { passwordHash },
    create: {
      name: "Super Admin",
      email,
      passwordHash,
      role: "SUPER_ADMIN"
    }
  });
  console.log(`Super Admin آماده است: ${email}`);

  const categories = [
    { slug: "clothing", nameFa: "پوشاک", namePs: "کالي", nameEn: "Clothing", icon: "👗" },
    { slug: "makeup", nameFa: "آرایشی", namePs: "میک اپ", nameEn: "Makeup", icon: "💄" },
    { slug: "hygiene", nameFa: "بهداشتی", namePs: "روغتیايي", nameEn: "Hygiene", icon: "🧴" },
    { slug: "accessories", nameFa: "اکسسوری", namePs: "زیورات", nameEn: "Accessories", icon: "💎" },
    { slug: "decor", nameFa: "دکوراسیون", namePs: "ډیکوریشن", nameEn: "Decor", icon: "🏠" },
    { slug: "food", nameFa: "خوراکی", namePs: "خواړه", nameEn: "Food", icon: "🍫" },
    { slug: "appliances", nameFa: "لوازم برقی", namePs: "بریښنایی توکي", nameEn: "Appliances", icon: "🔌" }
  ];

  for (const c of categories) {
    await prisma.category.upsert({
      where: { slug: c.slug },
      update: {},
      create: c
    });
  }

  console.log("دسته‌بندی‌های پایه ساخته شدند.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

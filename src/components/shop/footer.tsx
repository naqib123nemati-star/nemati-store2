import Link from "next/link";
import { getDictionary, localizedField } from "@/lib/i18n";
import { prisma } from "@/lib/prisma";
import { WHATSAPP_LINK } from "@/lib/whatsapp";

const BLUE = "#1E5FBF";
const BLUE_DARK = "#1B3A6B";

export default async function Footer({ locale }: { locale: string }) {
  const t = getDictionary(locale);
  const categories = await prisma.category.findMany({
    orderBy: { order: "asc" },
    take: 6
  });

  return (
    <footer className="mt-10 border-t border-cream-200" style={{ background: BLUE_DARK }}>
      <div className="container-shop grid gap-10 py-12 text-white sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <div className="mb-3 flex items-center gap-2">
            <img src="/images/logo.png" alt="نعمتی استور" className="h-8 w-8 object-contain" />
            <span className="text-lg font-extrabold">نعمتی استور</span>
          </div>
          <p className="text-sm text-white/70">
            کیفیت را انتخاب کنید، تفاوت را احساس کنید.
          </p>
        </div>

        <div>
          <h3 className="mb-4 text-sm font-bold">دسترسی سریع</h3>
          <ul className="space-y-2 text-sm text-white/70">
            <li><Link href={`/${locale}`} className="hover:text-white">خانه</Link></li>
            <li><Link href={`/${locale}#categories`} className="hover:text-white">دسته‌بندی‌ها</Link></li>
            <li><Link href={`/${locale}#featured`} className="hover:text-white">محصولات جدید</Link></li>
            <li><Link href={`/${locale}#about`} className="hover:text-white">درباره ما</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="mb-4 text-sm font-bold">دسته‌بندی‌ها</h3>
          <ul className="space-y-2 text-sm text-white/70">
            {categories.map((c) => (
              <li key={c.id}>
                <Link href={`/${locale}/category/${c.slug}`} className="hover:text-white">
                  {localizedField(c, "name", locale)}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="mb-4 text-sm font-bold">اطلاعات تماس</h3>
          <ul className="space-y-2 text-sm text-white/70">
            <li>
              <a href={WHATSAPP_LINK} target="_blank" rel="noopener noreferrer" className="hover:text-white">
                واتساپ: 0788809892
              </a>
            </li>
            <li>ارسال در سراسر افغانستان</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10 py-4 text-center text-xs text-white/60">
        © {new Date().getFullYear()} نعمتی استور — تمام حقوق محفوظ است.
      </div>
    </footer>
  );
}
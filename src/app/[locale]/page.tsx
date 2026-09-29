import Link from "next/link";
import { getDictionary, localizedField } from "@/lib/i18n";
import { prisma } from "@/lib/prisma";
import ProductCard from "@/components/shop/product-card";
import { WHATSAPP_LINK } from "@/lib/whatsapp";

export const dynamic = "force-dynamic";

const BLUE = "#1E5FBF";
const BLUE_DARK = "#1B3A6B";
const BLUE_SOFT = "#EAF1FB";

async function getHomeData() {
  const [featured, newest, bestSellers, categories] = await Promise.all([
    prisma.product.findMany({ where: { isFeatured: true }, include: { images: true }, take: 8 }),
    prisma.product.findMany({ where: { isNew: true }, include: { images: true }, take: 8, orderBy: { createdAt: "desc" } }),
    prisma.product.findMany({ where: { isBestSeller: true }, include: { images: true }, take: 5 }),
    prisma.category.findMany({ orderBy: { order: "asc" } })
  ]);
  return { featured, newest, bestSellers, categories };
}

export default async function HomePage({ params }: { params: { locale: string } }) {
  const t = getDictionary(params.locale);
  const { featured, newest, bestSellers, categories } = await getHomeData();
  const banners = categories.slice(0, 2);

  return (
    <div>
      <section className="container-shop pt-6">
        <div
          className="grid items-center gap-8 overflow-hidden rounded-3xl p-8 md:grid-cols-2 md:p-14"
          style={{ background: BLUE_SOFT }}
        >
          <div>
            <p className="mb-2 text-sm font-semibold" style={{ color: BLUE }}>
              نعمتی استور
            </p>
            <h1 className="mb-4 text-3xl font-extrabold leading-tight md:text-5xl" style={{ color: BLUE_DARK }}>
              فروشگاه آنلاین نعمتی
            </h1>
            <p className="mb-8 max-w-md text-ink-700">
              کیفیت را انتخاب کنید، تفاوت را احساس کنید — مجموعه‌ای متنوع از محصولات منتخب با قیمت مناسب.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href={`/${params.locale}#featured`}
                className="rounded-full px-6 py-3 text-sm font-bold text-white"
                style={{ background: BLUE }}
              >
                مشاهده محصولات
              </Link>
              <a
                href={WHATSAPP_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border px-6 py-3 text-sm font-bold"
                style={{ borderColor: BLUE, color: BLUE }}
              >
                سفارش از واتساپ
              </a>
            </div>
          </div>
          <div className="flex items-center justify-center">
            <div className="flex aspect-square w-3/4 max-w-[300px] items-center justify-center rounded-full bg-white shadow-soft">
              <img src="/images/logo.png" alt="نعمتی استور" className="w-2/3 object-contain" />
            </div>
          </div>
        </div>
      </section>

      <section id="categories" className="container-shop py-10">
        <div className="grid grid-cols-3 gap-4 sm:grid-cols-4 lg:grid-cols-8">
          {categories.map((c) => (
            <Link
              key={c.id}
              href={`/${params.locale}/category/${c.slug}`}
              className="flex flex-col items-center gap-2 text-center"
            >
              <span
                className="flex h-16 w-16 items-center justify-center rounded-full text-3xl shadow-soft"
                style={{ background: BLUE_SOFT }}
              >
                {c.icon}
              </span>
              <span className="text-xs font-semibold">{localizedField(c, "name", params.locale)}</span>
            </Link>
          ))}
        </div>
      </section>

      {featured.length > 0 && (
        <section id="featured" className="container-shop py-8">
          <h2 className="mb-6 text-2xl font-bold">پیشنهادهای ویژه</h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            {featured.map((p) => (
              <ProductCard key={p.id} locale={params.locale} product={p} />
            ))}
          </div>
        </section>
      )}

      {banners.length > 0 && (
        <section className="container-shop py-6">
          <div className="grid gap-4 md:grid-cols-2">
            {banners.map((c, i) => (
              <Link
                key={c.id}
                href={`/${params.locale}/category/${c.slug}`}
                className="flex items-center justify-between gap-4 rounded-3xl p-8 shadow-soft"
                style={{ background: i === 0 ? BLUE : BLUE_SOFT }}
              >
                <div>
                  <p
                    className="mb-2 text-xl font-extrabold"
                    style={{ color: i === 0 ? "#fff" : BLUE_DARK }}
                  >
                    {localizedField(c, "name", params.locale)}
                  </p>
                  <span
                    className="rounded-full px-4 py-2 text-sm font-bold"
                    style={
                      i === 0
                        ? { background: "#fff", color: BLUE }
                        : { background: BLUE, color: "#fff" }
                    }
                  >
                    مشاهده و خرید
                  </span>
                </div>
                <span className="text-6xl">{c.icon}</span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {bestSellers.length > 0 && (
        <section className="container-shop py-8">
          <h2 className="mb-6 text-2xl font-bold">پرفروش‌ترین‌ها</h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            {bestSellers.map((p, i) => (
              <div key={p.id} className="relative">
                <span
                  className="absolute right-2 top-2 z-10 flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold text-white"
                  style={{ background: BLUE }}
                >
                  {i + 1}
                </span>
                <ProductCard locale={params.locale} product={p} />
              </div>
            ))}
          </div>
        </section>
      )}

      {newest.length > 0 && (
        <section className="container-shop py-8">
          <h2 className="mb-6 text-2xl font-bold">محصولات جدید</h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            {newest.map((p) => (
              <ProductCard key={p.id} locale={params.locale} product={p} />
            ))}
          </div>
        </section>
      )}

      <section className="container-shop py-8">
        <div className="grid grid-cols-2 gap-4 rounded-3xl p-6 sm:grid-cols-3 lg:grid-cols-5" style={{ background: BLUE_SOFT }}>
          {[
            "ارسال در سراسر افغانستان",
            "سفارش آسان از طریق واتساپ",
            "تنوع بالای محصولات",
            "قیمت مناسب",
            "پشتیبانی مشتریان"
          ].map((label) => (
            <div key={label} className="text-center text-xs font-semibold" style={{ color: BLUE_DARK }}>
              {label}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
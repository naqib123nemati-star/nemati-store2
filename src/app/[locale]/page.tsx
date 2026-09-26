import Link from "next/link";
import { getDictionary, localizedField } from "@/lib/i18n";
import { prisma } from "@/lib/prisma";
import ProductCard from "@/components/shop/product-card";
import { WHATSAPP_LINK } from "@/lib/whatsapp";

export const dynamic = "force-dynamic";

async function getHomeData() {
  const [featured, newest, bestSellers, categories] = await Promise.all([
    prisma.product.findMany({ where: { isFeatured: true }, include: { images: true }, take: 8 }),
    prisma.product.findMany({ where: { isNew: true }, include: { images: true }, take: 8, orderBy: { createdAt: "desc" } }),
    prisma.product.findMany({ where: { isBestSeller: true }, include: { images: true }, take: 8 }),
    prisma.category.findMany({ orderBy: { order: "asc" } })
  ]);
  return { featured, newest, bestSellers, categories };
}

export default async function HomePage({ params }: { params: { locale: string } }) {
  const t = getDictionary(params.locale);
  const { featured, newest, bestSellers, categories } = await getHomeData();

  return (
    <div>
      <section className="relative overflow-hidden border-b border-cream-200">
        <div className="container-shop grid items-center gap-10 py-16 md:grid-cols-2 md:py-24">
          <div>
            <p className="mb-3 text-sm font-medium tracking-wide text-gold-600">{t.brand}</p>
            <h1 className="mb-5 text-4xl font-extrabold leading-tight md:text-5xl">
              {t.hero.title}
            </h1>
            <p className="mb-8 max-w-md text-ink-700">{t.hero.subtitle}</p>
            <div className="flex flex-wrap gap-3">
              <Link href={`/${params.locale}#categories`} className="btn-gold">
                {t.hero.cta1}
              </Link>
              <a href={WHATSAPP_LINK} target="_blank" rel="noopener noreferrer" className="btn-outline">
                {t.hero.cta2}
              </a>
            </div>
          </div>
          <div className="relative flex aspect-square items-center justify-center overflow-hidden rounded-xl2 bg-cream-100 shadow-soft">
            <img
              src="/images/logo.png"
              alt={t.brand}
              className="w-2/3 max-w-[280px] object-contain"
            />
          </div>
        </div>
      </section>

      <section id="categories" className="container-shop py-16">
        <h2 className="mb-8 text-2xl font-bold">{t.sections.categories}</h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {categories.map((c) => (
            <Link
              key={c.id}
              href={`/${params.locale}/category/${c.slug}`}
              className="card flex flex-col items-center gap-3 p-6 text-center transition hover:-translate-y-1"
            >
              <span className="text-3xl">{c.icon}</span>
              <span className="text-sm font-semibold">{localizedField(c, "name", params.locale)}</span>
            </Link>
          ))}
        </div>
      </section>

      {featured.length > 0 && (
        <ProductRow title={t.sections.featured} products={featured} locale={params.locale} />
      )}
      {newest.length > 0 && (
        <ProductRow title={t.sections.new} products={newest} locale={params.locale} />
      )}
      {bestSellers.length > 0 && (
        <ProductRow title={t.sections.bestSellers} products={bestSellers} locale={params.locale} />
      )}
    </div>
  );
}

function ProductRow({ title, products, locale }: { title: string; products: any[]; locale: string }) {
  return (
    <section className="container-shop py-10">
      <h2 className="mb-8 text-2xl font-bold">{title}</h2>
      <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
        {products.map((p) => (
          <ProductCard key={p.id} locale={locale} product={p} />
        ))}
      </div>
    </section>
  );
                             }

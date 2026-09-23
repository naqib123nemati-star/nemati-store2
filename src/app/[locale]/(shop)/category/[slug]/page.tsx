import { prisma } from "@/lib/prisma";
import { getDictionary, localizedField } from "@/lib/i18n";
import ProductCard from "@/components/shop/product-card";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function CategoryPage({
  params
}: {
  params: { locale: string; slug: string };
}) {
  const category = await prisma.category.findUnique({ where: { slug: params.slug } });
  if (!category) notFound();

  const products = await prisma.product.findMany({
    where: { categoryId: category.id },
    include: { images: true },
    orderBy: { createdAt: "desc" }
  });

  const t = getDictionary(params.locale);

  return (
    <div className="container-shop py-10">
      <h1 className="mb-8 text-2xl font-bold">{localizedField(category, "name", params.locale)}</h1>
      {products.length === 0 ? (
        <p className="text-ink-700">
          {params.locale === "en"
            ? "No products yet."
            : params.locale === "ps"
            ? "لا هم محصول نشته."
            : "هنوز محصولی موجود نیست."}
        </p>
      ) : (
        <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
          {products.map((p) => (
            <ProductCard key={p.id} locale={params.locale} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}

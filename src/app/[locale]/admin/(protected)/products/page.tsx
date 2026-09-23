import { prisma } from "@/lib/prisma";
import { getDictionary } from "@/lib/i18n";
import Link from "next/link";
import ProductRowActions from "./product-row-actions";

export const dynamic = "force-dynamic";

export default async function AdminProductsPage({ params }: { params: { locale: string } }) {
  const t = getDictionary(params.locale);
  const products = await prisma.product.findMany({
    include: { images: true, category: true },
    orderBy: { createdAt: "desc" }
  });

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-bold">{t.admin.products}</h1>
        <Link href={`/${params.locale}/admin/products/new`} className="btn-gold">
          +{" "}
          {params.locale === "en" ? "New product" : params.locale === "ps" ? "نوی محصول" : "محصول جدید"}
        </Link>
      </div>

      <div className="card overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-cream-100 text-start">
            <tr>
              <th className="p-3 text-start">—</th>
              <th className="p-3 text-start">{params.locale === "en" ? "Name" : "نام"}</th>
              <th className="p-3 text-start">{params.locale === "en" ? "Category" : "دسته‌بندی"}</th>
              <th className="p-3 text-start">{params.locale === "en" ? "Price" : "قیمت"}</th>
              <th className="p-3 text-start">{params.locale === "en" ? "Stock" : "موجودی"}</th>
              <th className="p-3 text-start"></th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id} className="border-t border-cream-100">
                <td className="p-3">
                  <img
                    src={p.images[0]?.url || "/images/placeholder.png"}
                    className="h-10 w-10 rounded object-cover"
                    alt=""
                  />
                </td>
                <td className="p-3 font-medium">{p.nameFa}</td>
                <td className="p-3">{p.category.nameFa}</td>
                <td className="p-3">{p.price.toLocaleString()} ؋</td>
                <td className="p-3">{p.stock}</td>
                <td className="p-3">
                  <ProductRowActions locale={params.locale} id={p.id} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

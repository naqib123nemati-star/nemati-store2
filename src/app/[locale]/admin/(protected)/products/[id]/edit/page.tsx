import { prisma } from "@/lib/prisma";
import ProductForm from "@/components/admin/product-form";
import { notFound } from "next/navigation";

export default async function EditProductPage({
  params
}: {
  params: { locale: string; id: string };
}) {
  const [product, categories] = await Promise.all([
    prisma.product.findUnique({
      where: { id: params.id },
      include: { images: true, colors: true, sizes: true }
    }),
    prisma.category.findMany({ orderBy: { order: "asc" } })
  ]);

  if (!product) notFound();

  return (
    <div>
      <h1 className="mb-8 text-2xl font-bold">ویرایش محصول</h1>
      <ProductForm locale={params.locale} categories={categories} initial={product} />
    </div>
  );
}

import { prisma } from "@/lib/prisma";
import ProductForm from "@/components/admin/product-form";

export default async function NewProductPage({ params }: { params: { locale: string } }) {
  const categories = await prisma.category.findMany({ orderBy: { order: "asc" } });

  return (
    <div>
      <h1 className="mb-8 text-2xl font-bold">محصول جدید</h1>
      <ProductForm locale={params.locale} categories={categories} />
    </div>
  );
}

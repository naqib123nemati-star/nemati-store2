import { prisma } from "@/lib/prisma";
import { getDictionary } from "@/lib/i18n";
import CategoryManager from "@/components/admin/category-manager";

export const dynamic = "force-dynamic";

export default async function AdminCategoriesPage({ params }: { params: { locale: string } }) {
  const t = getDictionary(params.locale);
  const categories = await prisma.category.findMany({ orderBy: { order: "asc" } });

  return (
    <div>
      <h1 className="mb-8 text-2xl font-bold">{t.admin.categories}</h1>
      <CategoryManager initialCategories={categories} />
    </div>
  );
}

import { prisma } from "@/lib/prisma";
import { getDictionary, localizedField } from "@/lib/i18n";
import { notFound } from "next/navigation";
import ProductDetailClient from "./product-detail-client";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

async function getProduct(slug: string) {
  return prisma.product.findUnique({
    where: { slug },
    include: { images: { orderBy: { order: "asc" } }, colors: true, sizes: true, category: true }
  });
}

export async function generateMetadata({
  params
}: {
  params: { locale: string; slug: string };
}): Promise<Metadata> {
  const product = await getProduct(params.slug);
  if (!product) return {};
  const name = localizedField(product, "name", params.locale);
  return {
    title: name,
    description: localizedField(product, "description", params.locale).slice(0, 160),
    openGraph: { images: product.images[0] ? [product.images[0].url] : [] }
  };
}

export default async function ProductPage({
  params
}: {
  params: { locale: string; slug: string };
}) {
  const product = await getProduct(params.slug);
  if (!product) notFound();

  const t = getDictionary(params.locale);

  return <ProductDetailClient product={product} locale={params.locale} t={t} />;
}

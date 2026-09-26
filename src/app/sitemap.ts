import { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";
import { locales } from "@/lib/i18n";

const BASE_URL = "https://nemati-store2.vercel.app";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [products, categories] = await Promise.all([
    prisma.product.findMany({ select: { slug: true, updatedAt: true } }),
    prisma.category.findMany({ select: { slug: true } })
  ]);

  const entries: MetadataRoute.Sitemap = [];

  for (const locale of locales) {
    entries.push({
      url: `${BASE_URL}/${locale}`,
      changeFrequency: "daily",
      priority: 1
    });

    for (const c of categories) {
      entries.push({
        url: `${BASE_URL}/${locale}/category/${c.slug}`,
        changeFrequency: "weekly",
        priority: 0.7
      });
    }

    for (const p of products) {
      entries.push({
        url: `${BASE_URL}/${locale}/product/${p.slug}`,
        lastModified: p.updatedAt,
        changeFrequency: "weekly",
        priority: 0.8
      });
    }
  }

  return entries;
}

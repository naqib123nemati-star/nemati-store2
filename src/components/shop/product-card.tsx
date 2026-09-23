import Link from "next/link";
import { getDictionary, localizedField } from "@/lib/i18n";

type ProductCardProps = {
  locale: string;
  product: {
    slug: string;
    nameFa: string;
    namePs: string;
    nameEn: string;
    price: number;
    compareAtPrice?: number | null;
    stock: number;
    images: { url: string }[];
  };
};

export default function ProductCard({ locale, product }: ProductCardProps) {
  const t = getDictionary(locale);
  const name = localizedField(product, "name", locale);
  const discount = product.compareAtPrice
    ? Math.round(100 - (product.price / product.compareAtPrice) * 100)
    : null;
  const image = product.images[0]?.url || "/images/placeholder.png";

  return (
    <Link href={`/${locale}/product/${product.slug}`} className="card group block overflow-hidden">
      <div className="relative aspect-[4/5] overflow-hidden bg-cream-100">
        <img
          src={image}
          alt={name}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />
        {discount ? (
          <span className="absolute top-3 start-3 rounded-full bg-ink-900 px-2.5 py-1 text-xs font-semibold text-white">
            {discount}% {t.product.off}
          </span>
        ) : null}
        {product.stock === 0 && (
          <span className="absolute inset-0 flex items-center justify-center bg-white/70 text-sm font-semibold">
            {t.product.outOfStock}
          </span>
        )}
      </div>
      <div className="p-4">
        <h3 className="mb-1 line-clamp-1 text-sm font-semibold">{name}</h3>
        <div className="flex items-center gap-2">
          <span className="font-bold text-gold-600">{product.price.toLocaleString()} ؋</span>
          {product.compareAtPrice ? (
            <span className="text-xs text-ink-700/50 line-through">
              {product.compareAtPrice.toLocaleString()} ؋
            </span>
          ) : null}
        </div>
      </div>
    </Link>
  );
}

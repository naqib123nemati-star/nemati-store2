"use client";

import { useState } from "react";
import { localizedField } from "@/lib/i18n";
import { useCartStore } from "@/context/cart-store";
import { buildWhatsappUrl } from "@/lib/whatsapp";
import toast from "react-hot-toast";

export default function ProductDetailClient({
  product,
  locale,
  t
}: {
  product: any;
  locale: string;
  t: any;
}) {
  const name = localizedField(product, "name", locale);
  const description = localizedField(product, "description", locale);
  const [activeImage, setActiveImage] = useState(0);
  const [zoom, setZoom] = useState(false);
  const [color, setColor] = useState<string | undefined>(product.colors[0]?.nameFa);
  const [size, setSize] = useState<string | undefined>(product.sizes[0]?.label);
  const [qty, setQty] = useState(1);

  const addItem = useCartStore((s) => s.addItem);
  const discount = product.compareAtPrice
    ? Math.round(100 - (product.price / product.compareAtPrice) * 100)
    : null;

  function handleAddToCart() {
    addItem({
      productId: product.id,
      slug: product.slug,
      name,
      price: product.price,
      image: product.images[0]?.url || "/images/placeholder.png",
      quantity: qty,
      color,
      size
    });
    toast.success(locale === "en" ? "Added to cart" : locale === "ps" ? "سبد ته اضافه شو" : "به سبد اضافه شد");
  }

  function handleWhatsappOrder() {
    const url = buildWhatsappUrl(
      [{ name, price: product.price, quantity: qty, color, size }],
      t
    );
    window.open(url, "_blank");
  }

  return (
    <div className="container-shop grid gap-10 py-10 md:grid-cols-2">
      <div>
        <div
          className="relative mb-4 aspect-square cursor-zoom-in overflow-hidden rounded-xl2 bg-cream-100"
          onClick={() => setZoom(!zoom)}
        >
          <img
            src={product.images[activeImage]?.url || "/images/placeholder.png"}
            alt={name}
            className={`h-full w-full object-cover transition-transform duration-300 ${
              zoom ? "scale-150" : "scale-100"
            }`}
          />
        </div>
        {product.images.length > 1 && (
          <div className="flex gap-3">
            {product.images.map((img: any, idx: number) => (
              <button
                key={img.id}
                onClick={() => setActiveImage(idx)}
                className={`h-16 w-16 overflow-hidden rounded-lg border-2 ${
                  activeImage === idx ? "border-gold-500" : "border-transparent"
                }`}
              >
                <img src={img.url} alt="" className="h-full w-full object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>

      <div>
        <h1 className="mb-3 text-3xl font-bold">{name}</h1>
        <div className="mb-6 flex items-center gap-3">
          <span className="text-2xl font-bold text-gold-600">{product.price.toLocaleString()} ؋</span>
          {product.compareAtPrice ? (
            <>
              <span className="text-ink-700/50 line-through">
                {product.compareAtPrice.toLocaleString()} ؋
              </span>
              <span className="rounded-full bg-ink-900 px-2.5 py-1 text-xs font-semibold text-white">
                {discount}% {t.product.off}
              </span>
            </>
          ) : null}
        </div>

        <p className="mb-3 text-sm font-medium">
          {product.stock > 0 ? (
            <span className="text-green-700">● {t.product.inStock}</span>
          ) : (
            <span className="text-red-600">● {t.product.outOfStock}</span>
          )}
        </p>

        {product.colors.length > 0 && (
          <div className="mb-5">
            <p className="mb-2 text-sm font-semibold">{t.product.color}</p>
            <div className="flex flex-wrap gap-2">
              {product.colors.map((c: any) => (
                <button
                  key={c.id}
                  onClick={() => setColor(c.nameFa)}
                  className={`rounded-full border px-4 py-1.5 text-sm ${
                    color === c.nameFa ? "border-gold-500 bg-gold-500/10" : "border-cream-200"
                  }`}
                >
                  {c.nameFa}
                </button>
              ))}
            </div>
          </div>
        )}

        {product.sizes.length > 0 && (
          <div className="mb-5">
            <p className="mb-2 text-sm font-semibold">{t.product.size}</p>
            <div className="flex flex-wrap gap-2">
              {product.sizes.map((s: any) => (
                <button
                  key={s.id}
                  onClick={() => setSize(s.label)}
                  className={`rounded-full border px-4 py-1.5 text-sm ${
                    size === s.label ? "border-gold-500 bg-gold-500/10" : "border-cream-200"
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="mb-6 flex items-center gap-3">
          <p className="text-sm font-semibold">{t.product.quantity}</p>
          <div className="flex items-center rounded-full border border-cream-200">
            <button className="px-3 py-1.5" onClick={() => setQty(Math.max(1, qty - 1))}>
              −
            </button>
            <span className="w-8 text-center">{qty}</span>
            <button className="px-3 py-1.5" onClick={() => setQty(qty + 1)}>
              +
            </button>
          </div>
        </div>

        <div className="mb-8 flex flex-wrap gap-3">
          <button
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            className="btn-outline disabled:opacity-40"
          >
            {t.product.addToCart}
          </button>
          <button
            onClick={handleWhatsappOrder}
            disabled={product.stock === 0}
            className="btn-gold disabled:opacity-40"
          >
            {t.product.orderWhatsapp}
          </button>
        </div>

        {description && (
          <div>
            <h3 className="mb-2 font-semibold">{t.product.description}</h3>
            <p className="whitespace-pre-line text-sm leading-7 text-ink-700">{description}</p>
          </div>
        )}
      </div>
    </div>
  );
}

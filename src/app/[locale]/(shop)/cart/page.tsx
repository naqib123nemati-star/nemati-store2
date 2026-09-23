"use client";

import { useCartStore } from "@/context/cart-store";
import { getDictionary } from "@/lib/i18n";
import { buildWhatsappUrl } from "@/lib/whatsapp";
import Link from "next/link";
import { Trash2 } from "lucide-react";

export default function CartPage({ params }: { params: { locale: string } }) {
  const t = getDictionary(params.locale);
  const { items, removeItem, increment, decrement, total } = useCartStore();

  function handleCheckout() {
    const url = buildWhatsappUrl(
      items.map((i) => ({ name: i.name, price: i.price, quantity: i.quantity, color: i.color, size: i.size })),
      t
    );
    window.open(url, "_blank");
  }

  return (
    <div className="container-shop py-10">
      <h1 className="mb-8 text-2xl font-bold">{t.cart.title}</h1>

      {items.length === 0 ? (
        <div className="py-20 text-center">
          <p className="mb-6 text-ink-700">{t.cart.empty}</p>
          <Link href={`/${params.locale}`} className="btn-gold">
            {t.hero.cta1}
          </Link>
        </div>
      ) : (
        <div className="grid gap-10 lg:grid-cols-3">
          <div className="space-y-4 lg:col-span-2">
            {items.map((item) => (
              <div
                key={`${item.productId}-${item.color}-${item.size}`}
                className="card flex items-center gap-4 p-4"
              >
                <img src={item.image} alt={item.name} className="h-20 w-20 rounded-lg object-cover" />
                <div className="flex-1">
                  <p className="font-semibold">{item.name}</p>
                  <p className="text-sm text-ink-700">
                    {item.color && `${t.product.color}: ${item.color} `}
                    {item.size && `${t.product.size}: ${item.size}`}
                  </p>
                  <div className="mt-2 flex items-center gap-2">
                    <div className="flex items-center rounded-full border border-cream-200">
                      <button
                        className="px-3 py-1"
                        onClick={() => decrement(item.productId, item.color, item.size)}
                      >
                        −
                      </button>
                      <span className="w-8 text-center">{item.quantity}</span>
                      <button
                        className="px-3 py-1"
                        onClick={() => increment(item.productId, item.color, item.size)}
                      >
                        +
                      </button>
                    </div>
                    <button
                      onClick={() => removeItem(item.productId, item.color, item.size)}
                      className="rounded-full p-2 text-red-600 hover:bg-red-50"
                      aria-label={t.cart.remove}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                <p className="font-bold text-gold-600">
                  {(item.price * item.quantity).toLocaleString()} ؋
                </p>
              </div>
            ))}
          </div>

          <div className="card h-fit p-6">
            <div className="mb-4 flex items-center justify-between text-lg font-bold">
              <span>{t.cart.total}</span>
              <span>{total().toLocaleString()} ؋</span>
            </div>
            <button onClick={handleCheckout} className="btn-gold w-full">
              {t.cart.checkout}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

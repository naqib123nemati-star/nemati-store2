import { prisma } from "@/lib/prisma";
import { getDictionary } from "@/lib/i18n";

export default async function AdminDashboard({ params }: { params: { locale: string } }) {
  const t = getDictionary(params.locale);

  const [productCount, categoryCount, orderCount, lowStock, recentOrders] = await Promise.all([
    prisma.product.count(),
    prisma.category.count(),
    prisma.order.count(),
    prisma.product.findMany({ where: { stock: { lte: 3 } }, take: 5, orderBy: { stock: "asc" } }),
    prisma.order.findMany({ take: 5, orderBy: { createdAt: "desc" } })
  ]);

  const cards = [
    { label: t.admin.products, value: productCount },
    { label: t.admin.categories, value: categoryCount },
    { label: t.admin.orders, value: orderCount }
  ];

  return (
    <div>
      <h1 className="mb-8 text-2xl font-bold">{t.admin.dashboard}</h1>

      <div className="mb-10 grid gap-5 sm:grid-cols-3">
        {cards.map((c) => (
          <div
            key={c.label}
            className="rounded-xl2 border border-gold-500/20 bg-gradient-to-b from-white to-cream-100 p-6 shadow-soft"
          >
            <p className="text-sm text-ink-700">{c.label}</p>
            <p className="text-3xl font-bold text-gold-600">{c.value}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="card p-6">
          <h2 className="mb-4 font-semibold">
            {params.locale === "en" ? "Low stock" : params.locale === "ps" ? "کم شتون" : "موجودی کم"}
          </h2>
          <ul className="space-y-2 text-sm">
            {lowStock.map((p) => (
              <li key={p.id} className="flex justify-between border-b border-cream-100 pb-2">
                <span>{p.nameFa}</span>
                <span className="font-semibold text-red-600">{p.stock}</span>
              </li>
            ))}
            {lowStock.length === 0 && <p className="text-ink-700">—</p>}
          </ul>
        </div>

        <div className="card p-6">
          <h2 className="mb-4 font-semibold">
            {params.locale === "en" ? "Recent orders" : params.locale === "ps" ? "وروستي فرمایشونه" : "آخرین سفارش‌ها"}
          </h2>
          <ul className="space-y-2 text-sm">
            {recentOrders.map((o) => (
              <li key={o.id} className="flex justify-between border-b border-cream-100 pb-2">
                <span>{o.customerName || "—"}</span>
                <span className="font-semibold text-gold-600">{o.totalPrice.toLocaleString()} ؋</span>
              </li>
            ))}
            {recentOrders.length === 0 && <p className="text-ink-700">—</p>}
          </ul>
        </div>
      </div>
    </div>
  );
}

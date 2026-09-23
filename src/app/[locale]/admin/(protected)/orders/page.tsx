import { prisma } from "@/lib/prisma";
import { getDictionary } from "@/lib/i18n";
import OrderStatusSelect from "./order-status-select";

export const dynamic = "force-dynamic";

export default async function AdminOrdersPage({ params }: { params: { locale: string } }) {
  const t = getDictionary(params.locale);
  const orders = await prisma.order.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div>
      <h1 className="mb-8 text-2xl font-bold">{t.admin.orders}</h1>

      {orders.length === 0 ? (
        <p className="text-ink-700">
          هنوز سفارشی ثبت نشده. سفارش‌های واتساپ به‌صورت خودکار این‌جا ثبت نمی‌شوند مگر این‌که مشتری از
          طریق فرم سایت سفارش بدهد؛ در حال حاضر سفارش‌ها مستقیماً به واتساپ شما ارسال می‌شوند.
        </p>
      ) : (
        <div className="card overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-cream-100">
              <tr>
                <th className="p-3 text-start">مشتری</th>
                <th className="p-3 text-start">تلفن</th>
                <th className="p-3 text-start">مبلغ</th>
                <th className="p-3 text-start">وضعیت</th>
                <th className="p-3 text-start">تاریخ</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o.id} className="border-t border-cream-100">
                  <td className="p-3">{o.customerName || "—"}</td>
                  <td className="p-3">{o.phone || "—"}</td>
                  <td className="p-3">{o.totalPrice.toLocaleString()} ؋</td>
                  <td className="p-3">
                    <OrderStatusSelect id={o.id} status={o.status} />
                  </td>
                  <td className="p-3">{new Date(o.createdAt).toLocaleDateString("fa-IR")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

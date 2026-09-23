"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const statuses = [
  { value: "pending", label: "در انتظار" },
  { value: "confirmed", label: "تأیید شده" },
  { value: "shipped", label: "ارسال شده" },
  { value: "cancelled", label: "لغو شده" }
];

export default function OrderStatusSelect({ id, status }: { id: string; status: string }) {
  const [value, setValue] = useState(status);
  const router = useRouter();

  async function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const newStatus = e.target.value;
    setValue(newStatus);
    await fetch(`/api/orders/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus })
    });
    router.refresh();
  }

  return (
    <select
      value={value}
      onChange={handleChange}
      className="rounded-lg border border-cream-200 px-2 py-1 text-xs outline-none focus:border-gold-400"
    >
      {statuses.map((s) => (
        <option key={s.value} value={s.value}>
          {s.label}
        </option>
      ))}
    </select>
  );
}

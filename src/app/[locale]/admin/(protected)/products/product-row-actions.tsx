"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Pencil, Trash2 } from "lucide-react";

export default function ProductRowActions({ locale, id }: { locale: string; id: string }) {
  const router = useRouter();

  async function handleDelete() {
    const confirmMsg =
      locale === "en" ? "Delete this product?" : locale === "ps" ? "دا محصول ړنګ شي؟" : "این محصول حذف شود؟";
    if (!confirm(confirmMsg)) return;

    const res = await fetch(`/api/products/${id}`, { method: "DELETE" });
    if (res.ok) {
      toast.success(locale === "en" ? "Deleted" : locale === "ps" ? "ړنګ شو" : "حذف شد");
      router.refresh();
    } else {
      toast.error(locale === "en" ? "Failed" : "خطا رخ داد");
    }
  }

  return (
    <div className="flex items-center gap-2">
      <Link
        href={`/${locale}/admin/products/${id}/edit`}
        className="rounded-lg p-2 text-ink-700 hover:bg-cream-100"
      >
        <Pencil className="h-4 w-4" />
      </Link>
      <button onClick={handleDelete} className="rounded-lg p-2 text-red-600 hover:bg-red-50">
        <Trash2 className="h-4 w-4" />
      </button>
    </div>
  );
}

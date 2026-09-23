"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

type Category = { id: string; nameFa: string };

export default function ProductForm({
  locale,
  categories,
  initial
}: {
  locale: string;
  categories: Category[];
  initial?: any;
}) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [images, setImages] = useState<string[]>(initial?.images?.map((i: any) => i.url) || []);
  const [uploading, setUploading] = useState(false);

  const [form, setForm] = useState({
    nameFa: initial?.nameFa || "",
    namePs: initial?.namePs || "",
    nameEn: initial?.nameEn || "",
    descriptionFa: initial?.descriptionFa || "",
    descriptionPs: initial?.descriptionPs || "",
    descriptionEn: initial?.descriptionEn || "",
    price: initial?.price || 0,
    compareAtPrice: initial?.compareAtPrice || "",
    stock: initial?.stock ?? 0,
    categoryId: initial?.categoryId || categories[0]?.id || "",
    isFeatured: initial?.isFeatured || false,
    isBestSeller: initial?.isBestSeller || false,
    isNew: initial?.isNew ?? true,
    colors: initial?.colors?.map((c: any) => c.nameFa).join(", ") || "",
    sizes: initial?.sizes?.map((s: any) => s.label).join(", ") || ""
  });

  function update(field: string, value: any) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files) return;
    setUploading(true);
    for (const file of Array.from(files)) {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      if (res.ok) {
        const data = await res.json();
        setImages((prev) => [...prev, data.url]);
      }
    }
    setUploading(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);

    const payload = {
      ...form,
      price: Number(form.price),
      compareAtPrice: form.compareAtPrice ? Number(form.compareAtPrice) : null,
      stock: Number(form.stock),
      images,
      colors: form.colors
        ? form.colors.split(",").map((c: string) => ({ nameFa: c.trim() })).filter((c: any) => c.nameFa)
        : [],
      sizes: form.sizes
        ? form.sizes.split(",").map((s: string) => ({ label: s.trim() })).filter((s: any) => s.label)
        : []
    };

    const res = await fetch(initial ? `/api/products/${initial.id}` : "/api/products", {
      method: initial ? "PATCH" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    setSaving(false);

    if (res.ok) {
      toast.success(locale === "en" ? "Saved" : locale === "ps" ? "خوندي شو" : "ذخیره شد");
      router.push(`/${locale}/admin/products`);
      router.refresh();
    } else {
      toast.error(locale === "en" ? "Something went wrong" : "خطا رخ داد");
    }
  }

  const inputClass = "w-full rounded-lg border border-cream-200 px-3 py-2 outline-none focus:border-gold-400";

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl space-y-6">
      <div className="card grid gap-4 p-6 sm:grid-cols-3">
        <div>
          <label className="mb-1 block text-sm font-medium">نام (دری)</label>
          <input className={inputClass} value={form.nameFa} onChange={(e) => update("nameFa", e.target.value)} required />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">نوم (پښتو)</label>
          <input className={inputClass} value={form.namePs} onChange={(e) => update("namePs", e.target.value)} required />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Name (English)</label>
          <input className={inputClass} value={form.nameEn} onChange={(e) => update("nameEn", e.target.value)} required />
        </div>
      </div>

      <div className="card grid gap-4 p-6 sm:grid-cols-3">
        <div>
          <label className="mb-1 block text-sm font-medium">توضیحات (دری)</label>
          <textarea className={inputClass} rows={3} value={form.descriptionFa} onChange={(e) => update("descriptionFa", e.target.value)} />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">تشریح (پښتو)</label>
          <textarea className={inputClass} rows={3} value={form.descriptionPs} onChange={(e) => update("descriptionPs", e.target.value)} />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Description (English)</label>
          <textarea className={inputClass} rows={3} value={form.descriptionEn} onChange={(e) => update("descriptionEn", e.target.value)} />
        </div>
      </div>

      <div className="card grid gap-4 p-6 sm:grid-cols-4">
        <div>
          <label className="mb-1 block text-sm font-medium">قیمت</label>
          <input type="number" className={inputClass} value={form.price} onChange={(e) => update("price", e.target.value)} required />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">قیمت قبلی (اختیاری)</label>
          <input type="number" className={inputClass} value={form.compareAtPrice} onChange={(e) => update("compareAtPrice", e.target.value)} />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">موجودی</label>
          <input type="number" className={inputClass} value={form.stock} onChange={(e) => update("stock", e.target.value)} required />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">دسته‌بندی</label>
          <select className={inputClass} value={form.categoryId} onChange={(e) => update("categoryId", e.target.value)} required>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.nameFa}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="card grid gap-4 p-6 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium">رنگ‌ها (با کاما جدا کنید)</label>
          <input className={inputClass} value={form.colors} onChange={(e) => update("colors", e.target.value)} placeholder="مشکی, سفید, طلایی" />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">سایزها (با کاما جدا کنید)</label>
          <input className={inputClass} value={form.sizes} onChange={(e) => update("sizes", e.target.value)} placeholder="S, M, L, XL" />
        </div>
      </div>

      <div className="card p-6">
        <label className="mb-1 block text-sm font-medium">عکس‌های محصول</label>
        <input type="file" multiple accept="image/*" onChange={handleUpload} className="mb-3 text-sm" />
        {uploading && <p className="text-sm text-ink-700">در حال آپلود...</p>}
        <div className="flex flex-wrap gap-3">
          {images.map((url, idx) => (
            <div key={url} className="relative h-20 w-20 overflow-hidden rounded-lg border border-cream-200">
              <img src={url} className="h-full w-full object-cover" alt="" />
              <button
                type="button"
                onClick={() => setImages(images.filter((_, i) => i !== idx))}
                className="absolute end-0 top-0 rounded-bl bg-red-600 px-1.5 text-xs text-white"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="card flex flex-wrap gap-6 p-6">
        <label className="flex items-center gap-2 text-sm font-medium">
          <input type="checkbox" checked={form.isFeatured} onChange={(e) => update("isFeatured", e.target.checked)} />
          محصول ویژه
        </label>
        <label className="flex items-center gap-2 text-sm font-medium">
          <input type="checkbox" checked={form.isBestSeller} onChange={(e) => update("isBestSeller", e.target.checked)} />
          پرفروش
        </label>
        <label className="flex items-center gap-2 text-sm font-medium">
          <input type="checkbox" checked={form.isNew} onChange={(e) => update("isNew", e.target.checked)} />
          جدید
        </label>
      </div>

      <button type="submit" disabled={saving} className="btn-gold">
        {saving ? "..." : "ذخیره محصول"}
      </button>
    </form>
  );
}

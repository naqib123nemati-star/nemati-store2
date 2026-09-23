"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { Trash2 } from "lucide-react";

type Category = {
  id: string;
  nameFa: string;
  namePs: string;
  nameEn: string;
  icon: string | null;
};

export default function CategoryManager({ initialCategories }: { initialCategories: Category[] }) {
  const [categories, setCategories] = useState(initialCategories);
  const [form, setForm] = useState({ nameFa: "", namePs: "", nameEn: "", icon: "" });
  const [saving, setSaving] = useState(false);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!form.nameFa || !form.namePs || !form.nameEn) return;

    setSaving(true);
    const res = await fetch("/api/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    });
    setSaving(false);

    if (res.ok) {
      const category = await res.json();
      setCategories((c) => [...c, category]);
      setForm({ nameFa: "", namePs: "", nameEn: "", icon: "" });
      toast.success("دسته‌بندی اضافه شد");
    } else {
      toast.error("خطا رخ داد");
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("این دسته‌بندی حذف شود؟")) return;
    const res = await fetch(`/api/categories/${id}`, { method: "DELETE" });
    if (res.ok) {
      setCategories((c) => c.filter((cat) => cat.id !== id));
      toast.success("حذف شد");
    } else {
      toast.error("این دسته‌بندی دارای محصول است یا خطایی رخ داد");
    }
  }

  const inputClass = "w-full rounded-lg border border-cream-200 px-3 py-2 outline-none focus:border-gold-400";

  return (
    <div className="space-y-8">
      <form onSubmit={handleAdd} className="card grid gap-4 p-6 sm:grid-cols-5">
        <input className={inputClass} placeholder="نام (دری)" value={form.nameFa} onChange={(e) => setForm({ ...form, nameFa: e.target.value })} />
        <input className={inputClass} placeholder="نوم (پښتو)" value={form.namePs} onChange={(e) => setForm({ ...form, namePs: e.target.value })} />
        <input className={inputClass} placeholder="Name (English)" value={form.nameEn} onChange={(e) => setForm({ ...form, nameEn: e.target.value })} />
        <input className={inputClass} placeholder="آیکون (اموجی)" value={form.icon} onChange={(e) => setForm({ ...form, icon: e.target.value })} />
        <button disabled={saving} className="btn-gold">
          {saving ? "..." : "+ افزودن"}
        </button>
      </form>

      <div className="card overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-cream-100">
            <tr>
              <th className="p-3 text-start">آیکون</th>
              <th className="p-3 text-start">دری</th>
              <th className="p-3 text-start">پشتو</th>
              <th className="p-3 text-start">English</th>
              <th className="p-3 text-start"></th>
            </tr>
          </thead>
          <tbody>
            {categories.map((c) => (
              <tr key={c.id} className="border-t border-cream-100">
                <td className="p-3">{c.icon}</td>
                <td className="p-3">{c.nameFa}</td>
                <td className="p-3">{c.namePs}</td>
                <td className="p-3">{c.nameEn}</td>
                <td className="p-3">
                  <button onClick={() => handleDelete(c.id)} className="rounded-lg p-2 text-red-600 hover:bg-red-50">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

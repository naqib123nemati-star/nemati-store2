"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { Trash2 } from "lucide-react";

type Admin = { id: string; name: string; email: string; role: string; createdAt: string };

export default function AdminManager({
  initialAdmins,
  currentAdminId
}: {
  initialAdmins: Admin[];
  currentAdminId: string;
}) {
  const [admins, setAdmins] = useState(initialAdmins);
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "EDITOR" });
  const [saving, setSaving] = useState(false);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);

    const res = await fetch("/api/admins", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    });
    setSaving(false);

    if (res.ok) {
      const admin = await res.json();
      setAdmins((a) => [...a, admin]);
      setForm({ name: "", email: "", password: "", role: "EDITOR" });
      toast.success("ادمین جدید ساخته شد");
    } else {
      const data = await res.json();
      toast.error(data.error || "خطا رخ داد");
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("این ادمین حذف شود؟")) return;
    const res = await fetch(`/api/admins/${id}`, { method: "DELETE" });
    if (res.ok) {
      setAdmins((a) => a.filter((x) => x.id !== id));
      toast.success("حذف شد");
    } else {
      const data = await res.json();
      toast.error(data.error || "خطا رخ داد");
    }
  }

  const inputClass = "w-full rounded-lg border border-cream-200 px-3 py-2 outline-none focus:border-gold-400";

  return (
    <div className="space-y-8">
      <form onSubmit={handleAdd} className="card grid gap-4 p-6 sm:grid-cols-5">
        <input className={inputClass} placeholder="نام" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
        <input className={inputClass} type="email" placeholder="ایمیل" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
        <input className={inputClass} type="password" placeholder="رمز عبور" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
        <select className={inputClass} value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
          <option value="EDITOR">Editor</option>
          <option value="ADMIN">Admin</option>
          <option value="SUPER_ADMIN">Super Admin</option>
        </select>
        <button disabled={saving} className="btn-gold">
          {saving ? "..." : "+ افزودن"}
        </button>
      </form>

      <div className="card overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-cream-100">
            <tr>
              <th className="p-3 text-start">نام</th>
              <th className="p-3 text-start">ایمیل</th>
              <th className="p-3 text-start">نقش</th>
              <th className="p-3 text-start"></th>
            </tr>
          </thead>
          <tbody>
            {admins.map((a) => (
              <tr key={a.id} className="border-t border-cream-100">
                <td className="p-3">{a.name}</td>
                <td className="p-3">{a.email}</td>
                <td className="p-3">{a.role}</td>
                <td className="p-3">
                  {a.id !== currentAdminId && (
                    <button onClick={() => handleDelete(a.id)} className="rounded-lg p-2 text-red-600 hover:bg-red-50">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

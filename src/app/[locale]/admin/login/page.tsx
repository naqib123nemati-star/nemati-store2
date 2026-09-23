"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useParams } from "next/navigation";
import { getDictionary } from "@/lib/i18n";

export default function AdminLoginPage() {
  const params = useParams();
  const locale = params.locale as string;
  const t = getDictionary(locale);
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await signIn("credentials", {
      email,
      password,
      redirect: false
    });

    setLoading(false);

    if (res?.error) {
      setError(locale === "en" ? "Invalid email or password" : locale === "ps" ? "بریښنالیک یا پاسورډ سم نه دی" : "ایمیل یا رمز عبور نادرست است");
      return;
    }

    router.push(`/${locale}/admin`);
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0F0D0A] px-4">
      <form onSubmit={handleSubmit} className="w-full max-w-sm rounded-xl2 border border-gold-500/30 bg-white p-8 shadow-soft">
        <img src="/images/logo.png" alt="" className="mx-auto mb-4 h-14 w-14 object-contain" />
        <h1 className="mb-6 text-center text-xl font-bold">{t.admin.login}</h1>

        {error && <p className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">{error}</p>}

        <label className="mb-1 block text-sm font-medium">{t.admin.email}</label>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mb-4 w-full rounded-lg border border-cream-200 px-3 py-2 outline-none focus:border-gold-400"
        />

        <label className="mb-1 block text-sm font-medium">{t.admin.password}</label>
        <input
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mb-6 w-full rounded-lg border border-cream-200 px-3 py-2 outline-none focus:border-gold-400"
        />

        <button type="submit" disabled={loading} className="btn-gold w-full">
          {loading ? "..." : t.admin.login}
        </button>
      </form>
    </div>
  );
}

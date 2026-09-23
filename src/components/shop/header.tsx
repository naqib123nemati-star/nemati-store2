"use client";

import Link from "next/link";
import { useState } from "react";
import { getDictionary, locales } from "@/lib/i18n";
import { usePathname } from "next/navigation";
import { useCartStore } from "@/context/cart-store";
import { ShoppingBag, Menu, X, Search } from "lucide-react";

const localeLabels: Record<string, string> = { fa: "دری", ps: "پښتو", en: "English" };

export default function Header({ locale }: { locale: string }) {
  const t = getDictionary(locale);
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const itemCount = useCartStore((s) => s.items.reduce((n, i) => n + i.quantity, 0));

  function switchLocaleHref(target: string) {
    const rest = pathname.split("/").slice(2).join("/");
    return `/${target}/${rest}`;
  }

  return (
    <header className="sticky top-0 z-40 border-b border-cream-200 bg-cream-50/95 backdrop-blur">
      <div className="container-shop flex h-20 items-center justify-between gap-4">
        <Link href={`/${locale}`} className="flex items-center gap-2 shrink-0">
          <img src="/images/logo.png" alt="NEMATI STOR" className="h-11 w-11 object-contain" />
          <span className="text-lg font-bold tracking-tight">{t.brand}</span>
        </Link>

        <div className="hidden flex-1 items-center md:flex">
          <div className="relative w-full max-w-md">
            <Search className="absolute inset-y-0 start-3 my-auto h-4 w-4 text-ink-700/50" />
            <input
              type="text"
              placeholder={t.nav.search}
              className="w-full rounded-full border border-cream-200 bg-white py-2.5 ps-9 pe-4 text-sm outline-none focus:border-gold-400"
            />
          </div>
        </div>

        <nav className="hidden items-center gap-6 md:flex">
          <Link href={`/${locale}`} className="text-sm font-medium hover:text-gold-600">
            {t.nav.home}
          </Link>
          <Link href={`/${locale}#categories`} className="text-sm font-medium hover:text-gold-600">
            {t.nav.categories}
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <div className="hidden items-center gap-1 rounded-full border border-cream-200 p-1 sm:flex">
            {locales.map((l) => (
              <Link
                key={l}
                href={switchLocaleHref(l)}
                className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                  l === locale ? "bg-ink-900 text-white" : "text-ink-700 hover:bg-cream-100"
                }`}
              >
                {localeLabels[l]}
              </Link>
            ))}
          </div>

          <Link href={`/${locale}/cart`} className="relative rounded-full p-2 hover:bg-cream-100">
            <ShoppingBag className="h-5 w-5" />
            {itemCount > 0 && (
              <span className="absolute -top-1 -end-1 flex h-5 w-5 items-center justify-center rounded-full bg-gold-500 text-[10px] font-bold text-white">
                {itemCount}
              </span>
            )}
          </Link>

          <button className="rounded-full p-2 hover:bg-cream-100 md:hidden" onClick={() => setOpen(!open)}>
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-cream-200 bg-cream-50 p-4 md:hidden">
          <div className="mb-3 flex gap-2">
            {locales.map((l) => (
              <Link
                key={l}
                href={switchLocaleHref(l)}
                className={`rounded-full px-3 py-1 text-xs font-medium ${
                  l === locale ? "bg-ink-900 text-white" : "border border-cream-200"
                }`}
              >
                {localeLabels[l]}
              </Link>
            ))}
          </div>
          <Link href={`/${locale}`} className="block py-2 text-sm font-medium">
            {t.nav.home}
          </Link>
          <Link href={`/${locale}#categories`} className="block py-2 text-sm font-medium">
            {t.nav.categories}
          </Link>
        </div>
      )}
    </header>
  );
}

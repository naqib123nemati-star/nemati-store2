"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { getDictionary } from "@/lib/i18n";
import { LayoutDashboard, Package, Tags, ShoppingCart, Users, LogOut } from "lucide-react";

export default function AdminSidebar({ locale, role }: { locale: string; role: string }) {
  const t = getDictionary(locale);
  const pathname = usePathname();
  const base = `/${locale}/admin`;

  const links = [
    { href: base, label: t.admin.dashboard, icon: LayoutDashboard },
    { href: `${base}/products`, label: t.admin.products, icon: Package },
    { href: `${base}/categories`, label: t.admin.categories, icon: Tags },
    { href: `${base}/orders`, label: t.admin.orders, icon: ShoppingCart },
    ...(role === "SUPER_ADMIN" ? [{ href: `${base}/admins`, label: t.admin.admins, icon: Users }] : [])
  ];

  return (
    <aside className="hidden w-64 shrink-0 bg-[#0F0D0A] p-6 md:block">
      <div className="mb-10 flex items-center gap-3 border-b border-gold-500/20 pb-6">
        <img src="/images/logo.png" alt="" className="h-10 w-10 object-contain" />
        <div>
          <p className="font-bold tracking-wide text-cream-50">{t.brand}</p>
          <p className="text-[10px] uppercase tracking-[0.2em] text-gold-400">
            {locale === "en" ? "Admin panel" : locale === "ps" ? "د مدیریت پینل" : "پنل مدیریت"}
          </p>
        </div>
      </div>

      <nav className="space-y-1">
        {links.map((link) => {
          const Icon = link.icon;
          const active = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-3 rounded-lg border px-3 py-2.5 text-sm font-medium transition ${
                active
                  ? "border-gold-500/40 bg-gold-500/10 text-gold-400"
                  : "border-transparent text-cream-100/70 hover:border-gold-500/20 hover:bg-white/5 hover:text-gold-300"
              }`}
            >
              <Icon className="h-4 w-4" />
              {link.label}
            </Link>
          );
        })}
      </nav>

      <button
        onClick={() => signOut({ callbackUrl: `/${locale}/admin/login` })}
        className="mt-8 flex items-center gap-3 rounded-lg border border-transparent px-3 py-2.5 text-sm font-medium text-red-400 hover:border-red-500/20 hover:bg-red-500/10"
      >
        <LogOut className="h-4 w-4" />
        {t.admin.logout}
      </button>
    </aside>
  );
}

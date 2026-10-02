import Link from "next/link";
import { WHATSAPP_LINK } from "@/lib/whatsapp";
import InstallButton from "@/components/shop/install-button";

const NAV = [
  { href: "", label: "صفحه اصلی" },
  { href: "#categories", label: "فروشگاه" },
  { href: "#categories", label: "دسته‌بندی‌ها" },
  { href: "#featured", label: "محصولات جدید" },
  { href: "#about", label: "درباره ما" }
];

export default function Header({ locale }: { locale: string }) {
  return (
    <header className="sticky top-0 z-50 border-b border-cream-200 bg-white">
      <div className="container-shop flex items-center justify-between gap-4 py-3">
        <Link href={`/${locale}`} className="flex items-center gap-2 shrink-0">
          <img src="/images/logo.png" alt="نعمتی استور" className="h-9 w-9 object-contain" />
          <span className="text-lg font-extrabold" style={{ color: "#1B3A6B" }}>
            نعمتی استور
          </span>
        </Link>

        <nav className="hidden items-center gap-6 text-sm font-medium text-ink-700 md:flex">
          {NAV.map((item) => (
            <Link key={item.label} href={`/${locale}${item.href}`} className="hover:text-[#1E5FBF]">
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden flex-1 max-w-xs items-center md:flex">
          <input
            type="text"
            placeholder="جستجوی محصولات..."
            className="w-full rounded-full border border-cream-200 px-4 py-2 text-sm focus:outline-none focus:ring-2"
            style={{ ["--tw-ring-color" as any]: "#1E5FBF" }}
          />
        </div>

        <div className="flex items-center gap-3">
          <InstallButton />
          <a href={WHATSAPP_LINK} target="_blank" rel="noopener noreferrer" aria-label="سفارش از واتساپ">
            <svg viewBox="0 0 24 24" fill="#25D366" className="h-6 w-6">
              <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.28-1.39a9.9 9.9 0 0 0 4.76 1.21h.01c5.46 0 9.9-4.45 9.9-9.91C21.96 6.45 17.5 2 12.04 2zm5.8 14.06c-.24.68-1.4 1.32-1.93 1.4-.5.08-1.11.11-1.79-.11-.41-.13-.94-.3-1.62-.6-2.85-1.23-4.71-4.1-4.85-4.29-.14-.19-1.16-1.55-1.16-2.96s.73-2.1 1-2.39c.26-.28.56-.35.75-.35h.53c.17 0 .4-.03.62.48.24.56.8 1.94.87 2.08.07.14.11.3.02.48-.09.19-.14.3-.28.46-.14.16-.29.36-.42.48-.14.14-.28.29-.12.57.16.28.71 1.18 1.53 1.91 1.05.94 1.94 1.24 2.22 1.38.28.14.44.12.6-.07.16-.19.68-.79.87-1.06.19-.28.37-.23.62-.14.26.09 1.63.77 1.91.91.28.14.47.21.53.33.07.12.07.68-.17 1.36z" />
            </svg>
          </a>
          <div className="flex items-center gap-2 text-xs font-medium text-ink-700">
            <Link href="/fa" className={locale === "fa" ? "font-bold" : ""} style={locale === "fa" ? { color: "#1E5FBF" } : {}}>
              دری
            </Link>
            <span>|</span>
            <Link href="/ps" className={locale === "ps" ? "font-bold" : ""} style={locale === "ps" ? { color: "#1E5FBF" } : {}}>
              پښتو
            </Link>
            <span>|</span>
            <Link href="/en" className={locale === "en" ? "font-bold" : ""} style={locale === "en" ? { color: "#1E5FBF" } : {}}>
              EN
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
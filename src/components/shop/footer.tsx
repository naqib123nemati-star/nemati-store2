import Link from "next/link";
import { getDictionary } from "@/lib/i18n";
import { WHATSAPP_LINK } from "@/lib/whatsapp";

export default function Footer({ locale }: { locale: string }) {
  const t = getDictionary(locale);

  return (
    <footer className="mt-24 border-t border-cream-200 bg-white">
      <div className="container-shop grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-3">
        <div>
          <div className="mb-3 flex items-center gap-2">
            <img src="/images/logo.png" alt="" className="h-9 w-9 object-contain" />
            <span className="text-lg font-bold">{t.brand}</span>
          </div>
          <p className="max-w-xs text-sm leading-7 text-ink-700">{t.footer.about}</p>
        </div>

        <div>
          <h4 className="mb-3 font-semibold">{t.footer.quickLinks}</h4>
          <ul className="space-y-2 text-sm text-ink-700">
            <li><Link href={`/${locale}`}>{t.nav.home}</Link></li>
            <li><Link href={`/${locale}#categories`}>{t.nav.categories}</Link></li>
            <li><Link href={`/${locale}/cart`}>{t.nav.cart}</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="mb-3 font-semibold">{t.footer.contact}</h4>
          <a
            href={WHATSAPP_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-gold"
          >
            {t.nav.whatsappOrder}
          </a>
        </div>
      </div>

      <div className="border-t border-cream-200 py-5 text-center text-xs text-ink-700">
        © {new Date().getFullYear()} {t.brand} — {t.footer.rights}
      </div>
    </footer>
  );
}

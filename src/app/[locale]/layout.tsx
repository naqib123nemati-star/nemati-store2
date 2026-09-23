import type { Metadata } from "next";
import "../globals.css";
import { locales, isRtl, getDictionary } from "@/lib/i18n";
import Header from "@/components/shop/header";
import Footer from "@/components/shop/footer";
import WhatsappFloatingButton from "@/components/shop/whatsapp-floating-button";
import { Toaster } from "react-hot-toast";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const t = getDictionary(params.locale);
  return {
    title: `${t.brand} | ${t.slogan}`,
    description: t.hero.subtitle,
    openGraph: {
      title: t.brand,
      description: t.hero.subtitle,
      type: "website"
    }
  };
}

export default function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const dir = isRtl(params.locale) ? "rtl" : "ltr";
  const fontClass = params.locale === "en" ? "font-en" : "font-dari";

  return (
    <html lang={params.locale} dir={dir}>
      <body className={fontClass}>
        <Toaster position="top-center" />
        <Header locale={params.locale} />
        <main className="min-h-screen">{children}</main>
        <Footer locale={params.locale} />
        <WhatsappFloatingButton locale={params.locale} />
      </body>
    </html>
  );
}

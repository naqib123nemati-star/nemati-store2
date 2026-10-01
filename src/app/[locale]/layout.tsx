import type { Metadata } from "next";
import Script from "next/script";
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
    manifest: "/manifest.json",
    themeColor: "#1E5FBF",
    appleWebApp: {
      capable: true,
      statusBarStyle: "default",
      title: t.brand
    },
    icons: {
      icon: "/icon-192.png",
      apple: "/apple-touch-icon.png"
    },
    openGraph: {
      title: t.brand,
      description: t.hero.subtitle,
      type: "website"
    },
    verification: {
      google: "-VY29Oq_xwDv5dhaUUEkXVxgg0ngJ_k1ZaqREGSyvbQ"
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
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-PFHG09ZSLQ"
          strategy="afterInteractive"
        />
        <Script id="ga4" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-PFHG09ZSLQ');
          `}
        </Script>
        <Script id="sw-register" strategy="afterInteractive">
          {`
            if ("serviceWorker" in navigator) {
              window.addEventListener("load", function () {
                navigator.serviceWorker.register("/sw.js");
              });
            }
          `}
        </Script>
        <Toaster position="top-center" />
        <Header locale={params.locale} />
        <main className="min-h-screen">{children}</main>
        <Footer locale={params.locale} />
        <WhatsappFloatingButton locale={params.locale} />
      </body>
    </html>
  );
}

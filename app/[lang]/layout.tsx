import type { Metadata } from "next";
import { ViewTransition } from "react";
import { Footer } from "@/components/footer";
import { GridLines } from "@/components/grid-lines";
import { Nav } from "@/components/nav/nav";
import { alexandria, satoshi, satoshiFa, vazirmatn } from "@/lib/fonts";
import { dir, getDictionary, getLocale, locales } from "@/lib/i18n";
import { site } from "@/lib/site";
import "../globals.css";

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

// Per-page titles, descriptions and hreflang alternates come from lib/metadata.ts.
export async function generateMetadata(): Promise<Metadata> {
  const [locale, t] = await Promise.all([getLocale(), getDictionary()]);
  return {
    metadataBase: new URL(site.url),
    title: { default: t.meta.title, template: `%s — ${t.meta.siteName}` },
    description: t.meta.description,
    openGraph: {
      siteName: t.meta.siteName,
      type: "website",
      locale: locale === "fa" ? "fa_IR" : "en_US",
    },
  };
}

export default async function RootLayout({ children }: LayoutProps<"/[lang]">) {
  const [locale, t] = await Promise.all([getLocale(), getDictionary()]);

  return (
    <html
      lang={locale}
      dir={dir(locale)}
      data-scroll-behavior="smooth"
      className={`${satoshi.variable} ${alexandria.variable} ${vazirmatn.variable}${locale === "fa" ? ` ${satoshiFa.variable}` : ""}`}
    >
      <body>
        <GridLines />
        <a
          href="#content"
          className="sr-only z-60 rounded-pill bg-ink px-5 py-3 font-semibold text-white focus:not-sr-only focus:fixed focus:inset-s-4 focus:top-4"
        >
          {t.nav.skip}
        </a>
        <Nav t={t} locale={locale} />
        {/* Route changes update main and the footer inside the navigation's transition;
            only those animate (page-swap, app/styles/transitions.css). */}
        <ViewTransition update="page-swap" default="none">
          <main id="content" tabIndex={-1} className="overflow-x-clip focus:outline-none">
            {children}
          </main>
        </ViewTransition>
        <ViewTransition update="page-swap" default="none">
          <Footer t={t} locale={locale} />
        </ViewTransition>
      </body>
    </html>
  );
}

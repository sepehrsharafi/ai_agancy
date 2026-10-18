import type { Metadata } from "next";
import { getDictionary, getLocale, localePath, locales, type Locale } from "./i18n";

type PageKey = keyof Awaited<ReturnType<typeof getDictionary>>["meta"]["pages"];

function alternates(locale: Locale, path: string): Metadata["alternates"] {
  return {
    canonical: localePath(locale, path),
    languages: {
      ...Object.fromEntries(locales.map((l) => [l, localePath(l, path)])),
      "x-default": localePath("en", path),
    },
  };
}

/** Home metadata (the site title and description) with hreflang alternates. */
export async function homeMetadata(): Promise<Metadata> {
  const [locale, t] = await Promise.all([getLocale(), getDictionary()]);
  return {
    title: { absolute: t.meta.title },
    description: t.meta.description,
    alternates: alternates(locale, ""),
  };
}

/** Inner-page metadata: localized title (templated with the site name), description, hreflang. */
export async function pageMetadata(page: PageKey): Promise<Metadata> {
  const [locale, t] = await Promise.all([getLocale(), getDictionary()]);
  const { title, description } = t.meta.pages[page];
  return {
    title,
    description,
    alternates: alternates(locale, `/${page}`),
    openGraph: { title, description },
  };
}

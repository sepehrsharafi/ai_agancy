// Locale primitives with no server-only imports, so client components can use them.
// Server code should import from "@/lib/i18n", which re-exports all of this.

export const locales = ["en", "fa"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "en";

export const hasLocale = (value: string): value is Locale =>
  (locales as readonly string[]).includes(value);

export const dir = (locale: Locale) => (locale === "fa" ? "rtl" : "ltr");

export const otherLocale = (locale: Locale): Locale => (locale === "fa" ? "en" : "fa");

/** "/services" -> "/en/services"; "" and "/" -> "/en". */
export const localePath = (locale: Locale, path = "") =>
  path === "" || path === "/" ? `/${locale}` : `/${locale}${path.startsWith("/") ? path : `/${path}`}`;

/** Numeric data fields: Persian digits on /fa, Latin digits on /en. */
export const formatNumber = (locale: Locale, n: number) =>
  new Intl.NumberFormat(locale === "fa" ? "fa-IR" : "en-US").format(n);

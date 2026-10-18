import { notFound } from "next/navigation";
import { lang } from "next/root-params";
import type { Dictionary } from "@/content/en";
import { hasLocale, type Locale } from "./locale";

// Server-only entry point (next/root-params cannot be imported from a Client Component).
// Client components import the pure helpers from "@/lib/locale" instead.
export * from "./locale";
export type { Dictionary };

const dictionaries = {
  en: () => import("@/content/en").then((m) => m.en),
  fa: () => import("@/content/fa").then((m) => m.fa),
} satisfies Record<Locale, () => Promise<Dictionary>>;

/** The locale of the current route, read from the root `[lang]` param. 404s on anything else. */
export async function getLocale(): Promise<Locale> {
  const value = await lang();
  if (!hasLocale(value)) notFound();
  return value;
}

export async function getDictionary(): Promise<Dictionary> {
  return dictionaries[await getLocale()]();
}

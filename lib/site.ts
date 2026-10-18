import type { Dictionary } from "@/content/en";

// Single source for contact details and the primary route list.
export const site = {
  name: "Nova",
  url: "https://nova.studio",
  email: "hello@nova.studio",
  telegram: { handle: "@nova_studio", href: "https://t.me/nova_studio" },
  // Placeholder number, shown for both phone and WhatsApp.
  phone: { display: "+98 21 0000 0000", href: "tel:+982100000000" },
  whatsapp: { display: "+98 21 0000 0000", href: "https://wa.me/982100000000" },
} as const;

export type NavKey = keyof Dictionary["nav"]["links"];

/** The four primary pages, in nav order. `path` is locale-less; use localePath(). */
export const navRoutes = [
  { key: "services", path: "/services" },
  { key: "work", path: "/work" },
  { key: "about", path: "/about" },
  { key: "contact", path: "/contact" },
] as const satisfies readonly { key: NavKey; path: string }[];

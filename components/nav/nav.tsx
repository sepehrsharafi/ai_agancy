import type { Dictionary } from "@/content/en";
import type { Locale } from "@/lib/locale";
import { NavIsland } from "./nav-island";

/** Global navigation. Passes the island only the strings it renders. */
export function Nav({ t, locale }: { t: Dictionary; locale: Locale }) {
  return <NavIsland locale={locale} t={t.nav} langSwitch={t.langSwitch} />;
}

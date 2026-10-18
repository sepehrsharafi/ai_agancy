"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Languages } from "lucide-react";
import { cn } from "@/lib/cn";
import { localePath, otherLocale, type Locale } from "@/lib/locale";
import { LinkPending } from "./link-pending";

type LangSwitchProps = {
  locale: Locale;
  /** The OTHER language's name in its own script ("فارسی" on /en, "English" on /fa). */
  label: string;
  ariaLabel: string;
  /** "pill" is the compact link; "row" is the full-width menu row with a languages icon at the end. */
  variant?: "pill" | "row";
  className?: string;
  onClick?: () => void;
};

const VARIANTS = {
  pill: "inline-flex h-10 items-center px-3 text-body leading-none font-medium text-ink",
  row: "flex h-11 items-center justify-between gap-4 px-3 text-body leading-none font-medium text-ink-soft",
} satisfies Record<NonNullable<LangSwitchProps["variant"]>, string>;

/** Links to the same page in the other language. Both locales share one root layout, so this is a full navigation. */
export function LangSwitch({ locale, label, ariaLabel, variant = "pill", className, onClick }: LangSwitchProps) {
  const pathname = usePathname();
  const target = otherLocale(locale);
  const href = localePath(target, pathname.replace(/^\/(?:en|fa)(?=\/|$)/, ""));

  return (
    <Link
      href={href}
      hrefLang={target}
      prefetch={false}
      aria-label={ariaLabel}
      onClick={onClick}
      className={cn(
        "rounded-pill transition-colors duration-300 ease-out hover:bg-paper focus-visible:bg-paper",
        VARIANTS[variant],
        className,
      )}
    >
      <span lang={target}>{label}</span>
      {variant === "row" && <Languages aria-hidden="true" className="size-4 shrink-0" />}
      <LinkPending />
    </Link>
  );
}

import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/cn";

type Variant = "ink" | "ultra" | "outline" | "text";
type Size = "md" | "sm";

// Base look and the colours of the fill that wipes in on hover/focus. The fill carries a
// copy of the label in its own colour, so the text flips exactly at the wipe edge.
const VARIANTS = {
  ink: { base: "bg-ink text-white", fill: "bg-ultra text-white" },
  ultra: { base: "bg-ultra text-white", fill: "bg-ink text-white" },
  outline: { base: "text-ink inset-ring-1 inset-ring-ink", fill: "bg-ink text-white" },
  text: { base: "text-ink", fill: "" },
} satisfies Record<Variant, { base: string; fill: string }>;

const SIZES = {
  md: "h-12 px-6",
  sm: "h-10 px-5",
} satisfies Record<Size, string>;

// Slides 4px in the reading direction; the glyph itself mirrors in RTL.
function Arrow() {
  return (
    <svg
      viewBox="0 0 16 16"
      aria-hidden="true"
      className="size-4 shrink-0 scale-x-(--dir) translate-x-0 fill-none stroke-current stroke-[1.75] transition-[translate] duration-500 ease-out group-hover/btn:translate-x-(--arrow-shift) group-focus-visible/btn:translate-x-(--arrow-shift)"
    >
      <path d="M2.5 8h11M9 3.5 13.5 8 9 12.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

const CONTENT = "inline-flex items-center justify-center gap-2 font-semibold leading-none whitespace-nowrap";

type ButtonLinkProps = Omit<ComponentProps<"a">, "href" | "children"> & {
  href: string;
  children: ReactNode;
  variant?: Variant;
  size?: Size;
  /** Trailing arrow. On by default. */
  arrow?: boolean;
};

/**
 * Link styled as a pill (ink / ultra / outline) or a text-arrow link. Internal paths
 * (starting with "/") use next/link; anything else (mailto:, tel:, https:) is a plain <a>.
 * Pass locale-prefixed hrefs, e.g. localePath(locale, "/contact").
 */
export function ButtonLink({
  href,
  children,
  variant = "ink",
  size = "md",
  arrow = true,
  className,
  ...rest
}: ButtonLinkProps) {
  const Tag = href.startsWith("/") ? Link : "a";
  const { base, fill } = VARIANTS[variant];
  const label = (
    <>
      {children}
      {arrow && <Arrow />}
    </>
  );

  if (variant === "text") {
    return (
      <Tag
        href={href}
        className={cn("group/btn relative pb-1.5", CONTENT, base, className)}
        {...rest}
      >
        {label}
        <span aria-hidden="true" className="absolute inset-x-0 bottom-0 h-px bg-ink" />
        <span
          aria-hidden="true"
          className="wipe absolute inset-x-0 bottom-0 h-0.5 bg-ultra group-hover/btn:wipe-on group-focus-visible/btn:wipe-on"
        />
      </Tag>
    );
  }

  return (
    <Tag
      href={href}
      className={cn(
        "group/btn relative isolate overflow-hidden rounded-pill",
        CONTENT,
        SIZES[size],
        base,
        className,
      )}
      {...rest}
    >
      {label}
      <span
        aria-hidden="true"
        className={cn(
          "wipe absolute inset-0 select-none",
          CONTENT,
          fill,
          "group-hover/btn:wipe-on group-focus-visible/btn:wipe-on",
        )}
      >
        {label}
      </span>
    </Tag>
  );
}

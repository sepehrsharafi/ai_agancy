import { Bot } from "lucide-react";
import Link from "next/link";
import { FlowInView } from "@/components/flow/flow-inview";
import { IconTile } from "@/components/icon-tile";
import { Shape } from "@/components/shape";
import { cn } from "@/lib/cn";
import { SERVICE_ICONS, type ServiceIcon } from "@/lib/service-icons";

// Full class names so Tailwind sees every utility. The card reads its two colours from
// custom properties: the tint it rests on, and the solid the deeper tint is mixed from.
const TINT = {
  haze: "[--svc-tint:var(--color-haze)]",
  mist: "[--svc-tint:var(--color-mist)]",
  butter: "[--svc-tint:var(--color-butter)]",
} satisfies Record<ServiceIcon["tint"], string>;

const SOLID = {
  ultra: "[--svc-solid:var(--color-ultra)]",
  mint: "[--svc-solid:var(--color-mint)]",
  sun: "[--svc-solid:var(--color-sun)]",
} satisfies Record<ServiceIcon["solid"], string>;

// White on ultra, ink on mint and sun: the contrast the colours were picked for.
const GLYPH_INK = {
  ultra: "text-white",
  mint: "text-ink",
  sun: "text-ink",
} satisfies Record<ServiceIcon["solid"], string>;

// What the glyph becomes while the card is active (`svc-on:` = hover on a fine pointer,
// keyboard focus anywhere, or the card in view on touch; see home-sections.css). Every
// service rests as a circle and morphs to its own shape; the icon drifts to stay optically
// centred in the new shape (the quarter's mass sits toward its sharp corner, the arch's
// toward its flat edge) and tilts a few degrees. Rotation and x-drift are multiplied by
// --dir so RTL mirrors them.
const MORPH: Record<string, { shape: string; icon: string }> = {
  assistant: {
    shape: "svc-on:shape-arch",
    icon: "svc-on:translate-y-0.5 svc-on:rotate-[calc(var(--dir)*-8deg)]",
  },
  workflows: {
    shape: "svc-on:shape-square",
    icon: "svc-on:rotate-[calc(var(--dir)*8deg)]",
  },
  support: {
    shape: "svc-on:shape-leaf",
    icon: "svc-on:rotate-[calc(var(--dir)*-8deg)]",
  },
  knowledge: {
    shape: "svc-on:shape-quarter",
    icon: "svc-on:translate-x-[calc(var(--dir)*0.25rem)] svc-on:translate-y-1 svc-on:rotate-[calc(var(--dir)*8deg)]",
  },
  documents: {
    shape: "svc-on:shape-square svc-on:shape-r-90",
    icon: "svc-on:rotate-[calc(var(--dir)*-8deg)]",
  },
  training: {
    shape: "svc-on:shape-arch svc-on:shape-r-180",
    icon: "svc-on:-translate-y-0.5 svc-on:rotate-[calc(var(--dir)*8deg)]",
  },
};

const CHIP = "flex h-7 min-w-0 max-w-full items-center rounded-pill bg-white px-3 text-[0.8125rem] font-medium whitespace-nowrap text-ink";

type ServiceCardProps = {
  /** Service id; picks the icon and colours from lib/service-icons. */
  id: string;
  title: string;
  description: string;
  examples: readonly string[];
  /** Accessible name for the examples list ("For example"). */
  examplesLabel: string;
  /** Locale-prefixed destination, e.g. localePath(locale, `/services#${id}`). */
  href: string;
  className?: string;
};

/**
 * A card that rests on a light tint. One header row: a 3rem glyph (a circle in the
 * service's solid colour with its icon on it), the title, and an arrow. When the card is
 * active the glyph morphs to the service's own shape, its icon tilts, the arrow slides and
 * the tint deepens a little. Nothing changes size and nothing is clipped, so it is all
 * transforms and one background-colour fade; only the glyph is promoted up front, so no
 * layer is created lazily on the first hover. The title is a stretched link, so the whole
 * card is one target with one short accessible name. The first example chip carries a tiny
 * flow hint: that example, a wire, the agent that does it.
 */
export function ServiceCard({ id, title, description, examples, examplesLabel, href, className }: ServiceCardProps) {
  const key = id in SERVICE_ICONS ? id : "assistant";
  const { icon: Icon, tint, solid } = SERVICE_ICONS[key];
  const morph = MORPH[key];
  const [first, ...rest] = examples;

  return (
    <article
      className={cn(
        "group/card relative isolate flex h-full flex-col rounded-card p-6 text-ink sm:p-8",
        "bg-(--svc-tint) transition-colors duration-500 ease-out svc-on:bg-[color-mix(in_oklab,var(--svc-tint),var(--svc-solid)_18%)]",
        "has-focus-visible:outline-2 has-focus-visible:outline-offset-3 has-focus-visible:outline-ink",
        TINT[tint],
        SOLID[solid],
        className,
      )}
    >
      {/* Touch trigger: carries data-inview while the card is on screen. Empty and decorative. */}
      <FlowInView className="pointer-events-none absolute inset-0">{null}</FlowInView>
      <div className="flex items-center gap-4">
        <span className="relative size-12 shrink-0">
          <Shape shape="circle" color={solid} className={cn("size-full will-change-transform", morph.shape)} />
          <Icon
            size={20}
            strokeWidth={1.75}
            absoluteStrokeWidth
            aria-hidden="true"
            className={cn(
              "absolute inset-0 m-auto will-change-transform",
              "transition-[translate,rotate] delay-75 duration-700 ease-spring",
              GLYPH_INK[solid],
              morph.icon,
            )}
          />
        </span>
        <h3 className="min-w-0 flex-1 font-display text-h3">
          <Link href={href} className="after:absolute after:inset-0 focus-visible:outline-none">
            {title}
          </Link>
        </h3>
        <svg
          viewBox="0 0 16 16"
          aria-hidden="true"
          className="size-6 shrink-0 translate-x-0 scale-x-(--dir) fill-none stroke-current stroke-[1.75] transition-[translate] duration-500 ease-out svc-on:translate-x-(--arrow-shift)"
        >
          <path d="M2.5 8h11M9 3.5 13.5 8 9 12.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      <p className="mt-4 text-current/75">{description}</p>
      <div className="mt-auto pt-5">
        <ul aria-label={examplesLabel} className="flex flex-wrap items-center gap-2">
          {first && (
            <li className="flex max-w-full items-center">
              <span className={CHIP}>
                <span className="truncate">{first}</span>
              </span>
              <span aria-hidden="true" className="h-0.5 w-4 shrink-0 bg-current/30" />
              <IconTile icon={Bot} tone="agent" size="sm" />
            </li>
          )}
          {rest.map((example) => (
            <li key={example} className={CHIP}>
              <span className="truncate">{example}</span>
            </li>
          ))}
        </ul>
      </div>
    </article>
  );
}

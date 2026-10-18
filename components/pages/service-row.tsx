import { Clock } from "lucide-react";
import { FlowInView } from "@/components/flow/flow-inview";
import { Shape, type ShapeColor, type ShapeName } from "@/components/shape";
import type { Dictionary } from "@/content/en";
import { cn } from "@/lib/cn";
import { SERVICE_ICONS } from "@/lib/service-icons";

type Service = Dictionary["services"]["items"][number];
type Labels = Pick<Dictionary["services"], "examplesLabel" | "fitLabel" | "timelineLabel">;

// Full class names so Tailwind can see every utility. Tones cycle ultra, mint, sun; the
// glyph and the accent bar take the solid colour and the border a 40% wash of it on hover.
// Ultra carries a white icon, mint and sun an ink one.
const TONES = [
  { shape: "ultra", icon: "text-white", bar: "bg-ultra", border: "fine-hover:border-ultra/40" },
  { shape: "mint", icon: "text-ink", bar: "bg-mint", border: "fine-hover:border-mint/40" },
  { shape: "sun", icon: "text-ink", bar: "bg-sun", border: "fine-hover:border-sun/40" },
] as const satisfies readonly { shape: ShapeColor; icon: string; bar: string; border: string }[];

// Each card's glyph shape and what it morphs into while the card is active (hovered on a
// fine pointer, in view on touch).
const GLYPHS = [
  { shape: "circle", morph: "card-on:shape-arch card-on:shape-r-90" },
  { shape: "square", morph: "card-on:shape-leaf card-on:shape-r-90" },
  { shape: "arch", morph: "card-on:shape-r-180" },
  { shape: "leaf", morph: "card-on:shape-circle card-on:shape-r-90" },
  { shape: "quarter", morph: "card-on:shape-leaf card-on:shape-r-90" },
  { shape: "circle", morph: "card-on:shape-arch card-on:shape-r-90" },
] as const satisfies readonly { shape: ShapeName; morph: string }[];

type Props = {
  service: Service;
  labels: Labels;
  /** Zero-based place in the list: picks the tone and the glyph shape. */
  position: number;
  /** "01".."06", already formatted for the locale. */
  indexLabel: string;
};

/**
 * One service as a card, one layout at every width. The header is a single row: glyph,
 * title with the typical timeline as a one-line kicker, index at the end. Below it the
 * description and a spec sheet (examples, good fit) stack on phones and sit side by side
 * from lg. A 4px bar in the tone colour runs along the start edge; while the card is active
 * it grows to the full card height and the glyph morphs. Active means hovered or focused on
 * a fine pointer, or in view on touch (`card-on:`, driven by the empty FlowInView). Only
 * transform and colour animate, and the bar declares its layer up front so the first hover
 * does not flicker inside the rounded clip.
 */
export function ServiceRow({ service, labels, position, indexLabel }: Props) {
  const { id, title, description, examples, fit, timeline } = service;
  const Icon = SERVICE_ICONS[id].icon;
  const tone = TONES[position % TONES.length];
  const glyph = GLYPHS[position % GLYPHS.length];

  return (
    <article
      id={id}
      aria-labelledby={`${id}-title`}
      className={cn(
        "group/svc relative scroll-mt-4 overflow-clip rounded-card border border-line bg-white p-6 transition-[border-color] duration-300 ease-out md:p-8 lg:p-10",
        tone.border,
      )}
    >
      <FlowInView className="pointer-events-none absolute inset-0">{null}</FlowInView>
      {/* Rests inset from the corners; 1.4x covers the whole edge at any card height and the
          card's rounded clip trims the overshoot. */}
      <span
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute inset-y-6 start-0 w-1 origin-center rounded-pill transition-transform duration-700 ease-spring will-change-transform card-on:scale-y-140",
          tone.bar,
        )}
      />

      <header className="flex items-start gap-4">
        {/* 48px shape with the icon centred on top; only the shape morphs. */}
        <div className="relative grid size-12 shrink-0 place-items-center">
          <Shape shape={glyph.shape} color={tone.shape} className={cn("absolute inset-0 size-full", glyph.morph)} />
          <Icon aria-hidden="true" className={cn("relative size-5", tone.icon)} />
        </div>
        <div className="min-w-0 flex-1">
          <h2 id={`${id}-title`} className="font-display text-h3 text-ink">
            {title}
          </h2>
          <p className="mt-1 flex items-center gap-1.5 text-label font-medium tabular-nums text-ink-soft">
            <Clock aria-hidden="true" className="size-3.5 shrink-0" />
            <span className="sr-only">{labels.timelineLabel}: </span>
            {timeline}
          </p>
        </div>
      </header>

      <div className="mt-6 grid gap-6 lg:mt-8 lg:grid-cols-12 lg:gap-x-gridgap">
        <p className="max-w-[60ch] text-body text-ink-soft lg:col-span-7 lg:pe-6">{description}</p>

        <dl className="divide-y divide-line border-y border-line lg:col-span-5">
          <div className="py-3">
            <dt className="label text-ink-soft">{labels.examplesLabel}</dt>
            <dd>
              <ul className="mt-2 flex flex-wrap gap-1.5">
                {examples.map((example) => (
                  <li
                    key={example}
                    className="inline-flex h-7 max-w-full items-center rounded-pill bg-paper px-3 text-[0.8125rem] leading-none font-medium whitespace-nowrap text-ink"
                  >
                    <span className="">{example}</span>
                  </li>
                ))}
              </ul>
            </dd>
          </div>
          <div className="py-3">
            <dt className="label text-ink-soft">{labels.fitLabel}</dt>
            <dd className="mt-1.5 text-ink">{fit}</dd>
          </div>
        </dl>
      </div>
    </article>
  );
}

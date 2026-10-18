"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type CSSProperties, type KeyboardEvent, type ReactNode } from "react";
import { ButtonLink } from "@/components/button-link";
import { Shape } from "@/components/shape";
import { cn } from "@/lib/cn";
import { formatNumber, localePath, type Locale } from "@/lib/locale";

type Agent = { name: string; description: string; hours: number };
type Segment = { id: string; label: string; description: string; agents: readonly Agent[] };

type Props = {
  segments: readonly Segment[];
  locale: Locale;
  /** Accessible name of the tab list. */
  listLabel: string;
  timeBack: string;
  /** Template with {n}. */
  hoursPerWeek: string;
  /** Template with {n}. */
  total: string;
  /** Template with {n}: working days a month. */
  days: string;
  /** Shown instead of the total when every card is off. */
  none: string;
  /** Template with {n}: the short "about N working days a month" line in the bar. */
  daysShort: string;
  /** The bar's own hint when every card is off. */
  pick: string;
  pickHint: string;
  cta: string;
  note: string;
  className?: string;
};

const ROW = 4; // rem. Must match the block-size of `audience-tab` on desktop.
const PANEL_ID = "audience-panel";
const NONE: readonly number[] = [];
const tabId = (id: string) => `audience-tab-${id}`;

// Segments cycle ultra, mint, sun. The tone colours the marker and the total's block;
// the tint is the field the agent cards sit on. Full class names so Tailwind sees them.
const TONES = ["ultra", "mint", "sun"] as const;
type Tone = (typeof TONES)[number];
const TINT = { ultra: "bg-haze", mint: "bg-mist", sun: "bg-butter" } satisfies Record<Tone, string>;
const MARK = {
  ultra: "bg-ultra text-white",
  mint: "bg-mint text-ink",
  sun: "bg-sun text-ink",
} satisfies Record<Tone, string>;

// The days line joins the bar once the bar is wide enough (it is its own container). Full class
// names so Tailwind sees them.
const DAYS_AT = "@[42rem]:flex";

const DOT = { ultra: "bg-ultra", mint: "bg-mint", sun: "bg-sun" } satisfies Record<Tone, string>;

// A working day is 8 hours, a month is 4.3 weeks.
const workingDays = (hoursPerWeek: number) => Math.round((hoursPerWeek * 4.3) / 8);

// A number (Latin, Persian or Arabic-Indic digits, with separators). Split on it, the odd
// entries are numbers and the rest are unit words.
const DIGITS = "\\d\\u06F0-\\u06F9\\u0660-\\u0669";
const NUMBER = new RegExp(`([${DIGITS}]+(?:[,.\\u066B\\u066C][${DIGITS}]+)*)`);

/** "6 h / week" / "۶ ساعت در هفته": the number bold, the unit words smaller and softer. Never wraps. */
function Amount({ text }: { text: string }) {
  return (
    <span className="audience-amount">
      {text.split(NUMBER).map((part, k) =>
        part.trim() === "" ? null : (
          <span key={k} className={k % 2 ? "audience-amount-num" : "audience-amount-unit"}>
            {part}
          </span>
        ),
      )}
    </span>
  );
}

/** The live value over an invisible copy of the widest one: the slot never changes size. */
function Slot({ widest, align, children }: { widest: ReactNode; align?: "end"; children: ReactNode }) {
  return (
    <span className="audience-slot" data-align={align}>
      <span aria-hidden="true">{widest}</span>
      {children}
    </span>
  );
}

/** The bar's call to action: a circle on narrow bars, an ultra pill with the label from 36rem up. */
function BarCta({ href, label, disabled }: { href: string; label: string; disabled: boolean }) {
  return (
    <Link
      href={href}
      aria-label={label}
      aria-disabled={disabled || undefined}
      tabIndex={disabled ? -1 : undefined}
      onClick={disabled ? (event) => event.preventDefault() : undefined}
      className={cn(
        "group/btn hidden shrink-0 items-center justify-center gap-2 rounded-pill text-label font-semibold tracking-normal whitespace-nowrap transition-colors duration-300 ease-out @[22rem]:inline-flex @[22rem]:size-10 @[36rem]:h-12 @[36rem]:w-auto @[36rem]:px-6",
        disabled
          ? "pointer-events-none bg-white/10 text-white/30"
          : "bg-ultra text-white hover:bg-white hover:text-ink focus-visible:bg-white focus-visible:text-ink",
      )}
    >
      <span className="hidden @[36rem]:inline">{label}</span>
      <svg
        viewBox="0 0 16 16"
        aria-hidden="true"
        className="size-4 shrink-0 scale-x-(--dir) fill-none stroke-current stroke-[1.75]"
      >
        <path d="M2.5 8h11M9 3.5 13.5 8 9 12.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </Link>
  );
}

type ContentProps = Pick<
  Props,
  "locale" | "timeBack" | "hoursPerWeek" | "total" | "days" | "daysShort" | "none" | "pick" | "pickHint" | "cta" | "note"
> & {
  segment: Segment;
  tone: Tone;
  /** Indexes of the agents switched off. Only the live copy ever has any. */
  off: readonly number[];
  onToggle: (index: number) => void;
  /** The largest total any segment can reach. */
  widest: number;
  /** The visible copy. The others are invisible, inert sizers (see AudiencePicker). */
  live: boolean;
};

/** One segment's description, agent cards, total and call to action. */
function SegmentContent({
  segment,
  tone,
  off,
  onToggle,
  widest,
  live,
  locale,
  timeBack,
  hoursPerWeek,
  total,
  days,
  daysShort,
  none,
  pick,
  pickHint,
  cta,
  note,
}: ContentProps) {
  // Only the live copy plays the staggered entrance.
  const enter = live ? "audience-in" : undefined;
  const sum = segment.agents.reduce((acc, agent, i) => (off.includes(i) ? acc : acc + agent.hours), 0);
  const anyOn = off.length < segment.agents.length;
  const [totalBefore, totalAfter = ""] = total.split("{n}");
  const [daysBefore, daysAfter = ""] = days.split("{n}");
  const [shortBefore, shortAfter = ""] = daysShort.split("{n}");
  const contact = localePath(locale, "/contact");
  // The figures below reserve the widest total's width, so a pick that changes the number
  // never changes the layout.
  const widestAmount = <Amount text={hoursPerWeek.replace("{n}", formatNumber(locale, widest))} />;

  return (
    <div
      className={cn("col-start-1 row-start-1", !live && "invisible")}
      {...(live ? {} : { "aria-hidden": true, inert: true })}
    >
      <p className={cn(enter, "max-w-xl text-lede")} style={{ "--i": 0 } as CSSProperties}>
        {segment.description}
      </p>
      <p
        className={cn(enter, "mt-8 text-label font-medium tracking-normal text-ink-soft")}
        style={{ "--i": 1 } as CSSProperties}
      >
        {pickHint}
      </p>

      <ul className="mt-4 flex flex-col gap-3">
        {segment.agents.map((agent, i) => {
          const on = !off.includes(i);
          return (
            <li key={agent.name} className={enter} style={{ "--i": i + 2 } as CSSProperties}>
              <button
                type="button"
                aria-pressed={on}
                onClick={() => onToggle(i)}
                className={cn(
                  "flex w-full items-start justify-between gap-6 rounded-card border-2 bg-white p-5 text-start transition-opacity duration-300 ease-out sm:p-6",
                  on ? "border-ink" : "border-dashed border-ink/50 opacity-55 hover:opacity-80",
                )}
              >
                <span className="block min-w-0 max-w-xl flex-1">
                  <span className="block font-display text-h3">{agent.name}</span>
                  <span className="mt-2 block text-ink-soft">{agent.description}</span>
                  {/* Label above value on phones, side by side from 640px. The value never wraps. */}
                  <span className="mt-4 flex flex-col gap-1 sm:flex-row sm:items-baseline sm:gap-3">
                    <span className="label text-ink-soft">{timeBack}</span>
                    <span className="text-[1.125rem] leading-snug font-semibold">
                      <Amount text={hoursPerWeek.replace("{n}", formatNumber(locale, agent.hours))} />
                    </span>
                  </span>
                </span>
                {/* The check: a square that morphs to a circle when the card is on. */}
                <span aria-hidden="true" className="relative size-6 shrink-0">
                  <Shape
                    shape={on ? "circle" : "square"}
                    color={on ? "ink" : "white"}
                    className={cn("size-full inset-ring-2", on ? "inset-ring-ink" : "inset-ring-ink/40")}
                  />
                  <svg
                    viewBox="0 0 24 24"
                    className={cn(
                      "absolute inset-0 size-full fill-none stroke-white stroke-2 transition-opacity duration-300 ease-out",
                      on ? "opacity-100" : "opacity-0",
                    )}
                  >
                    <path d="m7 12.5 3.5 3.5L17 9" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
              </button>
            </li>
          );
        })}
        {/* The total rides along while the cards scroll, on every screen size. Sticky inside the
            list, so it pins to the viewport bottom over the cards and comes to rest at the end
            of the list. Its figures are hidden from assistive tech (the status sentence below
            carries them); the call to action stays reachable. Every figure has a fixed-width
            slot, so no toggle ever resizes it. */}
        <li
          className={cn(enter, "@container sticky bottom-4 z-10 lg:bottom-6")}
          style={{ "--i": segment.agents.length + 2 } as CSSProperties}
        >
          <div className="audience-bar mx-auto flex h-14 w-full max-w-176 items-center gap-3 rounded-pill bg-ink ps-5 pe-5 text-white @[22rem]:pe-2 @[36rem]:h-16 @[36rem]:ps-6">
            <div aria-hidden="true" className="grid min-w-0 flex-1 *:col-start-1 *:row-start-1">
              <div className={cn("flex min-w-0 items-center gap-2.5", !anyOn && "invisible")}>
                <span className={cn("size-2.5 shrink-0 rounded-full", DOT[tone])} />
                <span className="label min-w-0 truncate whitespace-nowrap text-white/70">{timeBack}</span>
                <span className="ms-auto shrink-0 text-base leading-none font-semibold">
                  <Slot widest={widestAmount} align="end">
                    <span key={sum} className="audience-total-mark">
                      <Amount text={hoursPerWeek.replace("{n}", formatNumber(locale, sum))} />
                    </span>
                  </Slot>
                </span>
                <span className={cn("ms-3 hidden shrink-0 items-center gap-4 whitespace-nowrap", DAYS_AT)}>
                  <span className="h-6 w-px bg-white/15" />
                  <span className="text-label font-medium tracking-normal text-white/60">
                    {shortBefore}
                    <Slot widest={formatNumber(locale, workingDays(widest))}>
                      <span>{formatNumber(locale, workingDays(sum))}</span>
                    </Slot>
                    {shortAfter}
                  </span>
                </span>
              </div>
              {/* Same cell, no say in the width: it only fills what the figures use. */}
              <div className={cn("flex w-0 min-w-full items-center gap-2.5", anyOn && "invisible")}>
                <span className="size-2.5 shrink-0 rounded-full bg-white/30" />
                <span className="label min-w-0 truncate whitespace-nowrap text-white/80">{pick}</span>
              </div>
            </div>
            <BarCta href={contact} label={cta} disabled={!anyOn} />
          </div>
        </li>
      </ul>

      {/* Both states share one grid cell and the hidden one keeps its room, so switching
          every card off (or on) never moves what is below. */}
      <div
        role={live ? "status" : undefined}
        className={cn(
          enter,
          "mt-10 grid border-t border-ink/15 pt-8 max-lg:mt-8 max-lg:pt-6 lg:sr-only *:col-start-1 *:row-start-1",
        )}
        style={{ "--i": segment.agents.length + 2 } as CSSProperties}
      >
        <div className={anyOn ? undefined : "invisible"}>
          <p className="sr-only">
            {totalBefore}
            <Slot widest={formatNumber(locale, widest)}>
              <span key={sum} className={cn("audience-total-mark", MARK[tone])}>
                {formatNumber(locale, sum)}
              </span>
            </Slot>
            {totalAfter}
          </p>
          <p className="text-lede">
            {daysBefore}
            <Slot widest={formatNumber(locale, workingDays(widest))}>
              <span>{formatNumber(locale, workingDays(sum))}</span>
            </Slot>
            {daysAfter}
          </p>
        </div>
        <p className={cn("font-display text-h3 text-ink-soft", anyOn && "invisible")}>{none}</p>
      </div>

      <div className={cn(enter, "mt-8 flex flex-col gap-6 lg:mt-6")} style={{ "--i": segment.agents.length + 3 } as CSSProperties}>
        <div className="lg:hidden">
          <ButtonLink href={contact} variant="text">
            {cta}
          </ButtonLink>
        </div>
        <p className="max-w-xl text-label font-medium tracking-normal text-ink-soft">{note}</p>
      </div>
    </div>
  );
}

/**
 * A small tool: pick a segment, then switch the agents you would want on or off and the
 * total time back follows. Switching segment remounts the live content for the staggered
 * entrance and turns every card back on. The other segments sit in the same grid cell as
 * invisible, inert copies, so the panel is always as tall as the tallest segment and
 * switching never moves what follows the section.
 */
export function AudiencePicker({ segments, locale, listLabel, className, ...labels }: Props) {
  const [active, setActive] = useState(0);
  // Indexes of the agents switched off in the active segment.
  const [off, setOff] = useState<readonly number[]>([]);
  const panelRef = useRef<HTMLDivElement>(null);

  // The bar fades up once, the first time the panel scrolls into view. The page renders
  // with the bar visible; this arms the entrance only when JS runs, the panel is still below
  // the fold and motion is welcome, and plain rect maths (not an observer) releases it, so
  // the bar can never stay hidden.
  useEffect(() => {
    const panel = panelRef.current;
    if (!panel || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const reached = () => panel.getBoundingClientRect().top < window.innerHeight - 120;
    if (reached()) return;
    panel.dataset.bar = "armed";
    const stop = () => {
      window.removeEventListener("scroll", check);
      window.removeEventListener("resize", check);
    };
    function check() {
      if (!reached() || !panel) return;
      panel.dataset.bar = "shown";
      stop();
    }
    window.addEventListener("scroll", check, { passive: true });
    window.addEventListener("resize", check);
    return stop;
  }, []);

  const segment = segments[active];
  const tone = TONES[active % TONES.length];
  // The largest total any segment can reach.
  const widest = Math.max(...segments.map((s) => s.agents.reduce((acc, agent) => acc + agent.hours, 0)));

  function select(index: number) {
    if (index === active) return;
    setActive(index);
    setOff([]);
  }

  function toggle(index: number) {
    setOff((current) => (current.includes(index) ? current.filter((i) => i !== index) : [...current, index]));
  }

  // Automatic activation: arrows move focus and selection together. Left/right swap in RTL.
  function onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    const rtl = locale === "fa";
    const forward = event.key === "ArrowDown" || event.key === (rtl ? "ArrowLeft" : "ArrowRight");
    const back = event.key === "ArrowUp" || event.key === (rtl ? "ArrowRight" : "ArrowLeft");
    let next: number;
    if (forward) next = (active + 1) % segments.length;
    else if (back) next = (active - 1 + segments.length) % segments.length;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = segments.length - 1;
    else return;

    event.preventDefault();
    select(next);
    event.currentTarget.querySelectorAll<HTMLElement>('[role="tab"]')[next]?.focus();
  }

  return (
    <div className={cn("grid-swiss gap-y-10", className)}>
      <div className="col-span-full lg:col-span-5">
        <div role="tablist" aria-label={listLabel} onKeyDown={onKeyDown} className="audience-tabs">
          <span aria-hidden="true" className="pointer-events-none absolute inset-s-0 top-6.5 hidden size-3 lg:block">
            <Shape shape="circle" color={tone} className="size-full" style={{ translate: `0 ${active * ROW}rem` }} />
          </span>
          {segments.map((s, i) => (
            <button
              key={s.id}
              id={tabId(s.id)}
              type="button"
              role="tab"
              data-tone={TONES[i % TONES.length]}
              aria-selected={i === active}
              aria-controls={PANEL_ID}
              tabIndex={i === active ? 0 : -1}
              onClick={() => select(i)}
              className="audience-tab"
            >
              <span aria-hidden="true" data-ghost className="audience-ghost" />
              {s.label}
            </button>
          ))}
        </div>
      </div>

      <div
        ref={panelRef}
        id={PANEL_ID}
        role="tabpanel"
        tabIndex={0}
        aria-labelledby={tabId(segment.id)}
        className={cn(
          "col-span-full rounded-card p-6 transition-colors duration-500 ease-out sm:p-8 lg:col-span-7 lg:p-10",
          TINT[tone],
        )}
      >
        <div className="grid">
          {segments.map((s, i) => (
            <SegmentContent
              key={s.id}
              segment={s}
              tone={TONES[i % TONES.length]}
              off={i === active ? off : NONE}
              onToggle={toggle}
              widest={widest}
              live={i === active}
              locale={locale}
              {...labels}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

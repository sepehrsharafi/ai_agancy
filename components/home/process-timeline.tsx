"use client";

import { useEffect, useRef, useState, type CSSProperties, type PointerEvent } from "react";

type Step = { title: string; duration: string; description: string };

type Props = {
  steps: readonly Step[];
  /** Step numerals, already formatted for the locale (Persian digits on /fa). */
  numerals: readonly string[];
};

/*
 * The bar is to scale: 1 week = 12 units of 100. The call is 30 minutes, so it gets a
 * token 4 (a sliver at true scale would vanish). Mapping is 1 week (12). Build is 2-4
 * weeks, drawn at four (48); the range is written in the step's duration. Run takes the
 * rest and never ends. One segment per step, four colours.
 * Class names are written out in full so Tailwind sees them; `numeral` is the colour the
 * step's numeral turns while it is highlighted.
 */
const STEPS = [
  {
    segments: [{ weight: 4, className: "bg-ultra" }],
    border: "border-ultra",
    swatch: "bg-ultra",
    numeral: "ultra",
  },
  {
    segments: [{ weight: 12, className: "bg-sun" }],
    border: "border-sun",
    swatch: "bg-sun",
    numeral: "sun",
  },
  {
    segments: [{ weight: 48, className: "bg-mint" }],
    border: "border-mint",
    swatch: "bg-mint",
    numeral: "mint",
  },
  {
    segments: [{ weight: 36, className: "process-run" }],
    border: "border-ink",
    swatch: "bg-ink",
    numeral: "ink",
  },
];

const BAR_SEGMENTS = STEPS.flatMap((step, stepIndex) =>
  step.segments.map((segment) => ({ ...segment, stepIndex })),
);
const TRACKS = BAR_SEGMENTS.map((segment) => `${segment.weight}fr`).join(" ");

const REDUCED = "(prefers-reduced-motion: reduce)";
const DESKTOP = "(min-width: 64rem)";
// Below lg the step whose box has crossed this share of the viewport height is the active one.
const LINE = 0.45;

/**
 * Which step is active for the current scroll position, or null when the timeline is off
 * screen. Rect maths only: the last step whose top has crossed the line (the first one
 * until any has), while any part of the timeline is in the viewport.
 */
function stepAtLine(root: HTMLElement): number | null {
  const vh = window.innerHeight;
  const { top, bottom } = root.getBoundingClientRect();
  if (bottom <= 0 || top >= vh) return null;
  const line = vh * LINE;
  let current = 0;
  root.querySelectorAll("li[data-step]").forEach((el, i) => {
    if (el.getBoundingClientRect().top <= line) current = i;
  });
  return current;
}

/**
 * The timeline: bar on top (a sticky vertical strip on phones), a column per step below.
 * Hovering or focusing a column highlights its bar segment and dims the rest; hovering a
 * segment does the same in reverse; on touch a tap toggles, and scrolling picks the step.
 * The visuals are all CSS keyed on `data-active` (see `process-linked`); this leaf only
 * holds which step is active.
 */
export function ProcessTimeline({ steps, numerals }: Props) {
  const [active, setActive] = useState<number | null>(null);
  const rootRef = useRef<HTMLDivElement>(null);

  // Phones and tablets: scrolling drives the active step, so the strip and the highlight follow
  // the reader. One passive scroll + resize listener, coalesced to a frame, only below lg and
  // only without reduced motion. A tap still sets a step; the next change in the computed step
  // takes over again. Hover and focus keep working on desktop untouched.
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return undefined;
    const desktop = window.matchMedia(DESKTOP);
    const reduced = window.matchMedia(REDUCED);
    let frame = 0;
    let last: number | null | undefined;
    let detach: (() => void) | undefined;

    const run = () => {
      frame = 0;
      const next = stepAtLine(root);
      if (next === last) return;
      last = next;
      setActive(next);
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(run);
    };
    const attach = () => {
      window.addEventListener("scroll", schedule, { passive: true });
      window.addEventListener("resize", schedule, { passive: true });
      schedule();
      return () => {
        window.removeEventListener("scroll", schedule);
        window.removeEventListener("resize", schedule);
        cancelAnimationFrame(frame);
        frame = 0;
      };
    };
    const sync = (reset: boolean) => {
      detach?.();
      detach = undefined;
      last = undefined;
      if (!desktop.matches && !reduced.matches) detach = attach();
      else if (reset) setActive(null);
    };
    const onChange = () => sync(true);

    sync(false);
    desktop.addEventListener("change", onChange);
    reduced.addEventListener("change", onChange);
    return () => {
      detach?.();
      desktop.removeEventListener("change", onChange);
      reduced.removeEventListener("change", onChange);
    };
  }, []);

  // Mouse hovers; touch and pen taps toggle (their emulated hover would fight the tap).
  const hover = (index: number | null) => (event: PointerEvent) => {
    if (event.pointerType === "mouse") setActive(index);
  };
  const tap = (index: number) => (event: PointerEvent) => {
    if (event.pointerType !== "mouse") setActive((current) => (current === index ? null : index));
  };

  return (
    <div
      ref={rootRef}
      className="process-linked mt-14 grid grid-cols-[auto_1fr] gap-x-6 lg:mt-20 lg:grid-cols-1 lg:gap-x-0"
      data-active={active ?? undefined}
      style={{ "--process-tracks": TRACKS } as CSSProperties}
    >
      {/* The scale. Decorative: every duration is also written out in the steps. */}
      <div aria-hidden="true" className="process-bar">
        {BAR_SEGMENTS.map((segment, i) => (
          <span
            key={i}
            data-step={segment.stepIndex}
            className={`process-seg ${segment.className}`}
            style={{ "--i": i } as CSSProperties}
            onPointerEnter={hover(segment.stepIndex)}
            onPointerLeave={hover(null)}
          />
        ))}
      </div>

      <ol className="flex flex-col gap-14 lg:mt-10 lg:grid lg:grid-cols-4 lg:gap-x-4">
        {steps.map((step, i) => (
          <li
            key={step.title}
            tabIndex={0}
            data-step={i}
            data-color={STEPS[i].numeral}
            className={`lg:border-t-4 lg:pt-6 lg:pe-8 ${STEPS[i].border}`}
            onPointerEnter={hover(i)}
            onPointerLeave={hover(null)}
            onPointerUp={tap(i)}
            onFocus={(event) => {
              // Keyboard focus only; a tap also focuses, and the tap handler owns that case.
              if (event.currentTarget.matches(":focus-visible")) setActive(i);
            }}
            onBlur={() => setActive((current) => (current === i ? null : current))}
          >
            <p data-numeral className="font-display text-h2 tabular-nums lg:text-title">
              {numerals[i]}
            </p>
            <h3 className="mt-4 font-display text-h3 lg:mt-6">{step.title}</h3>
            <p className="label mt-3 flex items-center gap-2 text-ink-soft">
              <span aria-hidden="true" className={`size-2.5 lg:hidden ${STEPS[i].swatch}`} />
              {step.duration}
            </p>
            <p className="mt-4 max-w-sm text-ink-soft">{step.description}</p>
          </li>
        ))}
      </ol>
    </div>
  );
}

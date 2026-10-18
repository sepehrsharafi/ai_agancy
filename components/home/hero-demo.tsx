"use client";

import {
  useEffect,
  useId,
  useReducer,
  useRef,
  useState,
  useSyncExternalStore,
  type CSSProperties,
  type KeyboardEvent,
  type ReactNode,
} from "react";
import { Bot, Clock, UserRound } from "lucide-react";
import { IconTile } from "@/components/icon-tile";
import { cn } from "@/lib/cn";
import { dir, formatNumber, type Locale } from "@/lib/locale";

type Step = { text: string; who: string; minutes: number };
type Metric = { label: string; today: string; after: string };

type UseCase = {
  id: string;
  label: string;
  title: string;
  today: readonly Step[];
  after: readonly Step[];
  metrics: readonly Metric[];
};

type Xray = {
  today: string;
  withUs: string;
  total: string;
  agent: string;
  min: string;
  hour: string;
  and: string;
  none: string;
  collapsed: string;
};

type Props = {
  locale: Locale;
  /** Accessible name for the whole demo. */
  label: string;
  xray: Xray;
  useCases: readonly UseCase[];
};

/* ------------------------------------------------------------------ config */

/*
 * One case plays as two steps: how it works today (0), then with Nova (1). DURATIONS[s]
 * is how long autoplay waits in step s before moving on; after "with Nova" the next case
 * (and its tab) takes over.
 */
const DURATIONS = [2400, 4200] as const;
const CASE_MS = DURATIONS[0] + DURATIONS[1];
const TODAY = 0;
const WITH_US = 1;

type Mode = typeof TODAY | typeof WITH_US;

const sum = (steps: readonly Step[]) => steps.reduce((total, step) => total + step.minutes, 0);

/* ------------------------------------------------------------------- state */

type State = {
  c: number;
  s: Mode;
  /** Autoplay runs until the visitor uses a tab or the switch. */
  auto: boolean;
  /** Has the visitor flipped the switch or picked a tab? (Only then are results announced.) */
  touched: boolean;
};

type Action = { type: "tick"; count: number } | { type: "pick"; c: number; s: Mode } | { type: "flip"; s: Mode };

const initial = (): State => ({ c: 0, s: TODAY, auto: true, touched: false });

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "pick":
      return { c: action.c, s: action.s, auto: false, touched: true };
    case "flip":
      return { ...state, s: action.s, auto: false, touched: true };
    case "tick":
      return state.s === TODAY ? { ...state, s: WITH_US } : { ...state, c: (state.c + 1) % action.count, s: TODAY };
  }
}

/* ------------------------------------------------------- external stores */

const MOTION = "(prefers-reduced-motion: reduce)";

function subscribeMotion(onChange: () => void) {
  const query = window.matchMedia(MOTION);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}
const getReduced = () => window.matchMedia(MOTION).matches;

function subscribeVisibility(onChange: () => void) {
  document.addEventListener("visibilitychange", onChange);
  return () => document.removeEventListener("visibilitychange", onChange);
}
const getHidden = () => document.hidden;

const getServerFalse = () => false;

/** Scroll the tab list just enough that the active tab sits comfortably inside it. */
function revealTab(list: HTMLElement, tab: HTMLElement, smooth: boolean) {
  if (list.scrollWidth <= list.clientWidth) return;
  const start = tab.offsetLeft;
  const end = start + tab.offsetWidth;
  const edge = 16;
  if (start >= list.scrollLeft + edge && end <= list.scrollLeft + list.clientWidth - edge) return;
  list.scrollTo({ left: (start + end - list.clientWidth) / 2, behavior: smooth ? "smooth" : "auto" });
}

// A number (Latin, Persian or Arabic-Indic digits) with its separators and a leading "$" or
// trailing percent sign. Split on it, the odd entries are numbers and the rest are units.
const DIGITS = "\\d\\u06F0-\\u06F9\\u0660-\\u0669";
const NUMBER = new RegExp(`(\\$?[${DIGITS}]+(?:[,.\\u066B\\u066C][${DIGITS}]+)*[%\\u066A]?)`);

/** "1 h 15 min" / "۱ ساعت و ۱۵ دقیقه": the numbers big and bold, the unit words small beside them. */
function Amount({ text }: { text: string }) {
  return (
    <span className="hero-amount">
      {text.split(NUMBER).map((part, k) =>
        part.trim() === "" ? null : (
          <span key={k} className={k % 2 ? "hero-amount-num" : "hero-amount-unit"}>
            {part}
          </span>
        ),
      )}
    </span>
  );
}

/** A figure (see Amount) that counts to its new value over ~500ms, starting after `delay`. */
function CountUp({
  value,
  instant,
  delay,
  format,
}: {
  value: number;
  instant: boolean;
  delay: number;
  format: (n: number) => string;
}) {
  const [shown, setShown] = useState(value);
  const current = useRef(value);

  useEffect(() => {
    if (instant) {
      current.current = value;
      return;
    }
    const from = current.current;
    if (from === value) return;
    const begin = performance.now() + delay;
    const id = window.setInterval(() => {
      const k = Math.min(1, Math.max(0, (performance.now() - begin) / 500));
      const next = Math.round(from + (value - from) * (1 - (1 - k) ** 3));
      current.current = next;
      setShown(next);
      if (k >= 1) window.clearInterval(id);
    }, 50);
    return () => window.clearInterval(id);
  }, [value, instant, delay]);

  return <Amount text={format(instant ? value : shown)} />;
}

/* -------------------------------------------------------- small pieces */

function WhoPill({ who, tone = "paper", className }: { who: string; tone?: "paper" | "glass"; className?: string }) {
  return (
    <span
      className={cn("hero-pill", tone === "paper" ? "bg-paper text-ink-soft" : "bg-white/15 text-white", className)}
    >
      {tone === "paper" ? (
        <UserRound size={12} strokeWidth={2} absoluteStrokeWidth />
      ) : (
        <Bot size={12} strokeWidth={2} absoluteStrokeWidth />
      )}
      {who}
    </span>
  );
}

function TimePill({ text, tone }: { text: string; tone: "butter" | "mint" }) {
  return (
    <span className={cn("hero-pill text-ink", tone === "butter" ? "bg-butter" : "bg-mint")}>
      <Clock size={12} strokeWidth={2} absoluteStrokeWidth />
      {text}
    </span>
  );
}

type RowsProps = { useCase: UseCase; xray: Xray; count: number; fmt: (minutes: number) => string };

/** The steps as they are today: one white node each, collapsing away in "with Nova". */
function TodayRows({ useCase, fmt, collapsed }: Pick<RowsProps, "useCase" | "fmt"> & { collapsed: boolean }) {
  return (
    <ol>
      {useCase.today.map((step, k) => {
        // Under 640px the usual "who" sits in the card header; only rows that differ keep a pill.
        const usual = step.who === useCase.today[0].who;
        return (
          <li
            key={k}
            className="hero-row"
            data-collapsed={collapsed ? "" : undefined}
            style={{ "--i": k } as CSSProperties}
          >
            <div>
              <div className="hero-leg">
                <div className={cn("hero-node", usual && "hero-node-row")}>
                  <span className="hero-step-text min-w-0 flex-1 basis-40">{step.text}</span>
                  <span className="flex flex-wrap gap-1.5">
                    <WhoPill who={step.who} className={usual ? "max-sm:hidden" : undefined} />
                    <TimePill text={fmt(step.minutes)} tone="butter" />
                  </span>
                </div>
              </div>
            </div>
          </li>
        );
      })}
    </ol>
  );
}

/** The agent node, what is left for the human, and the line saying what collapsed. */
function WithRows({ useCase, xray, fmt, open }: Pick<RowsProps, "useCase" | "xray" | "fmt"> & { open: boolean }) {
  const [agent, human] = useCase.after;
  return (
    <div className="hero-with" data-open={open ? "" : undefined}>
      <div>
        <div className="hero-leg flex flex-1 flex-col">
          <div className="hero-node hero-node-agent flex-1">
            <span className="flex items-start gap-3">
              <IconTile icon={Bot} tone="plain" size="md" />
              <span className="pt-1 text-body font-semibold">{agent.text}</span>
            </span>
            <span className="flex flex-wrap gap-1.5">
              <WhoPill who={xray.agent} tone="glass" />
              <span className="hero-pill bg-mint text-ink">
                <Clock size={12} strokeWidth={2} absoluteStrokeWidth />
                {xray.none}
              </span>
            </span>
          </div>
        </div>
        <p className="text-label text-ink-soft">{xray.collapsed.replace("{n}", String(useCase.today.length))}</p>
        <div className="hero-leg">
          <div className="hero-node">
            <span className="hero-step-text min-w-0 flex-1 basis-40">{human.text}</span>
            <span className="flex flex-wrap gap-1.5">
              <WhoPill who={human.who} />
              <TimePill text={fmt(human.minutes)} tone="mint" />
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* --------------------------------------------------------------- component */

export function HeroDemo({ locale, label, xray, useCases }: Props) {
  const uid = useId();
  const [state, dispatch] = useReducer(reducer, undefined, initial);
  const [inView, setInView] = useState(true);
  const reduced = useSyncExternalStore(subscribeMotion, getReduced, getServerFalse);
  const hidden = useSyncExternalStore(subscribeVisibility, getHidden, getServerFalse);

  const rootRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const indicatorRef = useRef<HTMLSpanElement>(null);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  // Time left on the current step's timer when the page paused, so resuming is seamless.
  const remaining = useRef<{ key: string; ms: number } | null>(null);

  const { c, s, auto } = state;
  const count = useCases.length;
  const useCase = useCases[c];
  const paused = hidden || !inView;

  // Reduced motion: no autoplay, and the demo starts on the "with Nova" result.
  const mode: Mode = reduced && !state.touched ? WITH_US : s;
  const withUs = mode === WITH_US;

  const nf = (n: number) => formatNumber(locale, n);
  /** 160 -> "2 h 40 min" ("۲ ساعت و ۴۰ دقیقه"). */
  const fmt = (minutes: number) => {
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    const parts: string[] = [];
    if (h > 0) parts.push(`${nf(h)} ${xray.hour}`);
    if (m > 0 || h === 0) parts.push(`${nf(m)} ${xray.min}`);
    return parts.join(xray.and);
  };

  // Pause only: the hero is never hidden or revealed by this observer.
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting));
    observer.observe(root);
    return () => observer.disconnect();
  }, []);

  // The single timeout chain: each state change schedules exactly one tick, until the
  // visitor takes over.
  useEffect(() => {
    if (reduced || paused || !auto) return;
    const key = `${c}:${s}`;
    const wait = remaining.current?.key === key ? remaining.current.ms : DURATIONS[s];
    remaining.current = null;
    const started = performance.now();
    let fired = false;
    const id = window.setTimeout(() => {
      fired = true;
      dispatch({ type: "tick", count });
    }, wait);
    return () => {
      window.clearTimeout(id);
      if (!fired) remaining.current = { key, ms: Math.max(0, wait - (performance.now() - started)) };
    };
  }, [c, s, auto, count, reduced, paused]);

  // Measure the active tab once per change and hand the pill its position and width.
  useEffect(() => {
    const list = listRef.current;
    const indicator = indicatorRef.current;
    const tab = tabRefs.current[c];
    if (!list || !indicator || !tab) return;
    const place = () => {
      indicator.style.setProperty("--x", `${tab.offsetLeft}px`);
      indicator.style.setProperty("--w", `${tab.offsetWidth}px`);
      list.dataset.ready = "";
    };
    place();
    revealTab(list, tab, !reduced);
    // Late font swaps and resizes change tab widths; keep the pill on its tab.
    const observer = new ResizeObserver(place);
    observer.observe(tab);
    const settle = window.setTimeout(() => {
      list.dataset.settled = "";
    }, 120);
    return () => {
      observer.disconnect();
      window.clearTimeout(settle);
    };
  }, [c, reduced]);

  function select(index: number, focus = false) {
    dispatch({ type: "pick", c: index, s: reduced ? WITH_US : TODAY });
    if (focus) tabRefs.current[index]?.focus({ preventScroll: true });
  }

  function onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    const last = count - 1;
    const rtl = dir(locale) === "rtl";
    const forward = rtl ? "ArrowLeft" : "ArrowRight";
    const backward = rtl ? "ArrowRight" : "ArrowLeft";
    let next = -1;
    if (event.key === forward) next = c === last ? 0 : c + 1;
    else if (event.key === backward) next = c === 0 ? last : c - 1;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = last;
    if (next < 0) return;
    event.preventDefault();
    select(next, true);
  }

  const panelId = `${uid}-panel`;
  const progressFrom = DURATIONS.slice(0, s).reduce((total, ms) => total + ms, 0) / CASE_MS;
  const progressTo = DURATIONS.slice(0, s + 1).reduce((total, ms) => total + ms, 0) / CASE_MS;
  const todayTotal = sum(useCase.today);
  const afterTotal = sum(useCase.after);

  // Everything that depends on the case sits in one grid cell with a copy per case, so the
  // cell is as tall as the tallest (in this language, at this width) and the stage never
  // changes height. Only the active copy is visible and reachable.
  const ghost = { className: "invisible col-start-1 row-start-1", "aria-hidden": true, inert: true } as const;

  const totalRow = (key: string, text: string, node: ReactNode, hiddenCopy: boolean) => (
    <div key={key} className="hero-total" {...(hiddenCopy ? { "aria-hidden": true } : {})}>
      <span className="hero-label">{text}</span>
      <span className="hero-figure shrink-0">{node}</span>
    </div>
  );

  return (
    <div
      ref={rootRef}
      className="hero-demo rise-in"
      style={{ "--i": 4 } as CSSProperties}
      data-paused={paused ? "" : undefined}
    >
      <div
        ref={listRef}
        role="tablist"
        aria-label={label}
        onKeyDown={onKeyDown}
        className="no-scrollbar relative -mx-gutter -my-1.5 flex overflow-x-auto px-gutter py-1.5 md:-mx-1.5 md:px-1.5"
      >
        <span ref={indicatorRef} aria-hidden="true" className="hero-indicator">
          {auto && !reduced && (
            <span
              key={`${c}:${s}`}
              className="hero-progress"
              style={{ "--from": progressFrom, "--to": progressTo, "--d": `${DURATIONS[s]}ms` } as CSSProperties}
            />
          )}
        </span>
        {useCases.map((item, i) => (
          <button
            key={item.id}
            ref={(el) => {
              tabRefs.current[i] = el;
            }}
            type="button"
            role="tab"
            id={`${uid}-tab-${i}`}
            aria-selected={i === c}
            aria-controls={panelId}
            tabIndex={i === c ? 0 : -1}
            onClick={() => select(i)}
            className="hero-tab label"
          >
            {item.label}
          </button>
        ))}
      </div>

      <div role="tabpanel" id={panelId} aria-labelledby={`${uid}-tab-${c}`} className="hero-stage mt-3 lg:mt-4">
        <div className="hero-card">
          {/* Header: the case, and the switch that is the hero's main interaction. */}
          <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-3">
            <div className="grid min-w-48 flex-1 items-end sm:items-center justify-center">
              {useCases.map((item, i) =>
                i === c ? (
                  <p key={`${item.id}-${mode}`} className="hero-fade-in col-start-1 row-start-1 font-display text-h3">
                    {item.title}
                    <WhoPill who={item.today[0].who} className="ms-2 align-middle sm:hidden" />
                  </p>
                ) : (
                  <p key={item.id} {...ghost} className={cn(ghost.className, "font-display text-h3")}>
                    {item.title}
                    <WhoPill who={item.today[0].who} className="ms-2 align-middle sm:hidden" />
                  </p>
                ),
              )}
            </div>
            <div role="group" aria-label={label} className="hero-switch max-sm:basis-full" data-mode={mode}>
              <button type="button" aria-pressed={!withUs} onClick={() => dispatch({ type: "flip", s: TODAY })}>
                {xray.today}
              </button>
              <button type="button" aria-pressed={withUs} onClick={() => dispatch({ type: "flip", s: WITH_US })}>
                {xray.withUs}
              </button>
            </div>
          </div>

          {/* The workflow. Invisible copies of every case and both modes reserve the height; the live
              copy is laid over that box (absolute), so its springs can overshoot but never resize it. */}
          <div className="relative grid">
            {useCases.map((item, i) => {
              const rows = { useCase: item, xray, count, fmt };
              return (
                <div key={item.id} className="contents">
                  <div {...ghost} className={cn(ghost.className, "grid")}>
                    <div className="col-start-1 row-start-1 flex flex-col">
                      <div className="hero-flow">
                        <TodayRows {...rows} collapsed={false} />
                      </div>
                      {totalRow("t", xray.total, <Amount text={fmt(sum(item.today))} />, true)}
                    </div>
                    <div className="col-start-1 row-start-1 flex flex-col">
                      <div className="hero-flow">
                        <WithRows {...rows} open />
                      </div>
                      {totalRow("a", xray.total, <Amount text={fmt(sum(item.after))} />, true)}
                    </div>
                  </div>
                  {i === c && (
                    <div className="absolute inset-0 flex flex-col">
                      <div className="hero-flow" data-mode={mode}>
                        <span aria-hidden="true" className="hero-wire" />
                        <span aria-hidden="true" className="hero-packets">
                          {[0, 1, 2].map((k) => (
                            <span key={k} className="hero-packet" style={{ "--k": k } as CSSProperties} />
                          ))}
                        </span>
                        <TodayRows {...rows} collapsed={withUs} />
                        <WithRows {...rows} open={withUs} />
                      </div>
                      {totalRow(
                        "live",
                        xray.total,
                        <CountUp value={withUs ? afterTotal : todayTotal} instant={reduced} delay={150} format={fmt} />,
                        false,
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Metrics: one white ledger. Today's value in ink; with Nova the new value in ultra,
            with the old one struck through beside it. */}
        <div className="hero-ledger">
          {useCases.map((item, i) => (
            <div
              key={item.id}
              {...(i === c ? {} : ghost)}
              className={cn("col-start-1 row-start-1 grid grid-cols-1 sm:grid-cols-3", i !== c && "invisible")}
            >
              {item.metrics.map((metric) => (
                <div key={metric.label} className="hero-metric">
                  <p className="hero-label">{metric.label}</p>
                  <div className="hero-metric-values">
                    <p
                      className="hero-value hero-figure text-ink"
                      data-off={i === c && withUs ? "up" : undefined}
                      aria-hidden={i === c && withUs ? true : undefined}
                    >
                      <Amount text={metric.today} />
                    </p>
                    <p
                      className="hero-value hero-figure text-ultra"
                      data-off={i === c && !withUs ? "down" : i !== c ? "down" : undefined}
                      aria-hidden={i === c && withUs ? undefined : true}
                    >
                      <Amount text={metric.after} />
                      <s className="hero-was">{metric.today}</s>
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* After a flip, say the new numbers out loud. */}
        <p aria-live="polite" className="sr-only">
          {state.touched && withUs
            ? useCase.metrics.map((metric) => `${metric.label}: ${metric.after}`).join(". ")
            : ""}
        </p>
      </div>
    </div>
  );
}

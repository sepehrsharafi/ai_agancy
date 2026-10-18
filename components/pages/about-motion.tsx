"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { cn } from "@/lib/cn";

/*
 * Two small enhancements for the About page, both only ever *adding* to a page that is already
 * complete: the figures are in the server HTML with their final value, and the team wires are
 * drawn at rest. Neither can hide anything. Plain rect maths like FlowInView, not
 * IntersectionObserver: if the trigger never fires (a stalled frame loop, a hidden tab) the page
 * simply stays in its finished state.
 */

const REDUCED = "(prefers-reduced-motion: reduce)";
// Fires once the top edge has come up past this share of the viewport height.
const REACH = 0.85;
const DURATION = 1200;

/** Calls `fn` once, the first time `el` is on screen and well up the viewport. Returns a cleanup. */
function whenInView(el: HTMLElement, fn: () => void) {
  let frame = 0;

  function stop() {
    window.removeEventListener("scroll", schedule);
    window.removeEventListener("resize", schedule);
    cancelAnimationFrame(frame);
  }

  function check() {
    frame = 0;
    const { top, bottom } = el.getBoundingClientRect();
    if (bottom > 0 && top < window.innerHeight * REACH) {
      stop();
      fn();
    }
  }

  function schedule() {
    if (!frame) frame = requestAnimationFrame(check);
  }

  window.addEventListener("scroll", schedule, { passive: true });
  window.addEventListener("resize", schedule, { passive: true });
  schedule();
  return stop;
}

const PERSIAN = "۰۱۲۳۴۵۶۷۸۹";
const NUMBER = /^(\D*?)([0-9۰-۹]+)([\s\S]*)$/;

/**
 * A figure that counts up from 0 to its own value the first time it scrolls into view. The
 * final text is what the server sends; the counter only rewrites it while it runs. Digits keep
 * the script they came in ("۴۰+" counts in Persian digits), and a hidden copy of the final
 * text sets the width, so nothing around the figure moves while the digits change.
 */
export function CountUp({ value, className }: { value: string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const text = ref.current?.firstChild;
    const parts = NUMBER.exec(value);
    if (!ref.current || !text || !parts || window.matchMedia(REDUCED).matches) return undefined;

    const [, before, digits, after] = parts;
    const persian = digits.charCodeAt(0) >= 0x06f0;
    const target = Number(digits.replace(/[۰-۹]/g, (d) => String(PERSIAN.indexOf(d))));
    const show = (n: number) => {
      const s = String(n);
      text.nodeValue = before + (persian ? s.replace(/\d/g, (d) => PERSIAN[Number(d)]) : s) + after;
    };

    let frame = 0;
    const stop = whenInView(ref.current, () => {
      const start = performance.now();
      show(0);
      const tick = (now: number) => {
        const k = Math.min(1, Math.max(0, (now - start) / DURATION));
        show(Math.round(target * (1 - (1 - k) ** 4)));
        if (k < 1) frame = requestAnimationFrame(tick);
      };
      frame = requestAnimationFrame(tick);
    });

    return () => {
      stop();
      cancelAnimationFrame(frame);
      text.nodeValue = value;
    };
  }, [value]);

  return (
    <span className={cn("inline-grid tabular-nums", className)}>
      <span aria-hidden="true" className="invisible col-start-1 row-start-1">
        {value}
      </span>
      <span ref={ref} className="col-start-1 row-start-1">
        {value}
      </span>
    </span>
  );
}

/**
 * Sets `data-lit` on a wrapper the first time it is in view (every device; it never turns off).
 * CSS does the rest: `group-data-lit/<name>:` utilities on its children.
 */
export function InViewOnce({ className, children }: { className?: string; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    return el ? whenInView(el, () => el.setAttribute("data-lit", "")) : undefined;
  }, []);
  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}

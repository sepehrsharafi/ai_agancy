"use client";

import { useEffect, useRef, type ReactNode } from "react";

/*
 * Touch devices have no hover, so a diagram plays while it is on screen instead: this sets
 * `data-inview` on the element while most of it is in the viewport (flow.css turns that into
 * `flow-on` through `flow-trigger`). One passive scroll + resize listener is shared by every
 * diagram on the page, coalesced to a frame with rAF, and it only exists on touch devices and
 * without reduced motion. Plain rect maths, no IntersectionObserver: a missed trigger must
 * never be able to hide content, and here the worst case is a diagram that stays still.
 */
const TOUCH = "(hover: none), (pointer: coarse)";
const REDUCED = "(prefers-reduced-motion: reduce)";
// Starts once half of it is visible, stops once under a quarter is, so it never flickers at the edge.
const ENTER = 0.5;
const LEAVE = 0.25;

const targets = new Set<HTMLElement>();
let detach: (() => void) | undefined;

function measure() {
  const vh = window.innerHeight;
  const next = Array.from(targets, (el) => {
    const { top, bottom, height } = el.getBoundingClientRect();
    const share = height > 0 ? (Math.min(bottom, vh) - Math.max(top, 0)) / height : 0;
    return [el, share] as const;
  });
  for (const [el, share] of next) {
    const on = el.hasAttribute("data-inview");
    if (!on && share >= ENTER) el.setAttribute("data-inview", "");
    else if (on && share < LEAVE) el.removeAttribute("data-inview");
  }
}

function attach() {
  if (!window.matchMedia(TOUCH).matches || window.matchMedia(REDUCED).matches) return undefined;
  let frame = 0;
  const schedule = () => {
    if (frame) return;
    frame = requestAnimationFrame(() => {
      frame = 0;
      measure();
    });
  };
  window.addEventListener("scroll", schedule, { passive: true });
  window.addEventListener("resize", schedule, { passive: true });
  schedule();
  return () => {
    window.removeEventListener("scroll", schedule);
    window.removeEventListener("resize", schedule);
    cancelAnimationFrame(frame);
  };
}

function register(el: HTMLElement) {
  targets.add(el);
  if (targets.size === 1) detach = attach();
  else requestAnimationFrame(measure);
  return () => {
    targets.delete(el);
    el.removeAttribute("data-inview");
    if (targets.size === 0) {
      detach?.();
      detach = undefined;
    }
  };
}

/** Wraps a diagram; carries `data-inview` while it is on screen (touch devices only). */
export function FlowInView({ className, children }: { className?: string; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => (ref.current ? register(ref.current) : undefined), []);
  return (
    <div ref={ref} aria-hidden="true" className={className}>
      {children}
    </div>
  );
}

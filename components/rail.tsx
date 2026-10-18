"use client";

import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { Container } from "@/components/container";
import { cn } from "@/lib/cn";

type Props = {
  /** Accessible name of the scroller. */
  label: string;
  previous: string;
  next: string;
  /** One accessible name per item for the pager, already formatted for the locale. */
  pagerLabels: string[];
  /** The items, as <li> elements (rendered on the server). Their width is theirs to set. */
  children: ReactNode;
  /** On the wrapper: the rail's outer spacing. */
  className?: string;
  /** On the list: gap and, where a layout takes over (a grid, say), its overrides. */
  listClassName?: string;
  /** On the pager row: hide it at breakpoints where the content is known to fit (`lg:hidden`). */
  pagerClassName?: string;
};

const BUTTON =
  "grid size-12 place-items-center rounded-pill text-ink inset-ring-1 inset-ring-ink transition-colors duration-300 aria-disabled:opacity-35 aria-disabled:cursor-default not-aria-disabled:hover:bg-ink not-aria-disabled:hover:text-white";
const ARROW = "size-5 fill-none stroke-current stroke-[1.75]";

/** Distance between the start edges of two neighbouring items (an item and its gap). */
function itemStep(rail: HTMLElement) {
  const first = rail.firstElementChild;
  if (!first) return 1;
  const second = first.nextElementSibling;
  return second
    ? Math.abs(second.getBoundingClientRect().left - first.getBoundingClientRect().left)
    : first.getBoundingClientRect().width;
}

/** +1 in LTR, -1 in RTL: the sign of scrollLeft as the rail moves towards its end. */
const reading = (rail: HTMLElement) => (getComputedStyle(rail).direction === "rtl" ? -1 : 1);

const scrollBehavior = (): ScrollBehavior =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth";

/**
 * A native scroll-snap rail that bleeds to the viewport edges (the gutter is its padding, so the
 * first item lines up with the Container) plus its pager. The pager is a segmented progress bar,
 * one segment per item; where a fine pointer exists (md and up) previous/next buttons join it at
 * the end of the row, scrolling by exactly one item and never lying about the ends (aria-disabled
 * keeps focus where it is). The pager is hidden whenever everything already fits.
 *
 * The list sits above the page thread (`above-thread`, chrome.css), so items pass in front of it.
 * Direction-aware: in RTL the rail starts at the right and scrollLeft runs negative, so distances
 * are taken as magnitudes and steps are multiplied by the rail's own reading direction.
 */
export function Rail({ label, previous, next, pagerLabels, children, className, listClassName, pagerClassName }: Props) {
  const id = useId();
  const rail = useRef<HTMLUListElement>(null);
  const [overflowing, setOverflowing] = useState(true);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const el = rail.current;
    if (!el) return;
    let frame = 0;
    const update = () => {
      frame = 0;
      const travelled = Math.abs(el.scrollLeft);
      const end = el.scrollWidth - el.clientWidth - 1;
      setOverflowing(el.scrollWidth > el.clientWidth + 1);
      setAtStart(travelled <= 1);
      setAtEnd(travelled >= end);
      // The last item can never reach the snap edge (nothing follows it), so the end of the
      // rail is the last item; everywhere else the nearest item is the one travelled/step rounds to.
      const step = itemStep(el);
      const count = el.childElementCount;
      setActive(travelled >= end ? count - 1 : Math.min(count - 1, Math.round(travelled / step)));
    };
    // One passive listener, coalesced to one read per frame.
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    // Fires once on observe (initial state) and again whenever the rail is resized.
    const observer = new ResizeObserver(update);
    observer.observe(el);
    return () => {
      cancelAnimationFrame(frame);
      el.removeEventListener("scroll", onScroll);
      observer.disconnect();
    };
  }, []);

  function scrollByItem(direction: 1 | -1) {
    const el = rail.current;
    if (!el) return;
    el.scrollBy({ left: direction * reading(el) * itemStep(el), behavior: scrollBehavior() });
  }

  function showItem(index: number) {
    const el = rail.current;
    if (!el) return;
    // The browser clamps this to the end of the rail, where the last item sits.
    el.scrollTo({ left: reading(el) * index * itemStep(el), behavior: scrollBehavior() });
  }

  return (
    <div className={className}>
      <ul
        ref={rail}
        id={id}
        tabIndex={overflowing ? 0 : undefined}
        aria-label={label}
        className={cn(
          "rail-inset above-thread no-scrollbar flex snap-x snap-mandatory overflow-x-auto overscroll-x-contain py-2",
          listClassName,
        )}
      >
        {children}
      </ul>
      {/* 0.5rem of the rail's padding + 0.75rem = 1.25rem from the items to the pager. */}
      <Container className={cn("mt-3 items-center gap-6 md:mt-5", overflowing ? "flex" : "hidden", pagerClassName)}>
        <div className="flex min-w-0 grow gap-1.5 md:pointer-fine:max-w-xl">
          {pagerLabels.map((pagerLabel, i) => (
            <button
              key={pagerLabel}
              type="button"
              aria-label={pagerLabel}
              aria-controls={id}
              aria-current={i === active ? "true" : undefined}
              onClick={() => showItem(i)}
              className="group flex h-6 min-w-0 grow basis-0 items-center transition-[flex-grow] duration-500 ease-spring-soft aria-[current=true]:grow-3 motion-reduce:duration-0"
            >
              <span className="h-1 w-full rounded-pill bg-ink/15 transition-colors duration-500 ease-spring-soft group-aria-[current=true]:bg-ultra motion-reduce:duration-0" />
            </button>
          ))}
        </div>
        <div className="ms-auto hidden gap-3 md:pointer-fine:flex">
          <button
            type="button"
            aria-label={previous}
            aria-controls={id}
            aria-disabled={atStart}
            onClick={() => !atStart && scrollByItem(-1)}
            className={BUTTON}
          >
            <svg viewBox="0 0 16 16" aria-hidden="true" className={cn(ARROW, "arrow-back")}>
              <path d="M2.5 8h11M9 3.5 13.5 8 9 12.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <button
            type="button"
            aria-label={next}
            aria-controls={id}
            aria-disabled={atEnd}
            onClick={() => !atEnd && scrollByItem(1)}
            className={BUTTON}
          >
            <svg viewBox="0 0 16 16" aria-hidden="true" className={cn(ARROW, "scale-x-(--dir)")}>
              <path d="M2.5 8h11M9 3.5 13.5 8 9 12.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </Container>
    </div>
  );
}

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState, useSyncExternalStore, type CSSProperties } from "react";
import type { Dictionary } from "@/content/en";
import { Logo } from "@/components/logo";
import { Shape } from "@/components/shape";
import { cn } from "@/lib/cn";
import { localePath, type Locale } from "@/lib/locale";
import { navRoutes } from "@/lib/site";
import { LangSwitch } from "./lang-switch";
import { LinkPending } from "./link-pending";

// Scroll state: one passive listener, coalesced to a frame with rAF. Expands past 48px and
// collapses again under 24px (a little hysteresis so it never flickers at the boundary).
let expandedSnapshot = false;

function subscribeToScroll(notify: () => void) {
  let frame = 0;
  const onScroll = () => {
    if (frame) return;
    frame = requestAnimationFrame(() => {
      frame = 0;
      notify();
    });
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  return () => {
    window.removeEventListener("scroll", onScroll);
    cancelAnimationFrame(frame);
  };
}

function getExpanded() {
  const y = window.scrollY;
  if (y > 48) expandedSnapshot = true;
  else if (y < 24) expandedSnapshot = false;
  return expandedSnapshot;
}

const getServerExpanded = () => false;

// The CTA's arrow. Slides 4px in the reading direction on hover; the glyph mirrors in RTL
// (same drawing as ButtonLink's, composed here because the island's pill is built differently).
function Arrow() {
  return (
    <svg
      viewBox="0 0 16 16"
      aria-hidden="true"
      className="size-4 shrink-0 scale-x-(--dir) translate-x-0 fill-none stroke-current stroke-[1.75] transition-[translate] duration-500 ease-out group-hover/cta:translate-x-(--arrow-shift) group-focus-visible/cta:translate-x-(--arrow-shift)"
    >
      <path d="M2.5 8h11M9 3.5 13.5 8 9 12.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

type NavIslandProps = {
  locale: Locale;
  t: Dictionary["nav"];
  langSwitch: Dictionary["langSwitch"];
};

export function NavIsland({ locale, t, langSwitch }: NavIslandProps) {
  const pathname = usePathname();
  const expanded = useSyncExternalStore(subscribeToScroll, getExpanded, getServerExpanded);

  // The menu is "open" only on the page it was opened from, so navigating closes it
  // without an effect.
  const [openAt, setOpenAt] = useState<string | null>(null);
  const open = openAt === pathname;

  const islandRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const firstLinkRef = useRef<HTMLAnchorElement>(null);

  const close = () => {
    setOpenAt(null);
    buttonRef.current?.focus();
  };

  useEffect(() => {
    if (!open) return;

    const root = document.documentElement;
    const previousOverflow = root.style.overflow;
    root.style.overflow = "hidden";
    firstLinkRef.current?.focus({ preventScroll: true });

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpenAt(null);
        buttonRef.current?.focus();
        return;
      }
      if (event.key !== "Tab" || !islandRef.current) return;
      // Keep Tab inside the island while the menu is open.
      const focusable = [...islandRef.current.querySelectorAll<HTMLElement>("a[href], button")].filter(
        (el) => el.offsetParent !== null,
      );
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    // Resizing past the breakpoint swaps to the desktop layout, which has no menu.
    const desktop = window.matchMedia("(min-width: 48rem)");
    const onBreakpoint = () => {
      if (desktop.matches) setOpenAt(null);
    };

    document.addEventListener("keydown", onKeyDown);
    desktop.addEventListener("change", onBreakpoint);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      desktop.removeEventListener("change", onBreakpoint);
      root.style.overflow = previousOverflow;
    };
  }, [open]);

  const links = navRoutes.map(({ key, path }) => {
    const href = localePath(locale, path);
    return {
      key,
      href,
      label: t.links[key],
      current: pathname === href || pathname.startsWith(`${href}/`),
    };
  });
  const contactHref = localePath(locale, "/contact");

  return (
    <>
      <div
        aria-hidden="true"
        data-open={open ? "" : undefined}
        onClick={close}
        className="pointer-events-none fixed inset-0 z-40 bg-paper/70 opacity-0 transition-opacity duration-500 ease-out data-open:pointer-events-auto data-open:opacity-100 md:hidden"
      />

      <header className="pointer-events-none fixed inset-x-0 top-3 z-50 flex justify-center">
        <div
          ref={islandRef}
          data-expanded={expanded ? "" : undefined}
          data-open={open ? "" : undefined}
          className="group/island nav-island pointer-events-auto border border-line bg-white/95 data-open:bg-white md:bg-white/80 md:backdrop-blur-md md:data-expanded:bg-white/90"
        >
          {/* Desktop is a 1fr / auto / 1fr grid with no row padding, so the links sit on the
              island's true centre however wide the logo and the end cluster are; each outer
              cell carries its own inset instead. Phone stays a two-item flex row. */}
          <div className="flex h-14 items-center justify-between ps-5 pe-2 md:grid md:grid-cols-[1fr_auto_1fr] md:px-0">
            <Link
              href={localePath(locale)}
              aria-label={t.home}
              className="flex rounded-pill md:ms-6 md:justify-self-start"
            >
              <Logo />
              <LinkPending />
            </Link>

            <nav className="hidden md:block">
              <ul className="flex items-center">
                {links.map((link) => (
                  <li key={link.key} className="flex">
                    <Link
                      href={link.href}
                      aria-current={link.current ? "page" : undefined}
                      className="group/link relative inline-flex h-10 items-center rounded-pill px-3 text-body leading-none font-medium text-ink"
                    >
                      {link.label}
                      <LinkPending />
                      <Shape
                        shape="circle"
                        color="ink"
                        className={cn(
                          "absolute inset-x-0 bottom-0.5 mx-auto size-1.5",
                          link.current
                            ? "scale-100"
                            : "scale-0 group-hover/link:scale-50 group-focus-visible/link:scale-50",
                        )}
                      />
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            <div className="hidden items-center md:me-2 md:flex md:justify-self-end">
              <LangSwitch locale={locale} label={langSwitch.label} ariaLabel={langSwitch.aria} />
              {/* The CTA is always a pill: collapsed it is a 2.5rem circle holding just the arrow,
                  scaled to nothing, and it morphs in as the island widens (nav-cta* in globals.css
                  has the timing). The pill's own background is the outer element, so it widens with
                  round ends the whole way; the label sits in a 0fr -> 1fr column inside it, on
                  ease-out so no column ever dips below its content. */}
              <Link
                href={contactHref}
                inert={!expanded}
                className="nav-cta group/cta flex h-10 items-center rounded-pill bg-ultra text-body leading-none font-semibold whitespace-nowrap text-white hover:bg-ink focus-visible:bg-ink"
              >
                <span className="nav-cta-fold self-stretch">
                  <span className="min-w-0 overflow-hidden">
                    <span className="nav-cta-label flex h-full items-center ps-5">{t.cta}</span>
                  </span>
                </span>
                <span className="grid size-10 shrink-0 place-items-center">
                  <Arrow />
                </span>
              </Link>
            </div>

            <button
              ref={buttonRef}
              type="button"
              aria-label={open ? t.close : t.menu}
              aria-expanded={open}
              aria-controls="nav-panel"
              onClick={() => (open ? close() : setOpenAt(pathname))}
              className="grid size-10 place-items-center rounded-pill bg-ink text-white md:hidden"
            >
              <span aria-hidden="true" className="relative block size-4">
                <span className="absolute inset-x-0 top-1 h-0.5 rounded-pill bg-current transition-[translate,rotate] duration-600 ease-spring group-data-open/island:translate-y-0.75 group-data-open/island:rotate-45" />
                <span className="absolute inset-x-0 bottom-1 h-0.5 rounded-pill bg-current transition-[translate,rotate] duration-600 ease-spring group-data-open/island:-translate-y-0.75 group-data-open/island:-rotate-45" />
              </span>
            </button>
          </div>

          <nav id="nav-panel" inert={!open} className="nav-panel md:hidden">
            <div className="min-h-0 overflow-hidden">
              <div className="px-6 pt-3 pb-3">
                {/* Rows bleed 0.75rem past the content edge so the labels line up with the logo
                    and the CTA while the current page's pill still has room around its text. */}
                <ul className="-mx-3">
                  {links.map((link, i) => (
                    <li key={link.key} className="panel-item" style={{ "--i": i } as CSSProperties}>
                      <Link
                        ref={i === 0 ? firstLinkRef : undefined}
                        href={link.href}
                        aria-current={link.current ? "page" : undefined}
                        onClick={close}
                        className={cn(
                          "flex h-13 items-center justify-between gap-4 rounded-pill px-3 text-h3 font-medium",
                          link.current ? "bg-haze text-ultra" : "text-ink",
                        )}
                      >
                        {link.label}
                        <LinkPending />
                        {link.current ? <Shape shape="circle" color="ultra" className="size-2.5" /> : null}
                      </Link>
                    </li>
                  ))}
                </ul>
                {/* Below a hairline, two more rows with the list rows' geometry (same bleed, same
                    px-3), so the CTA's and the language's text start exactly where the labels do
                    and the CTA pill's edges sit flush with the current page's pill. */}
                <div className="panel-item mt-3 border-t border-line pt-4" style={{ "--i": 4 } as CSSProperties}>
                  <Link
                    href={contactHref}
                    onClick={close}
                    className="group/cta -mx-3 flex h-13 items-center justify-between gap-4 rounded-pill bg-ultra px-3 text-lede font-semibold text-white transition-colors duration-300 ease-out hover:bg-ink focus-visible:bg-ink"
                  >
                    {t.cta}
                    <Arrow />
                  </Link>
                </div>
                <div className="panel-item -mx-3 mt-1" style={{ "--i": 5 } as CSSProperties}>
                  <LangSwitch
                    locale={locale}
                    label={langSwitch.label}
                    ariaLabel={langSwitch.aria}
                    variant="row"
                    onClick={close}
                  />
                </div>
              </div>
            </div>
          </nav>
        </div>
      </header>
    </>
  );
}

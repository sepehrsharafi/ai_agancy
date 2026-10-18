import type { ReactNode } from "react";
import { Container } from "@/components/container";
import { FlowInView } from "@/components/flow/flow-inview";
import { Shape } from "@/components/shape";
import type { Dictionary } from "@/content/en";
import { CountUp } from "./about-motion";

type Props = { facts: Dictionary["pages"]["about"]["facts"] };

/*
 * One brand shape in the corner of each tile, by index (founded, agents, place, languages). At
 * rest each is a plain shape; while the tile is active (`about-on:`: a mouse over it, or on
 * touch the tile in view) it morphs into another, springing.
 */
const GLYPHS: ReactNode[] = [
  <Shape key="year" shape="circle" color="ultra" className="size-full about-on:shape-quarter about-on:shape-r-90" />,
  <Shape key="agents" shape="square" color="mint" className="size-full about-on:shape-circle" />,
  <Shape key="place" shape="arch" color="sun" className="size-full about-on:shape-leaf about-on:shape-r-90" />,
  // Two languages: two small circles that become two quarters facing each other, like speech bubbles.
  <span key="languages" className="flex size-full items-center gap-1">
    <Shape shape="circle" color="ink" className="size-7.5 about-on:shape-quarter" />
    <Shape
      shape="circle"
      color="ink"
      className="size-7.5 about-on:shape-quarter about-on:shape-r-180"
      style={{ transitionDelay: "80ms" }}
    />
  </span>,
];

const HAS_DIGITS = /[0-9۰-۹]/;

/**
 * Four tiles: a big figure, what it counts, a brand shape in the corner. The figures that are
 * numbers count up from 0 the first time they scroll into view (the final value is in the
 * HTML, so without script nothing is missing); "Tehran" does not count.
 */
export function AboutFacts({ facts }: Props) {
  return (
    <section className="pb-section">
      <Container>
        <ul className="grid grid-cols-2 gap-gridgap lg:grid-cols-4">
          {facts.map(({ value, label }, i) => (
            <li
              key={label}
              className="group/about relative flex min-h-56 flex-col rounded-card bg-white p-6 sm:p-8"
            >
              {/* Touch trigger: carries data-inview while the tile is on screen. Empty and decorative. */}
              <FlowInView className="pointer-events-none absolute inset-0">{null}</FlowInView>
              <div aria-hidden="true" className="size-16 self-end">
                {GLYPHS[i % GLYPHS.length]}
              </div>
              <div className="mt-auto flex flex-col-reverse gap-3 pt-10">
                <p className="label text-ink-soft">{label}</p>
                <p className="font-display text-h2 wrap-break-word">
                  {HAS_DIGITS.test(value) ? <CountUp value={value} /> : value}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}

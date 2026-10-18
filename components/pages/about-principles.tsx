import { Check } from "lucide-react";
import type { ReactNode } from "react";
import { Container } from "@/components/container";
import { FlowInView } from "@/components/flow/flow-inview";
import { Shape } from "@/components/shape";
import type { Dictionary } from "@/content/en";

type Props = {
  title: string;
  principles: Dictionary["pages"]["about"]["principles"];
};

/*
 * One glyph per principle, by index: a 4rem box of brand shapes that tells the principle
 * while its card is active (`about-on:`: a mouse over the card, or on touch the card in view).
 * Every shape sits at the box's start-top corner and is placed with `glyph-pos` (--x / --y,
 * x mirrored in RTL), so a morph only changes those two variables, the shape, the colour or
 * the scale: all of it transform, border-radius and colour, all of it springing. At rest each
 * glyph is already a finished picture; the card just plays it forward. Decorative.
 */
const SHAPE = "absolute inset-s-0 top-0 glyph-pos";

const GLYPHS: ReactNode[] = [
  // Boring beats clever: three fancy shapes, scattered, settle into three plain squares in a column.
  <>
    <Shape
      shape="circle"
      color="ultra"
      className={`${SHAPE} size-5 [--x:0px] [--y:4px] about-on:[--x:22px] about-on:[--y:0px] about-on:shape-square about-on:shape-mint`}
    />
    <Shape
      shape="leaf"
      color="sun"
      className={`${SHAPE} size-5 [--x:42px] [--y:16px] about-on:[--x:22px] about-on:[--y:22px] about-on:shape-square about-on:shape-r-90 about-on:shape-mint`}
      style={{ transitionDelay: "60ms" }}
    />
    <Shape
      shape="arch"
      color="ultra"
      className={`${SHAPE} size-5 [--x:10px] [--y:42px] about-on:[--x:22px] about-on:[--y:44px] about-on:shape-square about-on:shape-mint`}
      style={{ transitionDelay: "120ms" }}
    />
  </>,

  // People stay in charge: the agent node waits, the person's outline fills mint with a check,
  // and the wire between them goes live.
  <>
    <Shape shape="square" color="ultra" className="absolute inset-s-0 top-5 size-6" />
    <span className="absolute inset-s-6 top-1/2 -mt-px h-0.5 w-3 bg-ink/30 transition-colors duration-500 ease-out about-on:bg-ultra" />
    <Shape shape="circle" color="ink" className="absolute inset-s-9 top-4.5 size-7 about-on:shape-mint" />
    <Shape
      shape="circle"
      color="white"
      className="absolute inset-s-9 top-4.5 size-7 scale-80 about-on:scale-0"
    />
    <span className="absolute inset-s-9 top-4.5 grid size-7 scale-50 place-items-center text-ink opacity-0 transition-[opacity,scale] delay-150 duration-500 ease-out about-on:scale-100 about-on:opacity-100">
      <Check size={16} strokeWidth={2.5} absoluteStrokeWidth aria-hidden="true" />
    </span>
  </>,

  // Your data stays yours: the circle outside settles inside the arch, the house.
  <>
    <Shape shape="arch" color="ultra" className="absolute inset-s-0 top-4 size-12" />
    <Shape
      shape="circle"
      color="sun"
      className={`${SHAPE} size-5 [--x:44px] [--y:0px] about-on:[--x:14px] about-on:[--y:36px]`}
      style={{ transitionDelay: "80ms" }}
    />
  </>,

  // Start small, prove it: one small circle grows into a row of three, the last one done.
  <>
    <Shape
      shape="circle"
      color="ultra"
      className={`${SHAPE} top-5.5 size-5 scale-75 [--x:0px] about-on:scale-100`}
    />
    <Shape
      shape="circle"
      color="ultra"
      className={`${SHAPE} top-5.5 size-5 scale-0 [--x:0px] about-on:scale-100 about-on:[--x:22px]`}
      style={{ transitionDelay: "100ms" }}
    />
    <Shape
      shape="circle"
      color="ultra"
      className={`${SHAPE} top-5.5 size-5 scale-0 [--x:0px] about-on:scale-100 about-on:[--x:44px] about-on:shape-mint`}
      style={{ transitionDelay: "200ms" }}
    />
  </>,
];

/** Heading in the start columns, a 2x2 grid of principle cards beside it. */
export function AboutPrinciples({ title, principles }: Props) {
  return (
    <section aria-labelledby="principles-title" className="pb-section">
      <Container className="grid-swiss gap-y-16">
        <h2 id="principles-title" className="col-span-full font-display text-h2 lg:col-span-4">
          {title}
        </h2>
        <ul className="col-span-full grid gap-gridgap sm:grid-cols-2 lg:col-span-8 lg:col-start-5">
          {principles.map(({ title: name, description }, i) => (
            <li key={name} className="group/about relative rounded-card bg-white p-6 sm:p-8">
              {/* Touch trigger: carries data-inview while the card is on screen. Empty and decorative. */}
              <FlowInView className="pointer-events-none absolute inset-0">{null}</FlowInView>
              <div aria-hidden="true" className="relative size-16">
                {GLYPHS[i % GLYPHS.length]}
              </div>
              <h3 className="mt-8 font-display text-h3">{name}</h3>
              <p className="mt-3 text-ink-soft">{description}</p>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}

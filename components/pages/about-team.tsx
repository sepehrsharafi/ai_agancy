import { Container } from "@/components/container";
import { FlowInView } from "@/components/flow/flow-inview";
import { Shape, type ShapeColor, type ShapeName } from "@/components/shape";
import type { Dictionary } from "@/content/en";
import { InViewOnce } from "./about-motion";

type Person = Dictionary["pages"]["about"]["team"][number];
type Props = { title: string; team: readonly Person[] };

// How long one wire and one port take to light, in ms: the next starts as this one lands.
const STEP = 450;

/*
 * Each person is a brand shape in the person's colour. It rests as one shape and, while the
 * tile is active (`about-on:`: a mouse over it, or on touch the tile in view), springs into
 * another. White initials on ultra and ink, ink on mint and sun (the same rule as everywhere
 * else). The initials never move with the shape, only nudge toward its mass: an arch is heavier
 * low down, a quarter toward its square corner, and the nudge is undone when it becomes a circle.
 * Full class names, so Tailwind can see every utility.
 */
const PEOPLE: {
  shape: ShapeName;
  color: ShapeColor;
  morph: string;
  text: string;
  nudge: string;
}[] = [
  {
    shape: "square",
    color: "ultra",
    morph: "about-on:shape-arch",
    text: "text-white",
    nudge: "about-on:translate-y-[4cqi]",
  },
  {
    shape: "circle",
    color: "mint",
    morph: "about-on:shape-leaf about-on:shape-r-90",
    text: "text-ink",
    nudge: "",
  },
  {
    shape: "arch",
    color: "sun",
    morph: "about-on:shape-quarter about-on:shape-r-180",
    text: "text-ink",
    nudge: "translate-y-[4cqi] about-on:translate-x-[calc(var(--dir)*-4cqi)] about-on:-translate-y-[4cqi]",
  },
  {
    shape: "quarter",
    color: "ink",
    morph: "about-on:shape-circle",
    text: "text-white",
    nudge: "translate-x-[calc(var(--dir)*4cqi)] translate-y-[4cqi] about-on:translate-x-0 about-on:translate-y-0",
  },
];

/**
 * A team member as a workflow node: a shape with initials, a port on the end edge and the wire
 * leaving it. From 768px the four wires join into one line behind the row (each runs on across
 * the grid gap to the next tile; the last one stops at its tile); on phones only the first
 * column of each pair keeps its wire. Port and wire are ink at rest; once the grid has come into
 * view (`data-lit`, see InViewOnce) they turn ultra one after the other, left to right.
 */
function Node({ initials, index }: { initials: string; index: number }) {
  const { shape, color, morph, text, nudge } = PEOPLE[index % PEOPLE.length];
  const delay = { transitionDelay: `${index * STEP}ms` };
  return (
    <div aria-hidden="true" className="relative">
      <span className="absolute inset-s-0 top-1/2 -mt-px hidden h-0.5 w-[calc(100%+var(--spacing-gridgap))] bg-ink/30 group-odd/node:block md:block md:group-last/node:w-full">
        <span
          className="absolute inset-0 origin-left scale-x-0 bg-ultra transition-transform duration-500 ease-linear group-data-lit/team:scale-x-100 rtl:origin-right"
          style={delay}
        />
      </span>
      <div className="avatar">
        <Shape shape={shape} color={color} className={`absolute inset-0 size-full ${morph}`} />
        <span
          className={`avatar-initials relative transition-[translate] duration-700 ease-spring ${text} ${nudge}`}
        >
          {initials}
        </span>
      </div>
      <span
        className="absolute inset-e-0 top-1/2 -mt-1 -me-1 size-2 rounded-full bg-paper inset-ring-2 inset-ring-ink transition-[background-color,box-shadow] duration-300 ease-out group-data-lit/team:bg-ultra group-data-lit/team:inset-ring-ultra"
        style={delay}
      />
    </div>
  );
}

/** Four people, no photos: a node, the name, the role. */
export function AboutTeam({ title, team }: Props) {
  return (
    <section aria-labelledby="team-title" className="pb-section">
      <Container>
        <h2 id="team-title" className="max-w-4xl font-display text-h2">
          {title}
        </h2>
        <InViewOnce className="group/team mt-16">
          <ul className="grid grid-cols-2 gap-x-gridgap gap-y-12 md:grid-cols-4">
            {team.map(({ name, initials, role }, i) => (
              <li key={initials} className="group/node group/about relative">
                {/* Touch trigger: carries data-inview while the tile is on screen. Empty and decorative. */}
                <FlowInView className="pointer-events-none absolute inset-0">{null}</FlowInView>
                <Node initials={initials} index={i} />
                <h3 className="mt-5 font-display text-h3">{name}</h3>
                <p className="label mt-1.5 text-ink-soft">{role}</p>
              </li>
            ))}
          </ul>
        </InViewOnce>
      </Container>
    </section>
  );
}

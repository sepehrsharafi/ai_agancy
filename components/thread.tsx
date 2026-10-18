import type { CSSProperties } from "react";
import { Container } from "./container";
import { Shape, type ShapeColor } from "./shape";

export type ThreadAccent = Extract<ShapeColor, "ultra" | "mint" | "sun" | "ink">;

/** The cycle: each section is a station in its own colour. */
const CYCLE: ThreadAccent[] = ["ultra", "mint", "sun", "ink"];

// Sections that carry a heading id keep a stable accent in page order; anything else is
// picked from its label so it still lands somewhere in the cycle.
const ACCENT_BY_ID: Record<string, ThreadAccent> = {
  "audience-title": "ultra",
  "services-title": "mint",
  "process-title": "sun",
  "work-title": "ink",
  "testimonials-title": "ultra",
};

export function accentFor(key: string | undefined, fallbackLabel: string): ThreadAccent {
  if (key && ACCENT_BY_ID[key]) return ACCENT_BY_ID[key];
  let hash = 0;
  for (const char of fallbackLabel) hash = (hash * 31 + char.charCodeAt(0)) % CYCLE.length;
  return CYCLE[hash];
}

/**
 * The thread: a single 2px rail down the whole page, in the gutter beside the container's
 * start edge (same Container geometry as the content, so it mirrors in RTL). Sits above the
 * page and below the footer's colour field, which ends it. Pure CSS; see chrome.css.
 */
export function ThreadLayer() {
  return (
    <div aria-hidden="true" className="thread-layer">
      <Container className="h-full">
        <div className="relative h-full">
          <span className="thread-line" />
        </div>
      </Container>
    </div>
  );
}

/**
 * One section's opening: the ruled hairline with registration marks, the turn from the
 * rail, and the station node. Put it first inside a `relative` grid whose top edge is the rule.
 */
export function ThreadStation({ accent }: { accent: ThreadAccent }) {
  return (
    <>
      <span aria-hidden="true" className="thread-rule" />
      <span
        aria-hidden="true"
        className="thread-elbow"
        style={{ "--thread-accent": `var(--color-${accent})` } as CSSProperties}
      />
      <Shape shape="circle" color={accent} className="thread-node" />
    </>
  );
}

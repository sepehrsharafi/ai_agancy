import type { CSSProperties } from "react";
import { cn } from "@/lib/cn";

export type FlowOrient = "horizontal" | "vertical" | "responsive" | "responsive-xl";

// `responsive` is a column until md, then a row; `responsive-xl` waits for xl (a row of wide nodes needs the room). Each matches a fragment of the same name.
const ORIENT = {
  horizontal: "flow-wire-h",
  vertical: "flow-wire-v",
  responsive: "flow-wire-v md:flow-wire-h",
  "responsive-xl": "flow-wire-v xl:flow-wire-h",
} satisfies Record<FlowOrient, string>;

// Two comets share a wire at most: more reads as a stream, not as signals.
const MAX_COMETS = 2;

type FlowWireProps = {
  orient?: FlowOrient;
  /** Turns the wire ultra and sends its comets. Without it, a parent can do the same with `flow-on`. */
  running?: boolean;
  /** How many comets share the wire (1 or 2; a 3 is capped at 2). */
  packets?: 1 | 2 | 3;
  /** Extra delay in ms before this wire's comets set off. */
  lag?: number;
  /** Wires upstream of this one: each hands the work on as its comet lands, so a chain runs node to node. */
  hop?: number;
  /** Length: set `[--wire-len:3rem]` for a column, or let a row's wires share the space. */
  className?: string;
};

/**
 * WIRE: 2px, straight, orthogonal. Running (a `flow-on` ancestor, or `running`) it is ultra with
 * a faint 6px conduit behind it. Comets (a round head, a fading tail) travel from one end to
 * the other with CSS keyframes (mirrored in RTL), easing out of one port and into the next, and
 * each one rings the receiving port as it lands. Never with reduced motion.
 */
export function FlowWire({ orient = "horizontal", running, packets = 2, lag = 0, hop = 0, className }: FlowWireProps) {
  const comets = Math.min(packets, MAX_COMETS);
  return (
    <span
      aria-hidden="true"
      className={cn("flow-wire", ORIENT[orient], running && "flow-on", className)}
      style={{ "--lag": `${lag}ms`, "--hop": hop, "--n": comets } as CSSProperties}
    >
      {Array.from({ length: comets }, (_, i) => (
        <span key={i} className="flow-comet" style={{ "--i": i } as CSSProperties} />
      ))}
    </span>
  );
}

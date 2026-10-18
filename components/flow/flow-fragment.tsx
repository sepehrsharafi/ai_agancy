import { Fragment } from "react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/cn";
import { FlowNode, type FlowLayout, type FlowSize, type FlowVariant } from "./flow-node";
import { FlowWire, type FlowOrient } from "./flow-wire";

export type FlowNodeSpec = {
  icon: LucideIcon;
  label: string;
  /** Default: the first node is the input, the last is done, those between are the agent. */
  variant?: FlowVariant;
  /** See FlowNode: the icon the node changes to while the flow runs. */
  finish?: LucideIcon;
};

type FlowFragmentProps = {
  nodes: readonly FlowNodeSpec[];
  /** `responsive`: a column on phones, a row from md. `responsive-xl`: a row only from xl. */
  orientation?: FlowOrient;
  size?: FlowSize;
  layout?: FlowLayout;
  /** Wires run ultra and comets travel along them. Or leave it off and put `flow-on` on a parent. */
  running?: boolean;
  /** Comets per wire: 1 or 2 (a 3 is capped at 2). */
  packets?: 1 | 2 | 3;
  className?: string;
  /** Classes for every wire, e.g. `[--wire-len:3.5rem]`. */
  wireClassName?: string;
};

const DATA_ORIENT = { horizontal: "h", vertical: "v", responsive: "r", "responsive-xl": "x" } satisfies Record<FlowOrient, string>;

function defaultVariant(i: number, count: number): FlowVariant {
  if (i === 0) return "input";
  return i === count - 1 ? "done" : "agent";
}

/**
 * A small composed diagram: input node, wire, agent node, wire, output node. Ports (8px circles)
 * sit on the edges where the wires attach. Static; the only motion is the comets (and the ripple
 * each leaves on the port it lands on), and only when `running` (or an ancestor carries `flow-on`).
 * Each wire starts as the one before it delivers, so the work is handed on from node to node.
 */
export function FlowFragment({
  nodes,
  orientation = "horizontal",
  size = "md",
  layout = "row",
  running,
  packets = 2,
  className,
  wireClassName,
}: FlowFragmentProps) {
  return (
    <div
      aria-hidden="true"
      className={cn("flow-fragment", running && "flow-on", className)}
      data-orient={DATA_ORIENT[orientation]}
    >
      {nodes.map((node, i) => (
        <Fragment key={i}>
          {i > 0 && (
            <FlowWire orient={orientation} packets={packets} hop={i - 1} className={wireClassName} />
          )}
          <FlowNode
            icon={node.icon}
            label={node.label}
            variant={node.variant ?? defaultVariant(i, nodes.length)}
            size={size}
            layout={layout}
            finish={node.finish}
            ports={{ in: i > 0, out: i < nodes.length - 1 }}
          />
        </Fragment>
      ))}
    </div>
  );
}

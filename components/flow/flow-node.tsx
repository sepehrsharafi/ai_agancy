import type { LucideIcon } from "lucide-react";
import { User } from "lucide-react";
import { IconTile, type IconTileTone } from "@/components/icon-tile";
import { cn } from "@/lib/cn";

export type FlowVariant = "plain" | "agent" | "done" | "human" | "input";
export type FlowSize = "sm" | "md" | "lg";
export type FlowLayout = "row" | "stack";

// Which tile a node's icon sits on. The agent is ultra with a haze tile; a finished node is
// mint with a white one; a person's node carries a butter tile and a small person chip.
const TILE: Record<FlowVariant, IconTileTone> = {
  plain: "plain",
  input: "haze",
  agent: "haze",
  done: "plain",
  human: "butter",
};

// Full class names, never built from strings, so Tailwind can see every utility. A row never
// shrinks (its label is one line); a stack may, down to its longest word, so a tight cover wraps.
const ROW = {
  sm: "shrink-0 gap-2 p-1.5 pe-3 rounded-[14px] text-label font-semibold tracking-normal",
  md: "shrink-0 gap-3 p-2 pe-4 rounded-2xl text-body font-semibold",
  lg: "shrink-0 gap-4 p-2.5 pe-6 rounded-[18px] text-h3",
} satisfies Record<FlowSize, string>;

const STACK = {
  sm: "min-w-0 flex-col gap-1.5 p-2 rounded-[14px] text-label font-semibold tracking-normal",
  md: "min-w-0 flex-col gap-2 px-3 pt-2.5 pb-3 rounded-2xl text-label font-semibold tracking-normal",
  lg: "min-w-0 flex-col gap-3 px-4 pt-3 pb-4 rounded-[18px] text-body font-semibold",
} satisfies Record<FlowSize, string>;

export type FlowNodeProps = {
  icon: LucideIcon;
  label: string;
  variant?: FlowVariant;
  size?: FlowSize;
  /** `row`: icon beside the label. `stack`: icon over the label, for tight covers. */
  layout?: FlowLayout;
  /** Ring in ultra: the step the flow is on. */
  active?: boolean;
  /** An icon the node changes to when the flow runs (see `flow-on`); it also turns the node mint. */
  finish?: LucideIcon;
  /** Which edges carry a port, set by the fragment from the node's place in the chain. The in-port is where a comet lands (the wire draws the ripple). */
  ports?: { in?: boolean; out?: boolean };
  className?: string;
};

/**
 * NODE: a rounded rectangle with a tile, an icon and a label. `agent` (ultra, white) is always the AI
 * step, `done` is mint, `input` and `human` are white with a 10% ink ring, `plain` is paper.
 * Decorative: the fragment that holds it is aria-hidden.
 */
export function FlowNode({
  icon,
  label,
  variant = "plain",
  size = "md",
  layout = "row",
  active,
  finish,
  ports,
  className,
}: FlowNodeProps) {
  const stack = layout === "stack";
  const tileSize = stack && size === "lg" ? "md" : size;
  return (
    <span
      className={cn("flow-node", stack ? STACK[size] : ROW[size], className)}
      data-variant={variant}
      data-active={active ? "" : undefined}
      data-agent={variant === "agent" ? "" : undefined}
      data-finish={finish ? "" : undefined}
    >
      {ports?.in && <span className="flow-port" data-edge="in" />}
      {ports?.out && <span className="flow-port" data-edge="out" />}
      <span className="flow-icon grid shrink-0">
        <IconTile icon={icon} tone={TILE[variant]} size={tileSize} className="flow-tile-a" />
        {finish && <IconTile icon={finish} tone="plain" size={tileSize} className="flow-tile-b" />}
      </span>
      <span className={cn("leading-tight", stack ? "max-w-24 text-center text-balance" : "whitespace-nowrap")}>
        {label}
      </span>
      {variant === "human" && (
        <span className="absolute -top-2 -inset-e-2 grid size-5 place-items-center rounded-full bg-ink text-white">
          <User size={12} strokeWidth={2} aria-hidden="true" />
        </span>
      )}
    </span>
  );
}

import type { ComponentProps } from "react";
import { cn } from "@/lib/cn";

export type ShapeName = "circle" | "square" | "quarter" | "arch" | "leaf";
export type ShapeColor = "ultra" | "sun" | "mint" | "ink" | "haze" | "mist" | "butter" | "white";
export type ShapeRotation = 0 | 90 | 180 | 270;

// Full class names, never built from strings, so Tailwind can see every utility.
const SHAPES = {
  circle: "shape-circle",
  square: "shape-square",
  quarter: "shape-quarter",
  arch: "shape-arch",
  leaf: "shape-leaf",
} satisfies Record<ShapeName, string>;

const COLORS = {
  ultra: "shape-ultra",
  sun: "shape-sun",
  mint: "shape-mint",
  ink: "shape-ink",
  haze: "shape-haze",
  mist: "shape-mist",
  butter: "shape-butter",
  white: "shape-white",
} satisfies Record<ShapeColor, string>;

const ROTATIONS = {
  0: "shape-r-0",
  90: "shape-r-90",
  180: "shape-r-180",
  270: "shape-r-270",
} satisfies Record<ShapeRotation, string>;

type ShapeProps = Omit<ComponentProps<"span">, "color"> & {
  shape: ShapeName;
  color: ShapeColor;
  rotate?: ShapeRotation;
};

/**
 * The brand primitive: a square box whose corner radii make the shape. Size it from
 * outside (`size-14`, `w-full`). To morph it, swap the utilities from a parent:
 * `group-hover:shape-arch group-hover:shape-r-90 group-hover:shape-sun`.
 * Transitions: border-radius, colour, rotate, translate, scale (spring, 700ms).
 * Stagger morphs with `style={{ transitionDelay: "60ms" }}`.
 */
export function Shape({ shape, color, rotate = 0, className, ...rest }: ShapeProps) {
  return (
    <span
      aria-hidden="true"
      className={cn("shape", SHAPES[shape], COLORS[color], ROTATIONS[rotate], className)}
      {...rest}
    />
  );
}

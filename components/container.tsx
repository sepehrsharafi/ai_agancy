import type { ComponentProps, ElementType } from "react";
import { cn } from "@/lib/cn";

type ContainerProps<T extends ElementType> = { as?: T } & Omit<ComponentProps<T>, "as">;

/** Max 90rem wide, with the fluid 16px-to-56px side gutter. */
export function Container<T extends ElementType = "div">({ as, className, ...rest }: ContainerProps<T>) {
  const Tag: ElementType = as ?? "div";
  return <Tag className={cn("mx-auto w-full max-w-site px-gutter", className)} {...rest} />;
}

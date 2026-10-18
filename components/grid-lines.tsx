import { cn } from "@/lib/cn";
import { Container } from "./container";
import { ThreadLayer } from "./thread";

// Which breakpoint each of the 12 columns first appears at: 4 on phones, 6 from md, 12 from lg.
const COLUMN_VISIBILITY = [
  "",
  "",
  "",
  "",
  "hidden md:block",
  "hidden md:block",
  "hidden lg:block",
  "hidden lg:block",
  "hidden lg:block",
  "hidden lg:block",
  "hidden lg:block",
  "hidden lg:block",
];

type GridLinesProps = {
  /**
   * `page`: one fixed layer behind the whole site, ink at 4%, hidden by any opaque field; it also
   * mounts the page's thread. `field`: absolutely fills its (positioned) parent in white at 15%,
   * for the footer's dark colour field.
   */
  variant?: "page" | "field";
};

/**
 * The Swiss column grid drawn as hairlines. It reuses Container + `grid-swiss`, so every line sits
 * exactly on a column's start edge (plus the container's end edge) at every breakpoint. Pure CSS:
 * no JS, no scroll listeners, and `contain: strict` on a fixed box means scrolling never repaints it.
 */
export function GridLines({ variant = "page" }: GridLinesProps) {
  const tone = variant === "page" ? "border-ink/4" : "border-white/15";
  return (
    <>
      <div
        aria-hidden="true"
        className={cn(
          "pointer-events-none -z-10 contain-strict",
          variant === "page" ? "fixed inset-0" : "absolute inset-0",
        )}
      >
        <Container className="h-full">
          <div
            className={cn(
              "grid-swiss relative h-full after:absolute after:inset-y-0 after:inset-e-0 after:border-s",
              variant === "page" ? "after:border-ink/4" : "after:border-white/15",
            )}
          >
            {COLUMN_VISIBILITY.map((visibility, i) => (
              <span key={i} className={cn("border-s", tone, visibility)} />
            ))}
          </div>
        </Container>
      </div>
      {variant === "page" && <ThreadLayer />}
    </>
  );
}

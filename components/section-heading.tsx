import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import { Shape } from "./shape";
import { accentFor, ThreadStation, type ThreadAccent } from "./thread";

/** Small precise label. The dot carries the colour, never the text; sections that are stations on the thread drop it. */
export function Eyebrow({
  children,
  className,
  dot = true,
}: {
  children: ReactNode;
  className?: string;
  dot?: boolean;
}) {
  return (
    <p className={cn("label flex items-center gap-2.5 text-ink-soft", className)}>
      {dot && <Shape shape="circle" color="ultra" className="size-2" />}
      {children}
    </p>
  );
}

type SectionHeadingProps = {
  eyebrow: string;
  title: string;
  lede?: string;
  /** Id for the <h2>, for aria-labelledby on the section. */
  headingId?: string;
  /** Colour of this section's station on the thread. Defaults from the heading id, then the label. */
  accent?: ThreadAccent;
  className?: string;
};

/**
 * Every section opens on a ruled hairline that the thread turns along, ending in a station
 * node, with the label just beneath. Swiss asymmetry: the label sits alone in a narrow start
 * column, the headline takes the wide column beside it, and the lede hangs under the
 * headline, not under the label.
 */
export function SectionHeading({ eyebrow, title, lede, headingId, accent, className }: SectionHeadingProps) {
  return (
    <div className={cn("grid-swiss relative gap-y-6 pt-4 lg:pt-5", className)}>
      <ThreadStation accent={accent ?? accentFor(headingId, eyebrow)} />
      <Eyebrow dot={false} className="col-span-full lg:col-span-3 lg:pt-2">
        {eyebrow}
      </Eyebrow>
      <h2 id={headingId} className="col-span-full font-display text-h2 lg:col-span-9">
        {title}
      </h2>
      {lede && (
        <p className="col-span-full max-w-xl text-lede text-ink-soft lg:col-span-7 lg:col-start-4">{lede}</p>
      )}
    </div>
  );
}

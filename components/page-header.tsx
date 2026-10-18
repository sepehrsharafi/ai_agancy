import type { CSSProperties, ReactNode } from "react";
import { cn } from "@/lib/cn";
import { Container } from "./container";
import { FlowFragment, type FlowNodeSpec } from "./flow/flow-fragment";
import { Eyebrow } from "./section-heading";
import { ThreadStation, type ThreadAccent } from "./thread";

type PageHeaderProps = {
  eyebrow?: string;
  title: string;
  lede?: string;
  /**
   * The three-node workflow drawn on a dot-grid canvas beside the title (>= 1024px). The first
   * node is the input, the last is done and the middle one is the agent, unless a node says otherwise.
   */
  flow?: { nodes: readonly FlowNodeSpec[]; tint?: "haze" | "mist" | "butter" };
  /** Colour of the page's first station on the thread. */
  accent?: ThreadAccent;
  /** Rendered under the lede, e.g. a ButtonLink. */
  children?: ReactNode;
};

const TINT = { haze: "bg-haze", mist: "bg-mist", butter: "bg-butter" } as const;

export function PageHeader({ eyebrow, title, lede, flow, accent = "ultra", children }: PageHeaderProps) {
  return (
    <header className="pt-32 pb-16 lg:pt-44 lg:pb-24">
      <Container className="grid-swiss">
        {/* The ruled opening: a full-width hairline, the label just beneath it. */}
        <div className="relative col-span-full pt-4 lg:pt-5">
          <ThreadStation accent={accent} />
          {eyebrow && (
            <Eyebrow dot={false} className="rise-in">
              {eyebrow}
            </Eyebrow>
          )}
        </div>
        <div className="col-span-full mt-10 lg:col-span-8">
          <h1
            className="rise-in font-display text-title"
            style={{ "--i": 1 } as CSSProperties}
          >
            {title}
          </h1>
          {lede && (
            <p
              className="rise-in mt-8 max-w-xl text-lede text-ink-soft"
              style={{ "--i": 2 } as CSSProperties}
            >
              {lede}
            </p>
          )}
          {children && <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4">{children}</div>}
        </div>
        {flow && (
          <div aria-hidden="true" className="hidden lg:col-span-4 lg:mt-10 lg:flex lg:justify-end">
            <div
              className={cn(
                "canvas rise-in grid w-full max-w-sm place-items-center rounded-card px-8 py-12",
                TINT[flow.tint ?? "haze"],
              )}
              style={{ "--i": 3 } as CSSProperties}
            >
              <FlowFragment nodes={flow.nodes} orientation="vertical" size="md" running packets={1} />
            </div>
          </div>
        )}
      </Container>
    </header>
  );
}

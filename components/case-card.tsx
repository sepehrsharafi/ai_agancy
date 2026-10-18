import {
  Bot,
  Check,
  ClipboardList,
  Database,
  FileSearch,
  FileText,
  Files,
  Inbox,
  ListChecks,
  MessageCircle,
  ReceiptText,
  CalendarCheck,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";
import type { Dictionary } from "@/content/en";
import { cn } from "@/lib/cn";
import { FlowFragment } from "./flow/flow-fragment";
import { FlowInView } from "./flow/flow-inview";

type CaseItem = Dictionary["cases"]["items"][number];

type CaseCardProps = { item: CaseItem; index: number; agent: string } & (
  | { variant: "teaser"; href: string }
  | { variant: "full"; href?: never }
);

/* ------------------------------------------------------------------ covers */

/*
 * The cover is a tinted dot-grid canvas holding a mini workflow: what comes in, the agent,
 * what comes out. Icons are chosen per case; the labels are the case's own `flow`.
 */
const ICONS: Record<string, readonly [input: LucideIcon, output: LucideIcon]> = {
  kalaland: [MessageCircle, ClipboardList],
  labkhand: [MessageCircle, CalendarCheck],
  tarazoo: [ReceiptText, Database],
  dadvar: [FileSearch, FileText],
  novinsoft: [Files, ListChecks],
  sara: [Inbox, FileText],
};

/*
 * On phones a cover is ~290px wide for three nodes and two wires, and a comet needs room: each
 * wire keeps at least 2.5rem (`--wire-min`) and the nodes shrink to pay for it (tighter padding,
 * a size-8 tile, a 12px label that wraps at 4rem). From md up nothing changes.
 */
const PHONE_NODES =
  "[--wire-min:2.5rem] max-md:[&_.flow-node]:px-2 max-md:[&_.flow-node]:pt-2 max-md:[&_.flow-node]:pb-2.5 max-md:[&_.flow-tile-a]:size-8 max-md:[&_.flow-tile-b]:size-8 max-md:[&_.flow-node>.leading-tight]:max-w-16 max-md:[&_.flow-node>.leading-tight]:text-[0.75rem]";

// Covers cycle haze -> mist -> butter by index.
const FIELDS = ["bg-haze", "bg-mist", "bg-butter"] as const;

/**
 * At rest a still diagram. On mouse hover or keyboard focus of the card the wires run (packets
 * travel), the output node turns mint with a check, and the agent's icon gives one small wiggle:
 * all of it from one `flow-on` class, switched by `flow-trigger`. On touch, where nothing hovers,
 * the same motion plays while the cover is on screen (FlowInView).
 */
function Cover({ item, index, agent }: { item: CaseItem; index: number; agent: string }) {
  const [input, output] = ICONS[item.id] ?? ICONS.kalaland;
  return (
    <FlowInView className={cn("case-cover canvas rounded-card max-md:p-3", FIELDS[index % FIELDS.length])}>
      <FlowFragment
        orientation="horizontal"
        size="md"
        layout="stack"
        packets={2}
        className={cn("w-full max-w-xl flow-trigger", PHONE_NODES)}
        nodes={[
          { icon: input, label: item.flow[0], variant: "input" },
          { icon: Bot, label: agent, variant: "agent" },
          { icon: output, label: item.flow[1], variant: "input", finish: Check },
        ]}
      />
    </FlowInView>
  );
}

/* ------------------------------------------------------------------- card */

// Slides toward the reading direction while the card is hovered or focused.
function Arrow() {
  return (
    <svg
      viewBox="0 0 16 16"
      aria-hidden="true"
      className="mt-1 size-5 shrink-0 scale-x-(--dir) fill-none stroke-current stroke-[1.75] transition-[translate] duration-500 ease-out group-hover/case:translate-x-(--arrow-shift) group-has-focus-visible/case:translate-x-(--arrow-shift)"
    >
      <path d="M2.5 8h11M9 3.5 13.5 8 9 12.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function Metric({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <p className="font-display text-h2">{value}</p>
      <p className="mt-2 max-w-xs text-ink-soft">{label}</p>
    </div>
  );
}

/**
 * A case: a tinted cover with a mini workflow that runs on hover or
 * focus, then the number that matters, who it was for, and what we built.
 * `teaser` (home) is one link to /work#id; `full` (work page) shows both metrics and the
 * summary, and is not a link.
 */
export function CaseCard(props: CaseCardProps) {
  const { item, index, agent } = props;
  const [first, second] = item.metrics;
  const who = (
    <p className="label text-ink-soft">
      {item.client} · {item.sector}
    </p>
  );

  if (props.variant === "teaser") {
    return (
      <article className="group/case relative flex h-full flex-col">
        <Cover item={item} index={index} agent={agent} />
        <div className="mt-6 flex flex-1 flex-col">
          <Metric value={first.value} label={first.label} />
          <div className="mt-auto pt-8">
            {who}
            <h3 className="mt-3 flex items-start justify-between gap-4 font-display text-h3">
              {/* The link stretches over the whole card; its name is the case title. */}
              <Link
                href={props.href}
                className="after:absolute after:inset-0 after:rounded-card focus-visible:outline-hidden focus-visible:after:outline-2 focus-visible:after:outline-offset-4 focus-visible:after:outline-ink"
              >
                {item.title}
              </Link>
              <Arrow />
            </h3>
          </div>
        </div>
      </article>
    );
  }

  return (
    <article id={item.id} className="group/case">
      <Cover item={item} index={index} agent={agent} />
      <div className="mt-8 grid grid-cols-2 gap-x-gridgap gap-y-6 border-t border-line pt-6">
        <Metric value={first.value} label={first.label} />
        <Metric value={second.value} label={second.label} />
      </div>
      <div className="mt-10">
        {who}
        <h3 className="mt-3 font-display text-h3">{item.title}</h3>
        <p className="mt-4 max-w-xl text-ink-soft">{item.summary}</p>
      </div>
    </article>
  );
}

import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/cn";

// A workflow node's face: the one tile every icon in the site sits on, so a service,
// a step in a flow and a principle all read as parts of the same system.
const TONES = {
  plain: "bg-white text-ink ring-1 ring-ink/10 ring-inset",
  agent: "bg-ultra text-white",
  mint: "bg-mint text-ink",
  sun: "bg-sun text-ink",
  ink: "bg-ink text-white",
  haze: "bg-haze text-ultra",
  mist: "bg-mist text-ink",
  butter: "bg-butter text-ink",
} as const;

const SIZES = {
  sm: { box: "size-8 rounded-[10px]", icon: 16 },
  md: { box: "size-11 rounded-[14px]", icon: 20 },
  lg: { box: "size-14 rounded-2xl", icon: 24 },
} as const;

export type IconTileTone = keyof typeof TONES;

type Props = {
  icon: LucideIcon;
  tone?: IconTileTone;
  size?: keyof typeof SIZES;
  className?: string;
};

export function IconTile({ icon: Icon, tone = "plain", size = "md", className }: Props) {
  const s = SIZES[size];
  return (
    <span aria-hidden="true" className={cn("inline-flex shrink-0 items-center justify-center", s.box, TONES[tone], className)}>
      <Icon size={s.icon} strokeWidth={1.75} absoluteStrokeWidth />
    </span>
  );
}

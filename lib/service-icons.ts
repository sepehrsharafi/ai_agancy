import {
  BookOpenText,
  GraduationCap,
  Inbox,
  MessagesSquare,
  ScanText,
  Workflow,
  type LucideIcon,
} from "lucide-react";

// Each service has an icon and two colours: `tint` is the light field the card rests on,
// `solid` is the colour the icon tile (and the card's flood) turns to on hover/focus.
// Tints run haze mist butter / mist butter haze, so no two neighbours match in the
// 3-column grid or the single column. Ultra takes white text, mint and sun take ink.
export type ServiceIcon = {
  icon: LucideIcon;
  tint: "haze" | "mist" | "butter";
  solid: "ultra" | "mint" | "sun";
};

export const SERVICE_ICONS: Record<string, ServiceIcon> = {
  assistant: { icon: Inbox, tint: "haze", solid: "ultra" },
  workflows: { icon: Workflow, tint: "mist", solid: "mint" },
  support: { icon: MessagesSquare, tint: "butter", solid: "sun" },
  knowledge: { icon: BookOpenText, tint: "mist", solid: "mint" },
  documents: { icon: ScanText, tint: "butter", solid: "sun" },
  training: { icon: GraduationCap, tint: "haze", solid: "ultra" },
};

import { cn } from "@/lib/cn";

/**
 * A circle with one quarter removed: a geometric mark. Also the source of app/icon.svg.
 * `logo-mark` is the hook for the pending-navigation turn (app/styles/transitions.css).
 */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" aria-hidden="true" className={cn("logo-mark shrink-0 fill-ultra", className)}>
      <path d="M16 16V4a12 12 0 1 0 12 12Z" />
    </svg>
  );
}

/** Mark + wordmark. The wordmark is always Latin "NOVA", in Satoshi Black, even on /fa. */
export function Logo({ className }: { className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-2", className)} dir="ltr">
      <LogoMark className="size-7" />
      <span className="text-wordmark text-ink">NOVA</span>
    </span>
  );
}

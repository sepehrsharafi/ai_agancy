"use client";

import { useLinkStatus } from "next/link";

/**
 * Drop inside a <Link>. While that link's navigation is pending it renders a hidden marker
 * (no layout, no state to share); CSS in app/styles/transitions.css turns the nav logo with
 * `.nav-island:has([data-link-pending])`. Prefetched navigations commit before it ever paints.
 */
export function LinkPending() {
  const { pending } = useLinkStatus();
  return pending ? <span hidden data-link-pending="" /> : null;
}

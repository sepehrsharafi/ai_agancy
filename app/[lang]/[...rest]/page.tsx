import { notFound } from "next/navigation";

// Unmatched URLs under a locale. Without this, Next would render its built-in 404 outside
// the [lang] layout; calling notFound() here renders app/[lang]/not-found.tsx inside it.
export default function UnmatchedPage() {
  notFound();
}

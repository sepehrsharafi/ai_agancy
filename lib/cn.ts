/** Joins class names, skipping falsy values. Not a merger: don't pass conflicting utilities. */
export function cn(...parts: (string | false | null | undefined)[]) {
  return parts.filter(Boolean).join(" ");
}

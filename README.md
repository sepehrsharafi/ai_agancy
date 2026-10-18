# Nova

Bilingual (English + Farsi, RTL) static marketing site for Nova, a studio that designs and builds AI agents and workflow automations. Next.js 16 (App Router, Cache Components), React 19, Tailwind 4, TypeScript. Every route is prerendered; no backend.

## Scripts

```bash
npm run dev      # dev server on http://localhost:3000
npm run build    # production build (all pages should be ○ static)
npm run start    # serve the production build
npm run lint     # eslint
npx tsc --noEmit # types (run `npx next typegen` first on a fresh checkout)
```

## Structure

```
app/
  globals.css        design tokens (@theme), base styles, shared @utility blocks
  icon.svg           logo mark
  [lang]/            root layout (html lang/dir, fonts, nav, footer) and all pages
proxy.ts             redirects unprefixed paths to /en or /fa by Accept-Language
content/en.ts fa.ts  ALL copy. fa.ts must match the shape of en.ts (Dictionary)
lib/
  i18n.ts            server entry: getLocale(), getDictionary() (+ re-exports locale.ts)
  locale.ts          client-safe: locales, Locale, dir(), localePath(), formatNumber()
  site.ts            contact details and the nav route list
  fonts.ts           Satoshi, Alexandria, Vazirmatn
  metadata.ts        per-page metadata with hreflang alternates
components/          shape, logo, container, button-link, section-heading, page-header, footer
components/nav/      the nav island (client) and the language switch
components/home/     one file per home section
```

Design rules live in the tokens: there is no `text-sm` or `bg-gray-500`. Use `text-display|title|h2|h3|stat|lede|body|label`, the palette (`paper ink ink-soft line ultra mint sun haze mist butter`), `px-gutter`, `py-section`, `gap-gridgap`, `max-w-site`, `grid-swiss`, and logical utilities (`ms-` `pe-` `start-` `text-start`) so RTL mirrors for free.

The visual language is workflows: `components/flow/*` (nodes, wires, packets, a dot-grid `canvas`) and `components/icon-tile.tsx` (lucide icons on a node face). `<Shape>` is only for small functional dots.

## Adding or changing a string

1. Add the key to `content/en.ts` (the `Dictionary` type is derived from it).
2. Add the same key to `content/fa.ts`; TypeScript fails until both match.
3. Read it in a server component with `const t = await getDictionary()` and pass strings down as props. Client components import from `@/lib/locale`, never `@/lib/i18n`.

Numbers that come from data (hours, counts) go through `formatNumber(locale, n)` so `/fa` shows Persian digits. The wordmark is always Latin "NOVA".

## Adding a page

Create `app/[lang]/<name>/page.tsx`, add `export const generateMetadata = () => pageMetadata("<name>")` (add its title and description under `meta.pages` in both content files), and add it to `navRoutes` in `lib/site.ts` if it belongs in the nav.

import { Vazirmatn } from "next/font/google";
import localFont from "next/font/local";

// Latin display + body. Also first in every Farsi stack so Latin words stay Satoshi.
// The unicode-range keeps Satoshi to Latin + punctuation (ZWNJ/ZWJ/bidi marks excluded),
// and the generated Arial fallback is off: Arial has Arabic glyphs, so it would catch
// every Farsi character before Alexandria/Vazirmatn got a chance.
export const satoshi = localFont({
  src: "../app/fonts/Satoshi-Variable.woff2",
  variable: "--font-satoshi",
  weight: "300 900",
  display: "swap",
  preload: true,
  adjustFontFallback: false,
  declarations: [
    {
      prop: "unicode-range",
      value:
        "U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-200B, U+2010-206F, U+20AC, U+2122, U+2190-2199, U+2212, U+2215",
    },
  ],
});

// Farsi vertical centring. In a Farsi stack Satoshi is still first, so every line box takes Satoshi's
// vertical metrics (ascent 1.01em, descent 0.24em) while the glyphs come from Vazirmatn/Alexandria,
// whose ink sits ~0.11em lower in that box. This second Satoshi instance (same file, so one download)
// is used ONLY by the Farsi stacks (see globals.css) and re-splits the SAME 125% total: ascent down,
// descent up, so line heights are unchanged and Persian text just moves up ~0.11em inside its line box.
// TUNE during review: the two override values in `declarations` below (ascent 90%, descent 35%);
// keep them summing to 125%. A lower ascent / higher descent lifts Persian text further. They are
// literals because next/font only accepts explicitly written values. English never sees them.

export const satoshiFa = localFont({
  src: "../app/fonts/Satoshi-Variable.woff2",
  variable: "--font-satoshi-fa",
  weight: "300 900",
  display: "swap",
  // Same file as `satoshi`, which already preloads it.
  preload: false,
  adjustFontFallback: false,
  declarations: [
    {
      prop: "unicode-range",
      value:
        "U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-200B, U+2010-206F, U+20AC, U+2122, U+2190-2199, U+2212, U+2215",
    },
    { prop: "ascent-override", value: "90%" },
    { prop: "descent-override", value: "35%" },
  ],
});

// Farsi display. The unicode-range deliberately EXCLUDES the Arabic/Persian digits
// (U+0660-0669, U+06F0-06F9): Alexandria draws them in the Arabic style, so digits fall
// through to Vazirmatn.
export const alexandria = localFont({
  src: "../app/fonts/Alexandria-Arabic-Variable.woff2",
  variable: "--font-alexandria",
  weight: "400 800",
  display: "swap",
  preload: false,
  // Arial fallback would swallow the digits meant for Vazirmatn.
  adjustFontFallback: false,
  declarations: [
    {
      prop: "unicode-range",
      value: "U+0600-065F, U+066A, U+066D-06EF, U+06FA-06FF, U+200C-200E, U+FB50-FDFF, U+FE70-FEFC",
    },
  ],
});

// Farsi body.
export const vazirmatn = Vazirmatn({
  subsets: ["arabic"],
  variable: "--font-vazirmatn",
  display: "swap",
  preload: false,
});

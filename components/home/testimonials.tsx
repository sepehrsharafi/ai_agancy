import type { CSSProperties } from "react";
import type { Dictionary } from "@/content/en";
import { Container } from "@/components/container";
import { Rail } from "@/components/rail";
import { SectionHeading } from "@/components/section-heading";
import { Shape } from "@/components/shape";
import { formatNumber, getLocale } from "@/lib/i18n";

type Props = { t: Dictionary["testimonials"] };

/*
 * The quieter dot grid behind the quotes. It is the section's own -z-10 child, and the section is
 * deliberately NOT `isolate`: an isolated section would be one stacking context below the page
 * thread and would hold its cards under the line too (see `above-thread`, chrome.css). Left in the
 * root context, the backdrop sits below the thread, which therefore stays visible over it.
 */
function Backdrop() {
  return <div aria-hidden="true" className="canvas-quiet pointer-events-none absolute inset-0 -z-10 bg-haze" />;
}

// Avatars cycle through the brand colours; white initials on the two darker ones.
const AVATARS = [
  { color: "ultra", text: "text-white" },
  { color: "mint", text: "text-white" },
  { color: "sun", text: "text-ink" },
] as const;

const TITLES = new Set(["dr", "دکتر"]);

/**
 * First letter of the first two words of a name, honorifics skipped. Arabic-script letters
 * are separated by a ZWNJ so they do not join into a word of their own.
 */
function initialsOf(name: string) {
  const words = name.split(/\s+/).filter((word) => !TITLES.has(word.replace(/\.$/, "").toLowerCase()));
  const letters = words.slice(0, 2).map((word) => Array.from(word)[0]);
  return letters.join(/\p{Script=Arabic}/u.test(name) ? "‌" : "").toUpperCase();
}

/**
 * White quote cards in a swipeable rail with a segmented pager, at every size: one card and a
 * peek of the next on phones, two on tablets, three and a peek on desktop. The section has no
 * overflow clip and no stacking context of its own, so the rail can pass in front of the thread.
 */
export async function Testimonials({ t }: Props) {
  const locale = await getLocale();
  const total = formatNumber(locale, t.items.length);
  const pagerLabels = t.items.map((_, i) =>
    t.show.replace("{n}", formatNumber(locale, i + 1)).replace("{total}", total),
  );

  return (
    <section id="testimonials" aria-labelledby="testimonials-title" className="relative py-section">
      <Backdrop />

      <Container>
        <SectionHeading headingId="testimonials-title" eyebrow={t.eyebrow} title={t.title} />
      </Container>

      <Rail
        label={t.title}
        previous={t.previous}
        next={t.next}
        pagerLabels={pagerLabels}
        className="mt-6 md:mt-12 lg:mt-16"
        listClassName="gap-3 lg:gap-5"
      >
        {t.items.map((item, i) => {
          const avatar = AVATARS[i % AVATARS.length];
          return (
            <li
              key={item.name}
              className="rise-in w-[calc(100%-3rem)] shrink-0 snap-start md:w-[44%] lg:w-[31%]"
              style={{ "--i": i } as CSSProperties}
            >
              <figure className="flex h-full flex-col rounded-card bg-white p-6">
                <div className="pb-8">
                  {/* A Bauhaus quotation mark: two quarter discs. */}
                  <div aria-hidden="true" className="flex gap-1">
                    <Shape shape="quarter" color="ultra" rotate={270} className="size-5" />
                    <Shape shape="quarter" color="ultra" rotate={270} className="size-5" />
                  </div>
                  <blockquote className="mt-6 text-lede leading-[max(var(--text-lede--line-height),1.6)]">
                    <p>{item.quote}</p>
                  </blockquote>
                </div>
                <figcaption className="mt-auto flex items-center gap-3 border-t border-line pt-5">
                  <span
                    aria-hidden="true"
                    className={`relative grid size-10 shrink-0 place-items-center text-sm font-semibold ${avatar.text}`}
                  >
                    <Shape shape="circle" color={avatar.color} className="absolute inset-0 size-full" />
                    <span className="relative">{initialsOf(item.name)}</span>
                  </span>
                  <div>
                    <span className="block font-semibold">{item.name}</span>
                    <span className="block text-sm text-ink-soft">{item.role}</span>
                  </div>
                </figcaption>
              </figure>
            </li>
          );
        })}
      </Rail>
    </section>
  );
}

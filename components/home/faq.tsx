import type { Dictionary } from "@/content/en";
import { Container } from "@/components/container";
import { Eyebrow } from "@/components/section-heading";
import { ThreadStation, accentFor } from "@/components/thread";

type Props = { t: Dictionary["faq"] };

/** Marker: two bars; the vertical one turns 90deg when the item opens, making a minus. */
function Marker() {
  return (
    <span aria-hidden="true" className="relative mt-1 block size-5 shrink-0 max-md:mt-0 max-md:in-[:lang(fa)]:mt-0.5">
      <span className="absolute inset-x-0 top-1/2 h-0.5 -translate-y-1/2 bg-ink transition-colors duration-300 group-hover/q:bg-ultra group-focus-visible/q:bg-ultra" />
      <span className="absolute inset-0 mx-auto w-0.5 bg-ink transition-[rotate,background-color] duration-500 ease-out group-hover/q:bg-ultra group-focus-visible/q:bg-ultra group-open/faq:rotate-90" />
    </span>
  );
}

export function Faq({ t }: Props) {
  return (
    <section id="faq" aria-labelledby="faq-title" className="py-section">
      <Container>
        <div className="grid-swiss relative gap-y-12 pt-4 lg:pt-5">
          <ThreadStation accent={accentFor("faq-title", t.eyebrow)} />
          <div className="col-span-full self-start lg:sticky lg:top-32 lg:col-span-5">
            <Eyebrow dot={false} className="lg:pt-2">{t.eyebrow}</Eyebrow>
            <h2 id="faq-title" className="mt-6 font-display text-h2">
              {t.title}
            </h2>
          </div>
          <div className="col-span-full lg:col-span-7 lg:col-start-6">
            {t.items.map((item, index) => (
              <details
                key={item.question}
                open={index === 0}
                className="faq-item group/faq border-t border-line last:border-b"
              >
                <summary className="faq-summary group/q flex items-start justify-between gap-6 py-6 font-display text-h3 max-md:text-[1.125rem] max-md:font-semibold max-md:in-[:lang(fa)]:text-[1.0625rem]">
                  {item.question}
                  <Marker />
                </summary>
                <div className="faq-answer">
                  <p className="max-w-xl pb-8 text-ink-soft">{item.answer}</p>
                </div>
              </details>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}

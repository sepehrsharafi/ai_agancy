import type { Dictionary } from "@/content/en";
import { ButtonLink } from "@/components/button-link";
import { CaseCard } from "@/components/case-card";
import { Container } from "@/components/container";
import { Rail } from "@/components/rail";
import { SectionHeading } from "@/components/section-heading";
import { formatNumber, localePath, type Locale } from "@/lib/locale";

type Props = { t: Dictionary["cases"]; locale: Locale };

/**
 * First three cases. Phones and tablets get the shared rail and pager (first card on the content
 * edge, the next one peeking in); from 1024px it is three columns, everything is visible and the
 * pager steps aside. Below lg the cards paint the page colour so the thread passes behind them
 * (a case card's text sits on no background of its own).
 */
export function CasesTeaser({ t, locale }: Props) {
  const work = localePath(locale, "/work");
  const items = t.items.slice(0, 3);
  const total = formatNumber(locale, items.length);
  const pagerLabels = items.map((_, i) =>
    t.show.replace("{n}", formatNumber(locale, i + 1)).replace("{total}", total),
  );

  return (
    <section id="work" aria-labelledby="work-title" className="py-section">
      <Container>
        <SectionHeading headingId="work-title" eyebrow={t.eyebrow} title={t.title} lede={t.lede} />
      </Container>
      <Rail
        label={t.title}
        previous={t.previous}
        next={t.next}
        pagerLabels={pagerLabels}
        className="mt-16 lg:mt-20"
        listClassName="gap-3 md:gap-gridgap lg:grid lg:snap-none lg:grid-cols-3 lg:overflow-visible"
        pagerClassName="lg:hidden"
      >
        {items.map((item, index) => (
          <li key={item.id} className="w-[calc(100%-3rem)] shrink-0 snap-start max-lg:bg-paper md:w-[44%] lg:w-auto">
            <CaseCard variant="teaser" item={item} index={index} agent={t.agent} href={`${work}#${item.id}`} />
          </li>
        ))}
      </Rail>
      <Container className="mt-14">
        <ButtonLink href={work} variant="text">
          {t.more}
        </ButtonLink>
      </Container>
    </section>
  );
}

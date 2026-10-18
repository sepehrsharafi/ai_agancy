import type { Dictionary } from "@/content/en";
import { ButtonLink } from "@/components/button-link";
import { Container } from "@/components/container";
import { SectionHeading } from "@/components/section-heading";
import { ServiceCard } from "@/components/service-card";
import { localePath, type Locale } from "@/lib/locale";

type Props = { t: Dictionary["services"]; locale: Locale };

export function Services({ t, locale }: Props) {
  return (
    <section id="services" aria-labelledby="services-title" className="py-section">
      <Container>
        <SectionHeading headingId="services-title" eyebrow={t.eyebrow} title={t.title} lede={t.lede} />
        <ul className="mt-14 grid gap-gridgap sm:grid-cols-2 lg:mt-20 lg:grid-cols-3">
          {t.items.map((item) => (
            <li key={item.id} className="grid">
              <ServiceCard
                id={item.id}
                title={item.title}
                description={item.description}
                examples={item.examples}
                examplesLabel={t.examplesLabel}
                href={localePath(locale, `/services#${item.id}`)}
              />
            </li>
          ))}
        </ul>
        <div className="mt-12">
          <ButtonLink href={localePath(locale, "/services")} variant="text">
            {t.more}
          </ButtonLink>
        </div>
      </Container>
    </section>
  );
}

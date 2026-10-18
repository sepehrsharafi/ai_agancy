import type { Dictionary } from "@/content/en";
import { Container } from "@/components/container";
import { SectionHeading } from "@/components/section-heading";
import type { Locale } from "@/lib/locale";
import { AudiencePicker } from "./audience-picker";

type Props = { t: Dictionary["audience"]; locale: Locale };

// Server-rendered shell; the picker is a small client island that gets only the strings it needs.
export function Audience({ t, locale }: Props) {
  return (
    <section id="audience" aria-labelledby="audience-title" className="py-section">
      <Container>
        <SectionHeading headingId="audience-title" eyebrow={t.eyebrow} title={t.title} lede={t.lede} />
        <AudiencePicker
          className="mt-14 lg:mt-20"
          segments={t.segments}
          locale={locale}
          listLabel={t.eyebrow}
          timeBack={t.timeBack}
          hoursPerWeek={t.hoursPerWeek}
          total={t.total}
          days={t.days}
          none={t.none}
          daysShort={t.daysShort}
          pick={t.pick}
          pickHint={t.pickHint}
          cta={t.cta}
          note={t.note}
        />
      </Container>
    </section>
  );
}

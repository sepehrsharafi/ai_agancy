import type { Dictionary } from "@/content/en";
import { Container } from "@/components/container";
import { SectionHeading } from "@/components/section-heading";
import { formatNumber, getLocale } from "@/lib/i18n";
import { ProcessTimeline } from "./process-timeline";

type Props = { t: Dictionary["process"] };

// Server shell. Numerals are formatted here (Persian digits on /fa) so the client
// timeline never needs the locale.
export async function Process({ t }: Props) {
  const locale = await getLocale();

  return (
    <section id="process" aria-labelledby="process-title" className="py-section">
      <Container>
        <SectionHeading headingId="process-title" eyebrow={t.eyebrow} title={t.title} lede={t.lede} />
        <ProcessTimeline steps={t.steps} numerals={t.steps.map((_, i) => formatNumber(locale, i + 1))} />
      </Container>
    </section>
  );
}

import type { Metadata } from "next";
import { Bot, CalendarCheck, Mail } from "lucide-react";
import { Container } from "@/components/container";
import { Faq } from "@/components/home/faq";
import { Process } from "@/components/home/process";
import { PageHeader } from "@/components/page-header";
import { ServiceRow } from "@/components/pages/service-row";
import { getDictionary, getLocale } from "@/lib/i18n";
import { pageMetadata } from "@/lib/metadata";

export const generateMetadata = (): Promise<Metadata> => pageMetadata("services");

export default async function Page() {
  const [locale, t] = await Promise.all([getLocale(), getDictionary()]);
  const { eyebrow, title, lede, flow } = t.pages.services;
  const { items, examplesLabel, fitLabel, timelineLabel } = t.services;
  const labels = { examplesLabel, fitLabel, timelineLabel };
  // "01".."06" on each card; Persian digits on /fa.
  const indexFormat = new Intl.NumberFormat(locale === "fa" ? "fa-IR" : "en-US", {
    minimumIntegerDigits: 2,
  });

  return (
    <>
      <PageHeader
        eyebrow={eyebrow}
        title={title}
        lede={lede}
        flow={{
          tint: "haze",
          nodes: [
            { icon: Mail, label: flow[0] },
            { icon: Bot, label: flow[1] },
            { icon: CalendarCheck, label: flow[2] },
          ],
        }}
      />
      <section aria-label={t.services.title}>
        <Container className="flex flex-col gap-4 md:gap-6">
          {items.map((service, i) => (
            <ServiceRow
              key={service.id}
              service={service}
              labels={labels}
              position={i}
              indexLabel={indexFormat.format(i + 1)}
            />
          ))}
        </Container>
      </section>
      <Process t={t.process} />
      <Faq t={t.faq} />
    </>
  );
}

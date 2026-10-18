import type { Metadata } from "next";
import { Bot, MessagesSquare, TrendingUp } from "lucide-react";
import { CaseCard } from "@/components/case-card";
import { Container } from "@/components/container";
import { Testimonials } from "@/components/home/testimonials";
import { PageHeader } from "@/components/page-header";
import { getDictionary } from "@/lib/i18n";
import { pageMetadata } from "@/lib/metadata";

export const generateMetadata = (): Promise<Metadata> => pageMetadata("work");

export default async function Page() {
  const t = await getDictionary();
  const { eyebrow, title, lede, flow } = t.pages.work;

  return (
    <>
      <PageHeader
        eyebrow={eyebrow}
        title={title}
        lede={lede}
        flow={{
          tint: "mist",
          nodes: [
            { icon: MessagesSquare, label: flow[0] },
            { icon: Bot, label: flow[1] },
            { icon: TrendingUp, label: flow[2] },
          ],
        }}
      />
      <section aria-label={title} className="pb-section">
        <Container>
          <ul className="grid gap-x-gridgap gap-y-20 md:grid-cols-2 lg:gap-y-28">
            {t.cases.items.map((item, index) => (
              // The second column sits lower: a Swiss stagger, not a table.
              <li key={item.id} className="md:even:mt-24">
                <CaseCard variant="full" item={item} index={index} agent={t.cases.agent} />
              </li>
            ))}
          </ul>
        </Container>
      </section>
      <Testimonials t={t.testimonials} />
    </>
  );
}

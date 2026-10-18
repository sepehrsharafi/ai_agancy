import type { Metadata } from "next";
import { Phone, Send, Users } from "lucide-react";
import { Container } from "@/components/container";
import { PageHeader } from "@/components/page-header";
import { BriefBuilder } from "@/components/pages/brief-builder";
import { Channels } from "@/components/pages/channels";
import { getDictionary, getLocale } from "@/lib/i18n";
import { pageMetadata } from "@/lib/metadata";
import { site } from "@/lib/site";

export const generateMetadata = (): Promise<Metadata> => pageMetadata("contact");

export default async function Page() {
  const [locale, t] = await Promise.all([getLocale(), getDictionary()]);
  const { eyebrow, title, lede, flow, form, channels } = t.pages.contact;

  return (
    <>
      <PageHeader
        eyebrow={eyebrow}
        title={title}
        lede={lede}
        flow={{
          tint: "haze",
          nodes: [
            { icon: Send, label: flow[0] },
            { icon: Users, label: flow[1], variant: "human" },
            { icon: Phone, label: flow[2] },
          ],
        }}
      />
      <section className="pb-section">
        <Container className="grid-swiss gap-y-16">
          <div className="col-span-full lg:col-span-7">
            <BriefBuilder t={form} locale={locale} email={site.email} />
          </div>
          <div className="col-span-full lg:col-span-4 lg:col-start-9">
            <Channels t={channels} />
          </div>
        </Container>
      </section>
    </>
  );
}

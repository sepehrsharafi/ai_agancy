import type { Metadata } from "next";
import { Audience } from "@/components/home/audience";
import { CasesTeaser } from "@/components/home/cases-teaser";
import { Faq } from "@/components/home/faq";
import { Hero } from "@/components/home/hero";
import { Process } from "@/components/home/process";
import { Services } from "@/components/home/services";
import { Testimonials } from "@/components/home/testimonials";
import { getDictionary, getLocale } from "@/lib/i18n";
import { homeMetadata } from "@/lib/metadata";

export const generateMetadata = (): Promise<Metadata> => homeMetadata();

export default async function HomePage() {
  const [locale, t] = await Promise.all([getLocale(), getDictionary()]);

  return (
    <>
      <Hero t={t.hero} locale={locale} />
      <Audience t={t.audience} locale={locale} />
      <Services t={t.services} locale={locale} />
      <Process t={t.process} />
      <CasesTeaser t={t.cases} locale={locale} />
      <Testimonials t={t.testimonials} />
      <Faq t={t.faq} />
    </>
  );
}

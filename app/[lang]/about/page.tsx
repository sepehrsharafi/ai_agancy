import type { Metadata } from "next";
import { Bot, Clock, Users } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { AboutFacts } from "@/components/pages/about-facts";
import { AboutPrinciples } from "@/components/pages/about-principles";
import { AboutStory } from "@/components/pages/about-story";
import { AboutTeam } from "@/components/pages/about-team";
import { getDictionary } from "@/lib/i18n";
import { pageMetadata } from "@/lib/metadata";

export const generateMetadata = (): Promise<Metadata> => pageMetadata("about");

export default async function Page() {
  const t = await getDictionary();
  const { eyebrow, title, lede, flow, story, timeline, facts, principlesTitle, principles, teamTitle, team } = t.pages.about;

  return (
    <>
      <PageHeader
        eyebrow={eyebrow}
        title={title}
        lede={lede}
        flow={{
          tint: "butter",
          nodes: [
            { icon: Users, label: flow[0] },
            { icon: Bot, label: flow[1] },
            { icon: Clock, label: flow[2] },
          ],
        }}
      />
      <AboutStory story={story} timeline={timeline} />
      <AboutFacts facts={facts} />
      <AboutPrinciples title={principlesTitle} principles={principles} />
      <AboutTeam title={teamTitle} team={team} />
    </>
  );
}

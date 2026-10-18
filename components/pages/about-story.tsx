import { Bot, CalendarCheck, Check, Megaphone } from "lucide-react";
import { Container } from "@/components/container";
import { FlowFragment } from "@/components/flow/flow-fragment";
import { FlowInView } from "@/components/flow/flow-inview";
import type { Dictionary } from "@/content/en";

type Props = {
  story: Dictionary["pages"]["about"]["story"];
  timeline: Dictionary["pages"]["about"]["timeline"];
};

/**
 * "Since 2023" in three nodes: the first agent, the word getting around, the forty-odd today.
 * A still diagram at rest. It runs like a case card: the wires carry packets and the last node
 * turns mint with a check while a mouse hovers it, or, on touch, while it is on screen
 * (`flow-trigger` reads `group/case` and FlowInView's `data-inview`).
 */
function Timeline({ timeline }: { timeline: Props["timeline"] }) {
  const [first, second, third] = timeline;
  return (
    <FlowInView className="group/case canvas mt-14 rounded-card bg-butter p-6 sm:p-8">
      <FlowFragment
        orientation="responsive-xl"
        size="md"
        packets={2}
        wireClassName="[--wire-len:2.25rem]"
        className="w-full flow-trigger"
        nodes={[
          { icon: CalendarCheck, label: first, variant: "input" },
          { icon: Megaphone, label: second, variant: "plain" },
          { icon: Bot, label: third, variant: "input", finish: Check },
        ]}
      />
    </FlowInView>
  );
}

/**
 * The first paragraph as a pull-statement (cols 3-11 on desktop; the first two columns stay
 * empty), the rest as body copy, then the timeline.
 */
export function AboutStory({ story, timeline }: Props) {
  const [lead, ...rest] = story;
  return (
    <section className="pb-section">
      <Container className="grid-swiss">
        <div className="col-span-full lg:col-span-9 lg:col-start-3">
          <p className="max-w-3xl font-display text-h3 font-medium leading-(--text-lede--line-height) text-ink">
            {lead}
          </p>
          <div className="mt-10 max-w-xl space-y-6">
            {rest.map((paragraph, i) => (
              <p key={i} className="text-ink-soft">
                {paragraph}
              </p>
            ))}
          </div>
          <Timeline timeline={timeline} />
        </div>
      </Container>
    </section>
  );
}

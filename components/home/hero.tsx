import type { CSSProperties } from "react";
import type { Dictionary } from "@/content/en";
import { ButtonLink } from "@/components/button-link";
import { Container } from "@/components/container";
import { HeroBackdrop } from "@/components/home/hero-backdrop";
import { HeroDemo } from "@/components/home/hero-demo";
import { Eyebrow } from "@/components/section-heading";
import { Languages, Lightbulb, Plug, Rocket, type LucideIcon } from "lucide-react";
import { IconTile } from "@/components/icon-tile";
import { Shape } from "@/components/shape";
import { localePath, type Locale } from "@/lib/locale";

type Props = { t: Dictionary["hero"]; locale: Locale };

// One tiny icon per fact along the bottom: languages, tools, time to launch.
const FACT_ICONS: LucideIcon[] = [Languages, Plug, Rocket];

// Headline, lede and CTAs are server-rendered here. The interactive before/after workflow
// (tabs, the Today | With Nova switch, nodes, wire, metrics) is the client island in
// components/home/hero-demo.tsx; it receives only the strings it needs.
export function Hero({ t, locale }: Props) {
  const lastLine = t.titleLines.length - 1;

  return (
    <section id="hero" aria-labelledby="hero-title" className="relative isolate flex min-h-svh flex-col pt-24 pb-6 lg:pt-20 lg:pb-2">
      <HeroBackdrop />
      <Container className="flex flex-1 flex-col">
        <div className="grid-swiss flex-1 content-center gap-y-8 py-4 lg:gap-y-12 lg:py-0">
          {/* Desktop: the eyebrow sits on the tabs row; headline, lede and buttons are one group,
              vertically centred between the poster's top and bottom caption rows. */}
          <div className="hero-copy col-span-full lg:col-span-6">
            <Eyebrow className="rise-in lg:h-10">{t.eyebrow}</Eyebrow>
            <div className="mt-5 lg:mt-0 lg:flex lg:flex-1 lg:flex-col lg:justify-center lg:pt-4">
              <h1 id="hero-title" className="font-display text-display">
                {t.titleLines.map((line, i) => (
                  <span key={line} className="rise-in block" style={{ "--i": i + 1 } as CSSProperties}>
                    {line}
                    {i === lastLine && (
                      <span aria-hidden="true" className="headline-dot">
                        <Shape shape="circle" color="ultra" className="size-full" />
                      </span>
                    )}{" "}
                  </span>
                ))}
              </h1>
              <p
                className="rise-in mt-6 max-w-lede text-lede text-ink-soft"
                style={{ "--i": t.titleLines.length + 1 } as CSSProperties}
              >
                {t.lede}
              </p>
              <div
                className="rise-in mt-6 flex flex-wrap items-center gap-x-8 gap-y-4 lg:mt-8 lg:gap-y-5"
                style={{ "--i": t.titleLines.length + 2 } as CSSProperties}
              >
                <ButtonLink href={localePath(locale, "/contact")}>{t.primary}</ButtonLink>
                <ButtonLink href={localePath(locale, "/services")} variant="text">
                  {t.secondary}
                </ButtonLink>
              </div>
              <p
                className="rise-in mt-5 flex max-w-lede items-start gap-2 text-ink-soft"
                style={{ "--i": t.titleLines.length + 3 } as CSSProperties}
              >
                <Lightbulb size={16} strokeWidth={1.75} absoluteStrokeWidth aria-hidden="true" className="mt-1 shrink-0" />
                {t.helper}
              </p>
            </div>
          </div>

          <div className="col-span-full lg:col-span-6">
            <HeroDemo locale={locale} label={t.demoLabel} xray={t.xray} useCases={t.useCases} />
          </div>
        </div>

        <ul className="label flex flex-wrap items-center gap-x-10 gap-y-2 pt-4 text-ink-soft lg:gap-y-3 lg:pt-2">
          {t.facts.map((fact, i) => (
            <li key={fact} className="flex items-center gap-3">
              <IconTile icon={FACT_ICONS[i % FACT_ICONS.length]} tone="plain" size="sm" />
              {fact}
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}

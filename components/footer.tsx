import { Bot, Check, ListTodo } from "lucide-react";
import Link from "next/link";
import type { Dictionary } from "@/content/en";
import { localePath, type Locale } from "@/lib/locale";
import { navRoutes, site } from "@/lib/site";
import { ButtonLink } from "./button-link";
import { Container } from "./container";
import { FlowFragment } from "./flow/flow-fragment";
import { GridLines } from "./grid-lines";
import { LangSwitch } from "./nav/lang-switch";
import { Shape } from "./shape";

/** White, shifting to sun with an underline on hover and focus: colour only, nothing moves. */
const linkClass =
  "inline-flex items-center rounded-pill py-1 text-body font-medium underline decoration-transparent decoration-1 underline-offset-4 transition-colors duration-300 ease-out hover:text-sun hover:decoration-current focus-visible:text-sun focus-visible:decoration-current";

/** The nav logo is ink + ultra; on the ink field it is white + sun. Same geometry. */
function FooterLogo() {
  return (
    <span className="inline-flex items-center gap-2" dir="ltr">
      <svg viewBox="0 0 32 32" aria-hidden="true" className="size-7 shrink-0 fill-sun">
        <path d="M16 16V4a12 12 0 1 0 12 12Z" />
      </svg>
      <span className="text-wordmark text-white">NOVA</span>
    </span>
  );
}

/** A column opens with a hairline and a small label. */
const columnClass = "border-t border-white/10 pt-4";

export function Footer({ t, locale }: { t: Dictionary; locale: Locale }) {
  const { footer } = t;
  const channels = t.pages.contact.channels;
  const contact = [
    { label: channels.email, value: site.email, href: `mailto:${site.email}` },
    { label: channels.telegram, value: site.telegram.handle, href: site.telegram.href },
    { label: channels.whatsapp, value: site.whatsapp.display, href: site.whatsapp.href },
  ];

  return (
    <footer className="relative z-2">
      {/* The thread ends here: a small square cap where it meets the colour field. */}
      <Container aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 z-10">
        <div className="relative">
          <span className="thread-cap" />
        </div>
      </Container>

      {/* The butter band is a node-editor canvas: the CTA, and under it the whole job in three nodes,
          packets running along the wires. A column on phones, a row from md. */}
      <section className="cta-band relative overflow-hidden">
        <Container className="pt-section pb-20 lg:pb-28">
          <div className="grid-swiss">
            <div className="col-span-full lg:col-span-8">
              <h2 className="font-display text-h2 md:text-title">{footer.ctaTitle}</h2>
              <ButtonLink href={localePath(locale, "/contact")} className="mt-10">
                {footer.ctaButton}
              </ButtonLink>
            </div>
          </div>
          <FlowFragment
            orientation="responsive"
            size="lg"
            running
            className="mt-16 w-full lg:mt-24"
            wireClassName="[--wire-len:3.5rem] md:[--wire-min:4rem]"
            nodes={[
              { icon: ListTodo, label: footer.flow[0] },
              { icon: Bot, label: footer.flow[1] },
              { icon: Check, label: footer.flow[2] },
            ]}
          />
        </Container>
      </section>

      {/* A deep ultramarine field: its own grid (white at 9%) and, on the end side, a slow-turning
          composition of brand shapes at low opacity, half off the canvas. */}
      <section className="footer-field relative isolate overflow-hidden text-white">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 opacity-60">
          <GridLines variant="field" />
        </div>
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -end-36 -top-20 -z-10 size-[22rem] lg:-end-56 lg:-top-40 lg:size-[44rem]"
        >
          <div className="footer-orbit relative size-full">
            <Shape shape="arch" color="ultra" className="absolute start-[16%] top-0 size-[62%] opacity-30" />
            <Shape shape="quarter" color="mint" rotate={90} className="absolute start-0 bottom-0 size-[46%] opacity-10" />
            <Shape shape="circle" color="sun" className="absolute end-[4%] bottom-[10%] size-[30%] opacity-10" />
          </div>
        </div>

        <Container className="pt-10 lg:pt-14">
          <div className="grid-swiss gap-y-8">
            <div className={`col-span-full lg:col-span-4 ${columnClass}`}>
              <Link href={localePath(locale)} aria-label={t.nav.home} className="inline-block rounded-pill">
                <FooterLogo />
              </Link>
              <p className="mt-3 max-w-xs text-body text-white/70">{footer.tagline}</p>
              <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1">
                <LangSwitch
                  locale={locale}
                  label={t.langSwitch.label}
                  ariaLabel={t.langSwitch.aria}
                  className="-ms-3"
                />
                <p className="text-body text-white/70">{footer.rights}</p>
              </div>
            </div>

            <nav
              aria-labelledby="footer-pages"
              className={`col-span-2 md:col-span-2 lg:col-span-2 lg:col-start-6 ${columnClass}`}
            >
              <h2 id="footer-pages" className="label text-white/60">
                {footer.pagesTitle}
              </h2>
              <ul className="mt-3 flex flex-col items-start">
                {navRoutes.map(({ key, path }) => (
                  <li key={key}>
                    <Link href={localePath(locale, path)} className={linkClass}>
                      {t.nav.links[key]}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            <div className={`col-span-2 md:col-span-4 lg:col-span-4 lg:col-start-9 ${columnClass}`}>
              <h2 className="label text-white/60">{footer.contactTitle}</h2>
              <ul className="mt-3 flex flex-col items-start gap-2">
                {contact.map((item) => (
                  <li key={item.label}>
                    <span className="label block text-white/60">{item.label}</span>
                    <a href={item.href} className={linkClass}>
                      <bdi dir="ltr">{item.value}</bdi>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* The signature: "NOVA" as wide as the container (textLength pins the width, so no font
              metrics to keep in sync), cropped to its top half so it bleeds off the bottom. */}
          <div
            aria-hidden="true"
            dir="ltr"
            className="wordmark-frame mt-8 aspect-300/46 overflow-hidden lg:mt-10 lg:aspect-300/34"
          >
            <svg viewBox="0 0 300 65" className="wordmark">
              <text x="0" y="74" textLength="300" lengthAdjust="spacing">
                NOVA
              </text>
            </svg>
          </div>
        </Container>
      </section>
    </footer>
  );
}

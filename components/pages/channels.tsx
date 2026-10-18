import { MessagesSquare } from "lucide-react";
import { IconTile } from "@/components/icon-tile";
import { Shape } from "@/components/shape";
import type { Dictionary } from "@/content/en";
import { site } from "@/lib/site";

type Props = { t: Dictionary["pages"]["contact"]["channels"] };

const LINK =
  "inline-block font-display text-lede font-semibold underline decoration-line decoration-2 underline-offset-4 hover:decoration-ultra focus-visible:decoration-ultra";

/**
 * Direct channels. Handles, addresses and numbers are Latin data: they render LTR even
 * on /fa so "@nova_studio" and "+98 21 ..." never reorder.
 */
export function Channels({ t }: Props) {
  const channels = [
    { label: t.email, text: site.email, href: `mailto:${site.email}` },
    { label: t.telegram, text: site.telegram.handle, href: site.telegram.href },
    { label: t.whatsapp, text: site.whatsapp.display, href: site.whatsapp.href },
    { label: t.phone, text: site.phone.display, href: site.phone.href },
  ];

  return (
    <aside
      aria-labelledby="channels-title"
      className="rounded-card bg-white p-8 lg:sticky lg:top-28 lg:p-10"
    >
      <div className="flex items-start justify-between gap-6">
        <h2 id="channels-title" className="font-display text-h3">
          {t.title}
        </h2>
        <IconTile icon={MessagesSquare} tone="agent" size="md" />
      </div>

      <dl className="mt-8">
        {channels.map(({ label, text, href }) => (
          <div key={label} className="border-t border-line py-5">
            <dt className="label text-ink-soft">{label}</dt>
            <dd className="mt-2">
              <a href={href} dir="ltr" className={LINK}>
                {text}
              </a>
            </dd>
          </div>
        ))}
      </dl>

      <div className="border-t border-line pt-6">
        <p>{t.hours}</p>
        <p className="mt-3 flex items-center gap-3 font-semibold">
          <Shape shape="circle" color="ultra" className="size-2.5" />
          {t.reply}
        </p>
      </div>
    </aside>
  );
}

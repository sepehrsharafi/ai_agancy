"use client";

import { useState, type FormEvent } from "react";
import { Shape } from "@/components/shape";
import type { Dictionary } from "@/content/en";
import type { Locale } from "@/lib/locale";

type Props = {
  t: Dictionary["pages"]["contact"]["form"];
  locale: Locale;
  /** Where the brief goes (lib/site.ts). */
  email: string;
};

const FIELD =
  "mt-3 block w-full border border-line bg-white px-6 text-ink transition-colors duration-300 ease-out placeholder:text-ink-soft hover:border-ink-soft focus:border-ink";

const PILL =
  "group/pill inline-flex min-h-12 max-w-full cursor-pointer items-center gap-3 whitespace-nowrap rounded-pill border border-line bg-white px-5 font-medium transition-colors duration-300 ease-out hover:border-ink has-checked:border-ink has-checked:bg-ink has-checked:text-white has-focus-visible:outline-2 has-focus-visible:outline-offset-3 has-focus-visible:outline-ink";

/**
 * The brief builder. An uncontrolled form: the browser holds every value, FormData reads
 * them once on submit, and the only state is whether to show the "missing" message.
 * Submitting builds a mailto: URL in the visitor's language and navigates to it.
 */
export function BriefBuilder({ t, locale, email }: Props) {
  const [missing, setMissing] = useState(false);

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const text = (key: string) => String(data.get(key) ?? "").trim();
    const name = text("name");
    const contact = text("contact");

    if (!name || !contact) {
      setMissing(true);
      const first = form.elements.namedItem(name ? "contact" : "name");
      if (first instanceof HTMLElement) first.focus();
      return;
    }
    setMissing(false);

    const needs = data.getAll("need").map(String);
    const size = text("size");
    const message = text("message");
    const list = new Intl.ListFormat(locale, { type: "unit", style: "long" });

    const lines = [
      needs.length > 0 && `${t.emailNeeds}: ${list.format(needs)}`,
      size && `${t.emailSize}: ${size}`,
      `${t.emailContact}: ${contact}`,
      message && `\n${message}`,
      `\n${name}`,
    ].filter(Boolean);

    const subject = t.emailSubject.replace("{name}", () => name);
    window.location.href = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(lines.join("\n"))}`;
  }

  return (
    <form noValidate onSubmit={onSubmit} className="flex flex-col gap-12">
      <fieldset>
        <legend className="label text-ink-soft">{t.needsLabel}</legend>
        <div className="mt-4 flex flex-wrap gap-3">
          {t.needs.map((need) => (
            <label key={need} className={PILL}>
              <input type="checkbox" name="need" value={need} className="sr-only" />
              <Shape
                shape="square"
                color="mist"
                className="size-3.5 group-has-checked/pill:shape-circle group-has-checked/pill:shape-ultra"
              />
              {need}
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset>
        <legend className="label text-ink-soft">{t.sizeLabel}</legend>
        <div className="mt-4 flex flex-wrap gap-3">
          {t.sizes.map((size) => (
            <label key={size} className={PILL}>
              <input type="radio" name="size" value={size} className="sr-only" />
              {size}
            </label>
          ))}
        </div>
      </fieldset>

      <div className="grid gap-x-gridgap gap-y-8 md:grid-cols-2">
        <label className="label block text-ink-soft">
          {t.nameLabel}
          <input
            type="text"
            name="name"
            autoComplete="name"
            aria-describedby="brief-status"
            className={`${FIELD} h-14 rounded-pill text-body`}
          />
        </label>
        <label className="label block text-ink-soft">
          {t.contactLabel}
          <input
            type="text"
            name="contact"
            dir="auto"
            autoComplete="email"
            aria-describedby="brief-status"
            className={`${FIELD} h-14 rounded-pill text-body`}
          />
        </label>
      </div>

      <label className="label block text-ink-soft">
        {t.messageLabel}
        <textarea
          name="message"
          rows={5}
          placeholder={t.messagePlaceholder}
          className={`${FIELD} min-h-40 resize-y rounded-card py-4 text-body`}
        />
      </label>

      <div>
        <button
          type="submit"
          className="group/btn relative isolate inline-flex h-14 items-center justify-center gap-2 overflow-hidden rounded-pill bg-ink px-8 font-semibold leading-none whitespace-nowrap text-white"
        >
          {t.submit}
          <Arrow />
          <span
            aria-hidden="true"
            className="wipe absolute inset-0 inline-flex items-center justify-center gap-2 bg-ultra text-white select-none group-hover/btn:wipe-on group-focus-visible/btn:wipe-on"
          >
            {t.submit}
            <Arrow />
          </span>
        </button>
        <p className="mt-4 max-w-md text-ink-soft">{t.submitHint}</p>
        <p
          id="brief-status"
          role="status"
          aria-live="polite"
          className="mt-4 grid font-semibold text-ultra"
        >
          {/* An invisible copy of the message holds its room, so showing it moves nothing. */}
          <span aria-hidden="true" className="invisible col-start-1 row-start-1">
            {t.missing}
          </span>
          <span className="col-start-1 row-start-1">{missing ? t.missing : null}</span>
        </p>
      </div>
    </form>
  );
}

// Same arrow as ButtonLink: slides toward the reading direction, mirrors in RTL.
function Arrow() {
  return (
    <svg
      viewBox="0 0 16 16"
      aria-hidden="true"
      className="size-4 shrink-0 scale-x-(--dir) translate-x-0 fill-none stroke-current stroke-[1.75] transition-[translate] duration-500 ease-out group-hover/btn:translate-x-(--arrow-shift) group-focus-visible/btn:translate-x-(--arrow-shift)"
    >
      <path d="M2.5 8h11M9 3.5 13.5 8 9 12.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

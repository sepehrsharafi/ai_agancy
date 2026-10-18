import { ButtonLink } from "@/components/button-link";
import { PageHeader } from "@/components/page-header";
import { getDictionary, getLocale, localePath } from "@/lib/i18n";

export default async function NotFound() {
  const [locale, t] = await Promise.all([getLocale(), getDictionary()]);

  return (
    <PageHeader title={t.notFound.title} lede={t.notFound.body}>
      <ButtonLink href={localePath(locale)}>{t.notFound.back}</ButtonLink>
    </PageHeader>
  );
}

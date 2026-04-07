import { notFound } from "next/navigation";
import { getRequestConfig } from "next-intl/server";

export const locales = ["zh", "ja", "en"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "zh";
export const localePrefix = "always";

export default getRequestConfig(async ({ locale, requestLocale }) => {
  const resolvedLocale = (locale ?? (await requestLocale) ?? defaultLocale) as Locale;

  if (!locales.includes(resolvedLocale)) {
    notFound();
  }

  return {
    locale: resolvedLocale,
    messages: (await import(`./messages/${resolvedLocale}.json`)).default
  };
});
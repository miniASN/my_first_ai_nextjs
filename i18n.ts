import { notFound } from "next/navigation";
import { getRequestConfig } from "next-intl/server";

export const locales = ["zh", "ja", "en"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "zh";
export const localePrefix = "always";

export default getRequestConfig(async ({ locale }) => {
  if (!locale || !locales.includes(locale as Locale)) {
    notFound();
  }

  return {
    messages: (await import(`./messages/${locale}.json`)).default,
  };
});

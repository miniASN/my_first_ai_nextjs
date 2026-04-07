import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { locales } from "@/i18n";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import "../globals.css";

type Props = {
  params: Promise<{ locale: string }>;
  children: React.ReactNode;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata" });

  return {
    title: t("title"),
    description: t("description"),
  };
}

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({ params, children }: Props) {
  const { locale } = await params;

  if (!locales.includes(locale as (typeof locales)[number])) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <NextIntlClientProvider messages={messages}>
      <div style={{ position: "fixed", top: "16px", right: "16px", zIndex: 1000 }}>
        <LanguageSwitcher />
      </div>
      <main style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 24px" }}>
        {children}
      </main>
    </NextIntlClientProvider>
  );
}

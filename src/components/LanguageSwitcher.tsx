"use client";

import React from "react";
import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "next/navigation";
import { locales, type Locale } from "../../i18n";

const languageLabels: Record<Locale, string> = {
  zh: "中文",
  ja: "日本語",
  en: "English"
};

function getLocalizedPathname(pathname: string, nextLocale: Locale): string {
  const segments = pathname.split("/").filter(Boolean);
  const [, ...rest] = segments;
  const suffix = rest.length > 0 ? `/${rest.join("/")}` : "";
  return `/${nextLocale}${suffix}`;
}

export default function LanguageSwitcher() {
  const t = useTranslations("language");
  const locale = useLocale() as Locale;
  const pathname = usePathname();
  const router = useRouter();

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const nextLocale = event.target.value as Locale;
    const nextPathname = getLocalizedPathname(pathname, nextLocale);
    router.replace(nextPathname);
    router.refresh();
  };

  return (
    <label
      style={{
        display: "flex",
        alignItems: "center",
        gap: "8px",
        background: "rgba(15, 23, 42, 0.72)",
        border: "1px solid var(--border-glass)",
        borderRadius: "999px",
        padding: "8px 12px",
        backdropFilter: "blur(12px)"
      }}
    >
      <span style={{ color: "var(--text-muted)", fontSize: "13px" }}>{t("label")}</span>
      <select
        onChange={handleChange}
        value={locale}
        aria-label={t("label")}
        style={{
          background: "transparent",
          border: "none",
          color: "var(--text-main)",
          fontSize: "14px",
          cursor: "pointer",
          outline: "none"
        }}
      >
        {locales.map((item) => (
          <option key={item} value={item} style={{ color: "black" }}>
            {languageLabels[item]}
          </option>
        ))}
      </select>
    </label>
  );
}
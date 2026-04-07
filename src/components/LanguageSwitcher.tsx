"use client";

import React from "react";
import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/routing";
import { locales } from "@/i18n";

const languageLabels: Record<(typeof locales)[number], string> = {
  zh: "’†•¶",
  ja: "“ú–{Œê",
  en: "English",
};

export default function LanguageSwitcher() {
  const t = useTranslations("language");
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    router.replace(pathname, { locale: event.target.value });
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
        backdropFilter: "blur(12px)",
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
          outline: "none",
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

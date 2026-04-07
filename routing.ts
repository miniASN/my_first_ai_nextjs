import { createNavigation } from "next-intl/navigation";
import { localePrefix, locales } from "./i18n";

export const { Link, redirect, usePathname, useRouter } =
  createNavigation({ locales, localePrefix });
export const locales = ["fa", "ps", "en"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "fa";

export const rtlLocales: Locale[] = ["fa", "ps"];

export function isRtl(locale: string) {
  return rtlLocales.includes(locale as Locale);
}

import fa from "@/messages/fa.json";
import ps from "@/messages/ps.json";
import en from "@/messages/en.json";

const dictionaries = { fa, ps, en };

export function getDictionary(locale: string) {
  return dictionaries[(locale as Locale) in dictionaries ? (locale as Locale) : defaultLocale];
}

export function localizedField<T extends Record<string, any>>(
  obj: T,
  field: string,
  locale: string
): string {
  const suffix = locale === "fa" ? "Fa" : locale === "ps" ? "Ps" : "En";
  return obj[`${field}${suffix}`] ?? obj[`${field}Fa`] ?? "";
}

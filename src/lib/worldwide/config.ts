export const SUPPORTED_LOCALES = [
  "en",
  "es",
  "fr",
  "de",
  "it",
  "nl",
  "pt-BR",
  "pt-PT",
  "pl",
  "sv",
  "tr",
  "ar",
  "he",
  "ru",
  "ja",
  "ko",
  "zh-Hans",
  "zh-Hant",
  "hi",
  "id",
] as const;

export type SupportedLocale = (typeof SUPPORTED_LOCALES)[number];

export const DEFAULT_LOCALE: SupportedLocale = "en";
export const DEFAULT_COUNTRY = "US";
export const DEFAULT_CURRENCY = "USD";
export const BASE_CURRENCY = "USD";
export const WORLDWIDE_CACHE_VERSION = "v1";
export const WORLDWIDE_CACHE_TTL_MS = 1000 * 60 * 60 * 12;

export const ZERO_DECIMAL_CURRENCIES = new Set([
  "BIF",
  "CLP",
  "DJF",
  "GNF",
  "JPY",
  "KMF",
  "KRW",
  "MGA",
  "PYG",
  "RWF",
  "UGX",
  "VND",
  "VUV",
  "XAF",
  "XOF",
  "XPF",
]);

export const RTL_LOCALES = new Set<SupportedLocale>(["ar", "he"]);

export function isSupportedLocale(locale: string): locale is SupportedLocale {
  return SUPPORTED_LOCALES.includes(locale as SupportedLocale);
}

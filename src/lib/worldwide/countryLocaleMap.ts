import { DEFAULT_CURRENCY, DEFAULT_LOCALE, type SupportedLocale } from "./config";

const SPANISH_COUNTRIES = [
  "AR",
  "BO",
  "CL",
  "CO",
  "CR",
  "CU",
  "DO",
  "EC",
  "ES",
  "GT",
  "HN",
  "MX",
  "NI",
  "PA",
  "PE",
  "PR",
  "PY",
  "SV",
  "UY",
  "VE",
];

const PT_PT_COUNTRIES = ["PT", "AO", "MZ", "CV", "GW", "ST", "TL"];

export const COUNTRY_LOCALE_MAP: Record<string, SupportedLocale> = {
  AE: "ar",
  BR: "pt-BR",
  CN: "zh-Hans",
  DE: "de",
  FR: "fr",
  GB: "en",
  HK: "zh-Hant",
  ID: "id",
  IL: "he",
  IN: "hi",
  IT: "it",
  JP: "ja",
  KR: "ko",
  MO: "zh-Hant",
  NL: "nl",
  PL: "pl",
  RU: "ru",
  SE: "sv",
  TR: "tr",
  TW: "zh-Hant",
  US: "en",
  ...Object.fromEntries(SPANISH_COUNTRIES.map((country) => [country, "es"])),
  ...Object.fromEntries(PT_PT_COUNTRIES.map((country) => [country, "pt-PT"])),
};

export const FALLBACK_CURRENCY: Record<string, string> = {
  AE: "AED",
  AR: "ARS",
  AU: "AUD",
  BR: "BRL",
  CA: "CAD",
  CL: "CLP",
  CN: "CNY",
  CO: "COP",
  ES: "EUR",
  GB: "GBP",
  HK: "HKD",
  ID: "IDR",
  IL: "ILS",
  IN: "INR",
  JP: "JPY",
  KR: "KRW",
  KW: "KWD",
  MX: "MXN",
  NZ: "NZD",
  PE: "PEN",
  PL: "PLN",
  PT: "EUR",
  QA: "QAR",
  RU: "RUB",
  SA: "SAR",
  SE: "SEK",
  TR: "TRY",
  TW: "TWD",
  US: "USD",
  ZA: "ZAR",
};

export function localeForCountry(country: string) {
  return COUNTRY_LOCALE_MAP[country.toUpperCase()] ?? DEFAULT_LOCALE;
}

export function fallbackCurrencyForCountry(country: string) {
  return FALLBACK_CURRENCY[country.toUpperCase()] ?? DEFAULT_CURRENCY;
}

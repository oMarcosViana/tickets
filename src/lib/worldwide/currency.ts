import {
  BASE_CURRENCY,
  DEFAULT_COUNTRY,
  DEFAULT_CURRENCY,
  WORLDWIDE_CACHE_TTL_MS,
  WORLDWIDE_CACHE_VERSION,
} from "./config";
import { fallbackCurrencyForCountry } from "./countryLocaleMap";

type CachedValue<T> = {
  expiresAt: number;
  value: T;
};

function cacheKey(key: string) {
  return `site_worldwide_${WORLDWIDE_CACHE_VERSION}_${key}`;
}

function readCache<T>(key: string) {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const raw = window.localStorage.getItem(cacheKey(key));
    if (!raw) {
      return null;
    }

    const cached = JSON.parse(raw) as CachedValue<T>;
    if (cached.expiresAt < Date.now()) {
      window.localStorage.removeItem(cacheKey(key));
      return null;
    }

    return cached.value;
  } catch {
    return null;
  }
}

function writeCache<T>(key: string, value: T) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(
    cacheKey(key),
    JSON.stringify({ expiresAt: Date.now() + WORLDWIDE_CACHE_TTL_MS, value }),
  );
}

async function fetchJson(url: string) {
  const response = await fetch(url, { cache: "no-store" });
  if (!response.ok) {
    throw new Error(`Failed ${url}`);
  }

  return response.json() as Promise<Record<string, unknown>>;
}

export async function fetchCountryByIp() {
  const cached = readCache<string>("country");
  if (cached) {
    return cached;
  }

  const endpoints = [
    "https://ipapi.co/json/",
    "https://ipwho.is/",
    "https://api.country.is/",
  ];

  for (const endpoint of endpoints) {
    try {
      const payload = await fetchJson(endpoint);
      const country =
        payload.country_code ?? payload.country ?? payload.countryCode;

      if (typeof country === "string" && country.length === 2) {
        const value = country.toUpperCase();
        writeCache("country", value);
        return value;
      }
    } catch {
      // Try the next provider.
    }
  }

  return DEFAULT_COUNTRY;
}

export async function fetchCurrencyForCountry(country: string) {
  const normalizedCountry = country.toUpperCase();
  const cached = readCache<string>(`currency_${normalizedCountry}`);
  if (cached) {
    return cached;
  }

  try {
    const payload = await fetchJson(
      `https://restcountries.com/v3.1/alpha/${normalizedCountry}?fields=currencies`,
    );
    const currencies = payload.currencies;

    if (currencies && typeof currencies === "object") {
      const [currency] = Object.keys(currencies);
      if (currency) {
        writeCache(`currency_${normalizedCountry}`, currency);
        return currency;
      }
    }
  } catch {
    // Fallback below.
  }

  const fallback = fallbackCurrencyForCountry(normalizedCountry);
  writeCache(`currency_${normalizedCountry}`, fallback);
  return fallback;
}

export async function fetchExchangeRates() {
  const cached = readCache<Record<string, number>>("rates");
  if (cached) {
    return cached;
  }

  try {
    const payload = await fetchJson(
      `https://open.er-api.com/v6/latest/${BASE_CURRENCY}`,
    );
    const rates = payload.rates;

    if (rates && typeof rates === "object") {
      writeCache("rates", rates as Record<string, number>);
      return rates as Record<string, number>;
    }
  } catch {
    // Fallback below.
  }

  return { [DEFAULT_CURRENCY]: 1 };
}

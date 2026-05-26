"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { GameConfig, SiteConfig } from "@/lib/site-config";
import {
  DEFAULT_COUNTRY,
  DEFAULT_CURRENCY,
  DEFAULT_LOCALE,
  RTL_LOCALES,
  isSupportedLocale,
  type SupportedLocale,
} from "@/lib/worldwide/config";
import { getCopy } from "@/lib/worldwide/copy";
import {
  fetchCountryByIp,
  fetchCurrencyForCountry,
  fetchExchangeRates,
} from "@/lib/worldwide/currency";
import { fallbackCurrencyForCountry, localeForCountry } from "@/lib/worldwide/countryLocaleMap";
import { formatLocalizedPrice } from "@/lib/worldwide/formatPrice";

type WorldwideContextValue = {
  activeCheckoutGroup: null;
  activeCheckoutLink: null;
  checkoutLinks: [];
  copy: ReturnType<typeof getCopy>;
  country: string;
  currency: string;
  formatUsd: (amountUsd: number) => string;
  getCheckoutUrl: (productId?: string, quantity?: number) => string;
  locale: SupportedLocale;
  oldPrice: (amountUsd: number) => string;
  price: (amountUsd: number) => string;
  productOldPrice: (productId: string) => string;
  productPrice: (productId: string) => string;
  products: GameConfig[];
  ready: boolean;
  savings: (priceUsd: number, oldPriceUsd: number) => string;
  t: (key: string, vars?: Record<string, string | number>) => string;
};

const WorldwideContext = createContext<WorldwideContextValue | null>(null);

function getSearchOverride(name: string) {
  if (typeof window === "undefined") {
    return null;
  }

  return new URLSearchParams(window.location.search).get(name);
}

function appendTrackingParams(checkoutUrl: string) {
  if (typeof window === "undefined" || checkoutUrl.startsWith("#")) {
    return checkoutUrl;
  }

  const currentParams = new URLSearchParams(window.location.search);
  const trackingParams = [
    "utm_source",
    "utm_medium",
    "utm_campaign",
    "utm_term",
    "utm_content",
    "fbclid",
    "gclid",
  ];

  try {
    const url = new URL(checkoutUrl, window.location.origin);
    trackingParams.forEach((param) => {
      const value = currentParams.get(param);
      if (value && !url.searchParams.has(param)) {
        url.searchParams.set(param, value);
      }
    });

    return url.toString();
  } catch {
    return checkoutUrl;
  }
}

function applyCheckoutQuantity(checkoutUrl: string, quantity = 1) {
  return checkoutUrl.replace(/:(\d+)(?=([?#].*)?$)/, `:${quantity}`);
}

function getGame(config: SiteConfig | null, productId?: string) {
  if (!config?.games.length) {
    return null;
  }

  return (
    config.games.find((game) => game.id === productId) ?? config.games[0] ?? null
  );
}

export function WorldwideProvider({ children }: { children: ReactNode }) {
  const [country, setCountry] = useState(DEFAULT_COUNTRY);
  const [currency, setCurrency] = useState(DEFAULT_CURRENCY);
  const [locale, setLocale] = useState<SupportedLocale>(DEFAULT_LOCALE);
  const [rates, setRates] = useState<Record<string, number>>({ USD: 1 });
  const [config, setConfig] = useState<SiteConfig | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function loadWorldwide() {
      const countryOverride = getSearchOverride("country")?.toUpperCase();
      const langOverride = getSearchOverride("lang");
      const currencyOverride = getSearchOverride("currency")?.toUpperCase();
      const detectedCountry = countryOverride || (await fetchCountryByIp());
      const detectedLocale =
        langOverride && isSupportedLocale(langOverride)
          ? langOverride
          : localeForCountry(detectedCountry);
      const detectedCurrency =
        currencyOverride ||
        (await fetchCurrencyForCountry(detectedCountry)) ||
        fallbackCurrencyForCountry(detectedCountry);

      const [exchangeRates, configResponse] = await Promise.all([
        fetchExchangeRates(),
        fetch("/api/config", { cache: "no-store" }).then((response) =>
          response.json(),
        ) as Promise<{ config: SiteConfig }>,
      ]);

      if (!isMounted) {
        return;
      }

      setCountry(detectedCountry);
      setCurrency(detectedCurrency);
      setLocale(detectedLocale);
      setRates(exchangeRates);
      setConfig(configResponse.config);
      document.documentElement.lang = detectedLocale;
      document.documentElement.dir = RTL_LOCALES.has(detectedLocale) ? "rtl" : "ltr";
      setReady(true);
    }

    loadWorldwide().catch(() => {
      if (!isMounted) {
        return;
      }

      setCountry(DEFAULT_COUNTRY);
      setCurrency(DEFAULT_CURRENCY);
      setLocale(DEFAULT_LOCALE);
      setReady(true);
    });

    return () => {
      isMounted = false;
    };
  }, []);

  const value = useMemo<WorldwideContextValue>(() => {
    const copy = getCopy(locale);
    const rate = rates[currency] ?? 1;

    const convertUsd = (amountUsd: number) => amountUsd * rate;
    const formatUsd = (amountUsd: number) =>
      formatLocalizedPrice(convertUsd(amountUsd), currency, locale);

    const t = (key: string, vars?: Record<string, string | number>) => {
      const raw = copy[key];
      let text = typeof raw === "string" ? raw : key;

      Object.entries(vars ?? {}).forEach(([name, value]) => {
        text = text.replaceAll(`{${name}}`, String(value));
      });

      return text;
    };

    return {
      activeCheckoutGroup: null,
      activeCheckoutLink: null,
      checkoutLinks: [],
      copy,
      country,
      currency,
      formatUsd,
      getCheckoutUrl: (productId?: string, quantity = 1) => {
        const game = getGame(config, productId);
        const checkoutUrl = game?.checkoutUrl || "#matches";

        return appendTrackingParams(applyCheckoutQuantity(checkoutUrl, quantity));
      },
      locale,
      oldPrice: formatUsd,
      price: formatUsd,
      productOldPrice: (productId: string) => {
        const game = getGame(config, productId);
        return formatUsd(game?.oldPriceUsd ?? 0);
      },
      productPrice: (productId: string) => {
        const game = getGame(config, productId);
        return formatUsd(game?.priceUsd ?? 0);
      },
      products: config?.games ?? [],
      ready,
      savings: (priceUsd: number, oldPriceUsd: number) =>
        formatUsd(Math.max(oldPriceUsd - priceUsd, 0)),
      t,
    };
  }, [config, country, currency, locale, rates, ready]);

  if (!ready) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#030D1F] text-white">
        <div className="font-title text-[42px] uppercase tracking-wide">
          FIFA 26
        </div>
      </div>
    );
  }

  return (
    <WorldwideContext.Provider value={value}>
      {children}
    </WorldwideContext.Provider>
  );
}

export function useWorldwide() {
  const context = useContext(WorldwideContext);

  if (!context) {
    throw new Error("useWorldwide must be used inside WorldwideProvider");
  }

  return context;
}

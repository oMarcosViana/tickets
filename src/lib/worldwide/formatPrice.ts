import { DEFAULT_CURRENCY, DEFAULT_LOCALE, ZERO_DECIMAL_CURRENCIES } from "./config";

export function formatLocalizedPrice(
  amount: number,
  currency = DEFAULT_CURRENCY,
  locale = DEFAULT_LOCALE,
) {
  const zeroDecimal = ZERO_DECIMAL_CURRENCIES.has(currency.toUpperCase());

  return new Intl.NumberFormat(locale, {
    currency,
    maximumFractionDigits: zeroDecimal ? 0 : 2,
    minimumFractionDigits: zeroDecimal ? 0 : 0,
    style: "currency",
  }).format(amount);
}

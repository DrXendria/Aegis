export interface CurrencyOption {
  code: string;
  symbol: string;
  label: string;
}

export const CURRENCIES: CurrencyOption[] = [
  { code: 'USD', symbol: '$', label: 'USD ($)' },
  { code: 'EUR', symbol: '€', label: 'EUR (€)' },
  { code: 'TRY', symbol: '₺', label: 'TRY (₺)' },
  { code: 'GBP', symbol: '£', label: 'GBP (£)' },
  { code: 'RUB', symbol: '₽', label: 'RUB (₽)' },
  { code: 'INR', symbol: '₹', label: 'INR (₹)' },
  { code: 'KRW', symbol: '₩', label: 'KRW (₩)' },
  { code: 'CNY', symbol: '¥', label: 'CNY (¥)' },
  { code: 'JPY', symbol: '¥', label: 'JPY (¥)' },
  { code: 'BRL', symbol: 'R$', label: 'BRL (R$)' },
  { code: 'SAR', symbol: 'ر.س', label: 'SAR (ر.س)' },
  { code: 'AED', symbol: 'د.إ', label: 'AED (د.إ)' },
  { code: 'EGP', symbol: 'E£', label: 'EGP (E£)' },
  { code: 'IRR', symbol: '﷼', label: 'IRR (﷼)' },
  { code: 'ILS', symbol: '₪', label: 'ILS (₪)' },
  { code: 'DKK', symbol: 'kr', label: 'DKK (kr)' },
  { code: 'NOK', symbol: 'kr', label: 'NOK (kr)' },
  { code: 'SEK', symbol: 'kr', label: 'SEK (kr)' },
  { code: 'PLN', symbol: 'zł', label: 'PLN (zł)' },
  { code: 'IDR', symbol: 'Rp', label: 'IDR (Rp)' },
  { code: 'UAH', symbol: '₴', label: 'UAH (₴)' },
  { code: 'PHP', symbol: '₱', label: 'PHP (₱)' },
];

export const LANG_TO_CURRENCY: Record<string, string> = {
  en: 'USD',
  tr: 'TRY',
  de: 'EUR',
  es: 'EUR',
  fr: 'EUR',
  it: 'EUR',
  pt: 'BRL',
  ru: 'RUB',
  zh: 'CNY',
  hi: 'INR',
  ko: 'KRW',
  ja: 'JPY',
  ar: 'SAR',
  fa: 'IRR',
  el: 'EUR',
  he: 'ILS',
  da: 'DKK',
  no: 'NOK',
  sv: 'SEK',
  fi: 'EUR',
  nl: 'EUR',
  pl: 'PLN',
  id: 'IDR',
  uk: 'UAH',
  fil: 'PHP',
};

export function getDefaultCurrencyForLang(lang: string): string {
  const base = (lang || 'en').toLowerCase().split('-')[0];
  return LANG_TO_CURRENCY[base] || 'USD';
}

export function getOrderedCurrencies(lang: string): CurrencyOption[] {
  const primary = getDefaultCurrencyForLang(lang);
  const pinnedCodes = Array.from(new Set([primary, 'USD', 'EUR']));
  const pinned = pinnedCodes
    .map((code) => CURRENCIES.find((c) => c.code === code))
    .filter((c): c is CurrencyOption => Boolean(c));
  const rest = CURRENCIES.filter((c) => !pinnedCodes.includes(c.code));
  return [...pinned, ...rest];
}

export function formatCurrencyAmount(amount: number, code: string): string {
  const meta = CURRENCIES.find((c) => c.code === code);
  const formatted = amount.toLocaleString(undefined, {
    minimumFractionDigits: amount % 1 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  });
  return meta ? `${formatted} ${meta.symbol}` : `${formatted} ${code}`;
}

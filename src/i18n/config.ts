export const locales = ['tr', 'en', 'ar', 'ru'] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = 'tr';

export const rtlLocales: Locale[] = ['ar'];

export function isRtl(locale: Locale): boolean {
  return rtlLocales.includes(locale);
}

export const localeNames: Record<Locale, string> = {
  tr: 'TR',
  en: 'EN',
  ar: 'AR',
  ru: 'RU',
};

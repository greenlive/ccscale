import en from '../messages/en.json';
import zh from '../messages/zh.json';

export type Locale = 'en' | 'zh';
export type Messages = typeof en;

export const locales: Locale[] = ['en', 'zh'];
export const defaultLocale: Locale = 'en';

export const messages: Record<Locale, Messages> = {
  en,
  zh,
};

export function getLocaleName(locale: Locale): string {
  return locale === 'en' ? 'English' : '中文';
}

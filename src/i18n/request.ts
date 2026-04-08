import { getRequestConfig } from 'next-intl/server';
import { routing } from './routing';
import enMessages from './messages/en.json';
import esMessages from './messages/es.json';

const messagesMap: Record<string, any> = {
  en: enMessages,
  es: esMessages,
};

export default getRequestConfig(async ({ requestLocale }) => {
  // Await the requestLocale promise
  const localeFromRequest = await requestLocale;

  // Resolve locale safely
  const resolvedLocale: 'en' | 'es' = 
    localeFromRequest && routing.locales.includes(localeFromRequest as 'en' | 'es')
      ? (localeFromRequest as 'en' | 'es')
      : routing.defaultLocale;

  return {
    locale: resolvedLocale,
    messages: messagesMap[resolvedLocale],
  };
});
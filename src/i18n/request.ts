// src/i18n/request.ts
import { getRequestConfig } from 'next-intl/server';
import { routing } from './routing';
import enMessages from './messages/en.json';
import esMessages from './messages/es.json';

// Map of locales to message objects
const messagesMap: Record<'en' | 'es', any> = {
  en: enMessages,
  es: esMessages,
};

export default getRequestConfig(async ({ requestLocale }) => {
  // Await the requestLocale promise
  const localeFromRequest = await requestLocale;

  // Guarantee a valid locale string
  const resolvedLocale: 'en' | 'es' =
    localeFromRequest && routing.locales.includes(localeFromRequest as 'en' | 'es')
      ? (localeFromRequest as 'en' | 'es')
      : routing.defaultLocale;

  // Fetch messages from the static map
  const messages = messagesMap[resolvedLocale];

  return {
    locale: resolvedLocale,
    messages,
  };
});
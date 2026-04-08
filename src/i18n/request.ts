// src/i18n/request.ts
import { getRequestConfig } from 'next-intl/server';
import { routing } from './routing';

// Static imports of all messages
import enMessages from './messages/en.json';
import esMessages from './messages/es.json';

// Map for static lookup
const messagesMap: Record<'en' | 'es', any> = {
  en: enMessages,
  es: esMessages,
};

export default getRequestConfig(async ({ requestLocale }) => {
  // Await the locale promise
  const localeFromRequest = await requestLocale;

  // Ensure locale is valid and always a string
  const resolvedLocale: 'en' | 'es' =
    localeFromRequest && routing.locales.includes(localeFromRequest as 'en' | 'es')
      ? (localeFromRequest as 'en' | 'es')
      : routing.defaultLocale;

  // Fetch messages from static map
  const messages = messagesMap[resolvedLocale];

  return {
    locale: resolvedLocale, // always a string, satisfies RequestConfig
    messages,
  };
});
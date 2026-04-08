import { getRequestConfig } from 'next-intl/server';
import { routing } from './routing';

export default getRequestConfig(async ({ requestLocale }) => {
  // Await the locale
  let locale = await requestLocale;

  // Ensure locale is valid, fallback to default
  if (!locale || !routing.locales.includes(locale as 'en' | 'es')) {
    locale = routing.defaultLocale;
  }

  // TypeScript sees this as string now
  const resolvedLocale: 'en' | 'es' = locale as 'en' | 'es';

  // Import messages safely
  const messages = (await import(`./messages/${resolvedLocale}.json`)).default;

  return {
    locale: resolvedLocale,
    messages
  };
});
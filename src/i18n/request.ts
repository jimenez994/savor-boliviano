import { getRequestConfig } from 'next-intl/server';
import { routing } from './routing';

export default getRequestConfig(async ({ requestLocale }) => {
  // Await the requested locale
  let locale = await requestLocale;

  // Ensure locale is valid
  if (!locale || !routing.locales.includes(locale as 'en' | 'es')) {
    locale = routing.defaultLocale;
  }

  // TypeScript now knows locale is a string
  const resolvedLocale: 'en' | 'es' = locale as 'en' | 'es';

  const messages = (await import(`./messages/${resolvedLocale}.json`)).default;

  return {
    locale: resolvedLocale,
    messages
  };
});
// hi
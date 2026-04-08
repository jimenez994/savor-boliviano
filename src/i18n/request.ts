import { getRequestConfig } from 'next-intl/server';
import { routing } from './routing';

export default getRequestConfig(async ({ locale }) => {
  // Ensure locale is defined and valid
  let resolvedLocale: 'en' | 'es';

  if (!locale || !routing.locales.includes(locale as 'en' | 'es')) {
    resolvedLocale = routing.defaultLocale;
  } else {
    resolvedLocale = locale as 'en' | 'es';
  }

  // Import messages safely
  const messages = (await import(`./messages/${resolvedLocale}.json`)).default;

  return {
    locale: resolvedLocale,
    messages
  };
});
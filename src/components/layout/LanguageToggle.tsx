'use client';

import { useLocale } from 'next-intl';
import { usePathname, Link } from '@/i18n/routing';
import { motion } from 'framer-motion';

export function LanguageToggle() {
  const locale = useLocale();
  const pathname = usePathname();

  return (
    <Link
      href={pathname}
      locale={locale === 'en' ? 'es' : 'en'}
      className="relative inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/90 backdrop-blur-sm border border-bolivian-red/20 shadow-md hover:shadow-lg transition-all duration-300"
    >
      <motion.span
        className={`font-semibold text-sm transition-opacity duration-300 ${
          locale === 'en' ? 'opacity-100 text-bolivian-red' : 'opacity-50'
        }`}
        whileHover={{ scale: 1.05 }}
      >
        EN
      </motion.span>
      <span className="text-bolivian-red/40">|</span>
      <motion.span
        className={`font-semibold text-sm transition-opacity duration-300 ${
          locale === 'es' ? 'opacity-100 text-bolivian-red' : 'opacity-50'
        }`}
        whileHover={{ scale: 1.05 }}
      >
        ES
      </motion.span>
    </Link>
  );
}

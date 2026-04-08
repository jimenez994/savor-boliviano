'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import {
  Mail,
  Phone,
  MapPin,
  Heart,
} from 'lucide-react';

const socialLinks = [
  { name: 'Instagram', href: '#' },
  { name: 'Facebook', href: '#' },
  { name: 'Twitter', href: '#' },
];

export function Footer() {
  const t = useTranslations();

  return (
    <footer className="bg-charcoal text-white">
      {/* Andean border pattern */}
      <div className="h-2 bg-gradient-to-r from-bolivian-red via-bolivian-yellow to-bolivian-red" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-bolivian-red to-bolivian-yellow flex items-center justify-center">
                <span className="text-white font-bold text-lg">SB</span>
              </div>
              <div>
                <h3 className="font-bold text-lg">Sabor Boliviano</h3>
                <p className="text-white/70 text-sm">Authentic Street Food</p>
              </div>
            </div>
            <p className="text-white/70 text-sm leading-relaxed">
              Bringing the authentic flavors of Cochabamba, Bolivia to your neighborhood.
              Family recipes, traditional techniques, and love in every bite.
            </p>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h4 className="font-semibold text-bolivian-yellow">{t('footer.contact')}</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-white/80">
                <MapPin className="w-5 h-5 text-bolivian-red flex-shrink-0 mt-0.5" />
                <span className="text-sm">{t('footer.address')}</span>
              </li>
              <li className="flex items-center gap-3 text-white/80">
                <Phone className="w-5 h-5 text-bolivian-red flex-shrink-0" />
                <span className="text-sm">{t('footer.phone')}</span>
              </li>
              <li className="flex items-center gap-3 text-white/80">
                <Mail className="w-5 h-5 text-bolivian-red flex-shrink-0" />
                <span className="text-sm">{t('footer.email')}</span>
              </li>
            </ul>
          </div>

          {/* Social */}
          <div className="space-y-4">
            <h4 className="font-semibold text-bolivian-yellow">{t('footer.followUs')}</h4>
            <div className="flex gap-3">
              {socialLinks.map((social) => (
                <motion.a
                  key={social.name}
                  href={social.href}
                  className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-bolivian-red transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  aria-label={social.name}
                >
                  <span className="text-white font-bold text-sm">{social.name[0]}</span>
                </motion.a>
              ))}
            </div>
            <p className="text-white/70 text-sm">
              Follow us for daily locations, specials, and behind-the-scenes content!
            </p>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-white/60 text-sm">
            {t('footer.copyright')}
          </p>
          <p className="text-white/60 text-sm flex items-center gap-1">
            {t('footer.madeWith')} <Heart className="w-4 h-4 text-bolivian-red fill-bolivian-red" /> in Bolivia
          </p>
        </div>
      </div>
    </footer>
  );
}

'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, UtensilsCrossed } from 'lucide-react';
import { LanguageToggle } from './LanguageToggle';
import { Button } from '@/components/ui/Button';

const navItems = [
  { href: '#home', key: 'nav.home' },
  { href: '#menu', key: 'nav.menu' },
  { href: '#location', key: 'nav.location' },
  { href: '#catering', key: 'nav.catering' },
  { href: '#about', key: 'nav.about' },
  { href: '#gallery', key: 'nav.gallery' },
];

export function Header() {
  const t = useTranslations();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsMobileMenuOpen(false);
    }
  };

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? 'bg-white/95 backdrop-blur-md shadow-lg py-2'
            : 'bg-transparent py-4'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <motion.a
              href="#home"
              className="flex items-center gap-3"
              whileHover={{ scale: 1.02 }}
              onClick={(e) => {
                e.preventDefault();
                scrollToSection('#home');
              }}
            >
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-bolivian-red to-bolivian-yellow flex items-center justify-center shadow-lg">
                <UtensilsCrossed className="w-6 h-6 text-white" />
              </div>
              <div className="hidden sm:block">
                <span
                  className={`block font-bold text-lg ${
                    isScrolled ? 'text-charcoal' : 'text-white drop-shadow-lg'
                  }`}
                >
                  Sabor Boliviano
                </span>
                <span
                  className={`block text-xs ${
                    isScrolled ? 'text-earth-brown' : 'text-white/90 drop-shadow'
                  }`}
                >
                  Authentic Street Food
                </span>
              </div>
            </motion.a>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-1">
              {navItems.map((item) => (
                <motion.button
                  key={item.href}
                  onClick={() => scrollToSection(item.href)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    isScrolled
                      ? 'text-charcoal hover:bg-bolivian-red/10 hover:text-bolivian-red'
                      : 'text-white hover:bg-white/20 hover:text-bolivian-yellow'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {t(item.key)}
                </motion.button>
              ))}
            </nav>

            {/* Right side */}
            <div className="flex items-center gap-3">
              <div className="hidden sm:block">
                <LanguageToggle />
              </div>
              <Button
                variant={isScrolled ? 'primary' : 'white'}
                size="sm"
                className="hidden sm:inline-flex"
              >
                {t('nav.orderNow')}
              </Button>

              {/* Mobile menu button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className={`lg:hidden p-2 rounded-lg ${
                  isScrolled ? 'text-charcoal' : 'text-white'
                }`}
                aria-label="Toggle menu"
              >
                {isMobileMenuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="fixed top-0 left-0 right-0 z-40 lg:hidden"
          >
            <div className="bg-white shadow-xl pt-20 pb-6 px-4">
              <nav className="flex flex-col gap-2">
                {navItems.map((item, index) => (
                  <motion.button
                    key={item.href}
                    onClick={() => scrollToSection(item.href)}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="w-full text-left px-4 py-3 rounded-lg text-charcoal font-medium hover:bg-bolivian-red/10 hover:text-bolivian-red transition-colors"
                  >
                    {t(item.key)}
                  </motion.button>
                ))}
                <div className="pt-4 border-t border-gray-200 flex flex-col gap-3">
                  <div className="flex justify-center">
                    <LanguageToggle />
                  </div>
                  <Button variant="primary" className="w-full">
                    {t('nav.orderNow')}
                  </Button>
                </div>
              </nav>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

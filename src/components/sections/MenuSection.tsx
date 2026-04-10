'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { Utensils } from 'lucide-react';

interface MenuItem {
  key: string;
  name: string;
  description: string;
  price: string;
  image: string;
  category: 'mains' | 'snacks' | 'sides';
}

export function MenuSection() {
  const t = useTranslations();
  const [activeCategory, setActiveCategory] = useState<'all' | 'mains' | 'snacks' | 'sides'>('all');

  const menuItems: MenuItem[] = [
    {
      key: 'saltenas',
      name: t('menu.items.saltenas.name'),
      description: t('menu.items.saltenas.description'),
      price: t('menu.items.saltenas.price'),
      image: 'https://images.unsplash.com/photo-1626074353765-517a681e40be?w=800&q=80',
      category: 'snacks',
    },
    {
      key: 'piqueMacho',
      name: t('menu.items.piqueMacho.name'),
      description: t('menu.items.piqueMacho.description'),
      price: t('menu.items.piqueMacho.price'),
      image: 'https://images.unsplash.com/photo-1544025162-d76690b67f61?w=800&q=80',
      category: 'mains',
    },
    {
      key: 'anticuchos',
      name: t('menu.items.anticuchos.name'),
      description: t('menu.items.anticuchos.description'),
      price: t('menu.items.anticuchos.price'),
      image: 'https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?w=800&q=80',
      category: 'mains',
    },
    {
      key: 'silpancho',
      name: t('menu.items.silpancho.name'),
      description: t('menu.items.silpancho.description'),
      price: t('menu.items.silpancho.price'),
      image: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=800&q=80',
      category: 'mains',
    },
    {
      key: 'tucumanas',
      name: t('menu.items.tucumanas.name'),
      description: t('menu.items.tucumanas.description'),
      price: t('menu.items.tucumanas.price'),
      image: 'https://images.unsplash.com/photo-1626074353765-517a681e40be?w=800&q=80',
      category: 'snacks',
    },
    {
      key: 'yucaFrita',
      name: t('menu.items.yucaFrita.name'),
      description: t('menu.items.yucaFrita.description'),
      price: t('menu.items.yucaFrita.price'),
      image: 'https://images.unsplash.com/photo-1623341214825-9f4f964368dc?w=800&q=80',
      category: 'sides',
    },
    {
      key: 'platanosFritos',
      name: t('menu.items.platanosFritos.name'),
      description: t('menu.items.platanosFritos.description'),
      price: t('menu.items.platanosFritos.price'),
      image: 'https://images.unsplash.com/photo-1605333556896-7e358709c059?w=800&q=80',
      category: 'sides',
    },
    {
      key: 'choripan',
      name: t('menu.items.choripan.name'),
      description: t('menu.items.choripan.description'),
      price: t('menu.items.choripan.price'),
      image: 'https://images.unsplash.com/photo-1594007654729-407eed60bead?w=800&q=80',
      category: 'snacks',
    },
  ];

  const categories = [
    { key: 'all', label: t('menu.categories.all') },
    { key: 'mains', label: t('menu.categories.mains') },
    { key: 'snacks', label: t('menu.categories.snacks') },
    { key: 'sides', label: t('menu.categories.sides') },
  ] as const;

  const filteredItems =
    activeCategory === 'all'
      ? menuItems
      : menuItems.filter((item) => item.category === activeCategory);

  return (
    <section id="menu" className="py-20 bg-off-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="flex justify-center mb-4">
            <div className="h-1 w-24 bg-gradient-to-r from-bolivian-red via-bolivian-yellow to-bolivian-red rounded-full" />
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-charcoal mb-4">
            {t('menu.title')}
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {t('menu.subtitle')}
          </p>
        </motion.div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map((category) => (
            <motion.button
              key={category.key}
              onClick={() => setActiveCategory(category.key)}
              className={`px-6 py-2.5 rounded-full font-medium transition-all ${
                activeCategory === category.key
                  ? 'bg-bolivian-red text-white shadow-lg'
                  : 'bg-white text-charcoal hover:bg-bolivian-red/10'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {category.label}
            </motion.button>
          ))}
        </div>

        {/* Menu Grid */}
        <motion.div
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {filteredItems.map((item, index) => (
            <motion.div
              key={item.key}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow"
            >
              {/* Image */}
              <div className="relative h-48 overflow-hidden">
                <div
                  className="absolute inset-0 bg-cover bg-center"
                  style={{ backgroundImage: `url('${item.image}')` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-3 left-3 right-3">
                  <span className="text-white font-bold text-lg">{item.price}</span>
                </div>
              </div>

              {/* Content */}
              <div className="p-5">
                <h3 className="font-bold text-lg text-charcoal mb-2">
                  {item.name}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {item.description}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>

      </div>
    </section>
  );
}

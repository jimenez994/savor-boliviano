'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { Heart, Sprout, Users } from 'lucide-react';

const values = [
  {
    icon: Heart,
    key: 'about.values.tradition',
    descKey: 'about.values.traditionDesc',
    color: 'from-bolivian-red to-red-400',
  },
  {
    icon: Sprout,
    key: 'about.values.authentic',
    descKey: 'about.values.authenticDesc',
    color: 'from-mountain-green to-green-400',
  },
  {
    icon: Users,
    key: 'about.values.community',
    descKey: 'about.values.communityDesc',
    color: 'from-bolivian-yellow to-yellow-400',
  },
];

type ContentMap = Record<string, string>;

export function AboutSection({ content }: { content?: ContentMap | null }) {
  const t = useTranslations();
  const title = content?.about_title?.trim() || t('about.title');
  const subtitle = content?.about_subtitle?.trim() || t('about.subtitle');

  return (
    <section id="about" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Image Grid */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="image-zoom-container rounded-2xl overflow-hidden shadow-xl h-64">
                  <div
                    className="w-full h-full bg-cover bg-center"
                    style={{
                      backgroundImage: `url('https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&q=80')`,
                    }}
                  />
                </div>
                <div className="image-zoom-container rounded-2xl overflow-hidden shadow-xl h-48">
                  <div
                    className="w-full h-full bg-cover bg-center"
                    style={{
                      backgroundImage: `url('https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600&q=80')`,
                    }}
                  />
                </div>
              </div>
              <div className="space-y-4 pt-8">
                <div className="image-zoom-container rounded-2xl overflow-hidden shadow-xl h-48">
                  <div
                    className="w-full h-full bg-cover bg-center"
                    style={{
                      backgroundImage: `url('https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?w=600&q=80')`,
                    }}
                  />
                </div>
                <div className="image-zoom-container rounded-2xl overflow-hidden shadow-xl h-64">
                  <div
                    className="w-full h-full bg-cover bg-center"
                    style={{
                      backgroundImage: `url('https://images.unsplash.com/photo-1544025162-d76690b67f61?w=600&q=80')`,
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Decorative element */}
            <div className="absolute -z-10 -bottom-4 -right-4 w-32 h-32 bg-bolivian-yellow/30 rounded-full blur-2xl" />
            <div className="absolute -z-10 -top-4 -left-4 w-32 h-32 bg-bolivian-red/20 rounded-full blur-2xl" />
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex justify-center lg:justify-start mb-4">
              <div className="h-1 w-24 bg-gradient-to-r from-bolivian-red via-bolivian-yellow to-bolivian-red rounded-full" />
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-charcoal mb-6">
              {title}
            </h2>
            <p className="text-lg text-gray-600 mb-4">
              {subtitle}
            </p>

            <div className="space-y-4 text-gray-600 leading-relaxed">
              <p>{t('about.story1')}</p>
              <p>{t('about.story2')}</p>
              <p>{t('about.story3')}</p>
            </div>

            {/* Values */}
            <div className="grid grid-cols-3 gap-4 mt-8">
              {values.map((value, index) => (
                <motion.div
                  key={value.key}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 0.2 + index * 0.1 }}
                  className="text-center"
                >
                  <div
                    className={`w-14 h-14 mx-auto rounded-full bg-gradient-to-br ${value.color} flex items-center justify-center shadow-lg mb-3`}
                  >
                    <value.icon className="w-7 h-7 text-white" />
                  </div>
                  <h4 className="font-semibold text-charcoal text-sm">
                    {t(value.key)}
                  </h4>
                  <p className="text-xs text-gray-500 mt-1">{t(value.descKey)}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

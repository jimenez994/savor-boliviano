'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { X } from 'lucide-react';

const galleryImages = [
  {
    src: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&q=80',
    alt: 'Bolivian salteñas',
    span: 'col-span-2 row-span-2',
  },
  {
    src: 'https://images.unsplash.com/photo-1544025162-d76690b67f61?w=800&q=80',
    alt: 'Pique Macho dish',
    span: 'col-span-1 row-span-1',
  },
  {
    src: 'https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?w=800&q=80',
    alt: 'Anticuchos skewers',
    span: 'col-span-1 row-span-1',
  },
  {
    src: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&q=80',
    alt: 'Food truck exterior',
    span: 'col-span-1 row-span-1',
  },
  {
    src: 'https://images.unsplash.com/photo-1626074353765-517a681e40be?w=800&q=80',
    alt: 'Traditional empanadas',
    span: 'col-span-1 row-span-1',
  },
  {
    src: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=800&q=80',
    alt: 'Silpancho plate',
    span: 'col-span-2 row-span-1',
  },
  {
    src: 'https://images.unsplash.com/photo-1594007654729-407eed60bead?w=800&q=80',
    alt: 'Choripan sandwich',
    span: 'col-span-1 row-span-1',
  },
  {
    src: 'https://images.unsplash.com/photo-1605333556896-7e358709c059?w=800&q=80',
    alt: 'Fried plantains',
    span: 'col-span-1 row-span-1',
  },
];

export function GallerySection() {
  const t = useTranslations();
  const [selectedImage, setSelectedImage] = useState<number | null>(null);

  return (
    <section id="gallery" className="py-20 bg-off-white">
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
            {t('gallery.title')}
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {t('gallery.subtitle')}
          </p>
        </motion.div>

        {/* Gallery Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          {galleryImages.map((image, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              className={`${image.span} relative cursor-pointer overflow-hidden rounded-xl shadow-lg`}
              onClick={() => setSelectedImage(index)}
            >
              <div
                className="w-full h-full bg-cover bg-center min-h-[200px]"
                style={{ backgroundImage: `url('${image.src}')` }}
              />
              <div className="absolute inset-0 bg-black/0 hover:bg-black/30 transition-colors duration-300" />
              <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300">
                <span className="text-white font-medium bg-black/50 px-4 py-2 rounded-full">
                  View
                </span>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Lightbox Modal */}
      {selectedImage !== null && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <button
            onClick={() => setSelectedImage(null)}
            className="absolute top-4 right-4 text-white/70 hover:text-white"
            aria-label="Close modal"
          >
            <X className="w-8 h-8" />
          </button>
          <div
            className="max-w-4xl max-h-[80vh] bg-cover bg-center rounded-lg"
            style={{
              backgroundImage: `url('${galleryImages[selectedImage].src}')`,
            }}
            onClick={(e) => e.stopPropagation()}
          />
        </motion.div>
      )}
    </section>
  );
}

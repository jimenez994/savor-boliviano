'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { PartyPopper, Briefcase, Calendar, Heart, Utensils } from 'lucide-react';
import { Button } from '@/components/ui/Button';

const services = [
  { icon: PartyPopper, key: 'catering.services.privateParties' },
  { icon: Briefcase, key: 'catering.services.corporate' },
  { icon: Calendar, key: 'catering.services.festivals' },
  { icon: Heart, key: 'catering.services.weddings' },
];

export function CateringSection() {
  const t = useTranslations();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    date: '',
    guests: '',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission (integrate with backend later)
    console.log('Form submitted:', formData);
    alert('Thank you for your inquiry! We will contact you soon.');
  };

  return (
    <section id="catering" className="py-20 bg-gradient-to-b from-off-white to-cream">
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
            {t('catering.title')}
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {t('catering.subtitle')}
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Services & Description */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
              <div className="flex items-center gap-3 mb-6">
                <Utensils className="w-8 h-8 text-bolivian-red" />
                <h3 className="text-xl font-bold text-charcoal">
                  {t('catering.description')}
                </h3>
              </div>
              <p className="text-gray-600 leading-relaxed mb-6">
                {t('catering.description')}
              </p>

              {/* Service Cards */}
              <div className="grid grid-cols-2 gap-4">
                {services.map((service, index) => (
                  <motion.div
                    key={service.key}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    className="bg-gradient-to-br from-bolivian-red/5 to-bolivian-yellow/5 rounded-xl p-4 flex items-center gap-3"
                  >
                    <div className="w-10 h-10 rounded-full bg-bolivian-red/10 flex items-center justify-center">
                      <service.icon className="w-5 h-5 text-bolivian-red" />
                    </div>
                    <span className="font-medium text-charcoal text-sm">
                      {t(service.key)}
                    </span>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Features */}
            <div className="grid grid-cols-3 gap-4">
              {[
                { number: '20+', label: 'Min Guests' },
                { number: '500+', label: 'Max Guests' },
                { number: '100%', label: 'Authentic' },
              ].map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
                  className="bg-white rounded-xl shadow-lg p-4 text-center"
                >
                  <div className="text-2xl font-bold text-bolivian-red">{stat.number}</div>
                  <div className="text-xs text-gray-500 mt-1">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h3 className="text-2xl font-bold text-charcoal mb-2">
                {t('catering.contactTitle')}
              </h3>
              <p className="text-gray-600 mb-6">
                Fill out the form below and we'll get back to you within 24 hours.
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-charcoal mb-1">
                      {t('catering.form.name')}
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-bolivian-red focus:ring-2 focus:ring-bolivian-red/20 outline-none transition-all"
                      placeholder="John Doe"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-charcoal mb-1">
                      {t('catering.form.email')}
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-bolivian-red focus:ring-2 focus:ring-bolivian-red/20 outline-none transition-all"
                      placeholder="john@example.com"
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-charcoal mb-1">
                      {t('catering.form.phone')}
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                      className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-bolivian-red focus:ring-2 focus:ring-bolivian-red/20 outline-none transition-all"
                      placeholder="(555) 123-4567"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-charcoal mb-1">
                      {t('catering.form.date')}
                    </label>
                    <input
                      type="date"
                      required
                      value={formData.date}
                      onChange={(e) =>
                        setFormData({ ...formData, date: e.target.value })
                      }
                      className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-bolivian-red focus:ring-2 focus:ring-bolivian-red/20 outline-none transition-all"
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-charcoal mb-1">
                      {t('catering.form.guests')}
                    </label>
                    <input
                      type="number"
                      min="20"
                      value={formData.guests}
                      onChange={(e) =>
                        setFormData({ ...formData, guests: e.target.value })
                      }
                      className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-bolivian-red focus:ring-2 focus:ring-bolivian-red/20 outline-none transition-all"
                      placeholder="50"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-charcoal mb-1">
                    {t('catering.form.message')}
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={formData.message}
                    onChange={(e) =>
                      setFormData({ ...formData, message: e.target.value })
                    }
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-bolivian-red focus:ring-2 focus:ring-bolivian-red/20 outline-none transition-all resize-none"
                    placeholder="Tell us about your event, any special requests, dietary restrictions, etc."
                  />
                </div>

                <Button type="submit" variant="primary" size="lg" className="w-full">
                  {t('catering.form.submit')}
                </Button>
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { MapPin, Clock, Navigation } from 'lucide-react';

interface ScheduleDay {
  day: string;
  location: string;
  hours: string;
  isToday?: boolean;
}

export function LocationSection() {
  const t = useTranslations();

  const schedule: ScheduleDay[] = [
    {
      day: t('location.days.monday'),
      location: t('location.locations.downtown'),
      hours: t('location.hours.lunch'),
    },
    {
      day: t('location.days.tuesday'),
      location: t('location.locations.university'),
      hours: t('location.hours.lunch'),
    },
    {
      day: t('location.days.wednesday'),
      location: t('location.locations.downtown'),
      hours: t('location.hours.lunch'),
    },
    {
      day: t('location.days.thursday'),
      location: t('location.locations.university'),
      hours: t('location.hours.dinner'),
    },
    {
      day: t('location.days.friday'),
      location: t('location.locations.festival'),
      hours: t('location.hours.allDay'),
    },
    {
      day: t('location.days.saturday'),
      location: t('location.locations.market'),
      hours: t('location.hours.allDay'),
    },
    {
      day: t('location.days.sunday'),
      location: t('location.hours.closed'),
      hours: '',
    },
  ];

  return (
    <section id="location" className="py-20 bg-cream">
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
            {t('location.title')}
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {t('location.subtitle')}
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Schedule Card */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-white rounded-2xl shadow-xl overflow-hidden"
          >
            <div className="bg-gradient-to-r from-bolivian-red to-terracotta p-6">
              <div className="flex items-center gap-3 text-white">
                <Clock className="w-6 h-6" />
                <h3 className="text-xl font-bold">{t('location.weeklySchedule')}</h3>
              </div>
            </div>
            <div className="divide-y divide-gray-100">
              {schedule.map((day, index) => (
                <motion.div
                  key={day.day}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  className={`p-4 flex items-center gap-4 ${
                    index === 4 ? 'bg-bolivian-yellow/20' : ''
                  }`}
                >
                  <div className="w-24 flex-shrink-0">
                    <span className="font-semibold text-charcoal">{day.day}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 text-gray-600">
                      <MapPin className="w-4 h-4 text-bolivian-red flex-shrink-0" />
                      <span className="text-sm truncate">{day.location}</span>
                    </div>
                    {day.hours && (
                      <div className="flex items-center gap-2 mt-1">
                        <Clock className="w-3 h-3 text-gray-400 flex-shrink-0" />
                        <span className="text-xs text-gray-500">{day.hours}</span>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Map Placeholder */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden h-full min-h-[500px]">
              {/* Map placeholder - replace with actual Google Maps embed */}
              <div className="absolute inset-0 bg-gradient-to-br from-earth-brown/10 to-bolivian-yellow/10">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center p-8">
                    <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-bolivian-red/10 flex items-center justify-center">
                      <Navigation className="w-10 h-10 text-bolivian-red" />
                    </div>
                    <h4 className="font-semibold text-charcoal mb-2">
                      {t('location.currentLocation')}
                    </h4>
                    <p className="text-gray-600 text-sm mb-4">
                      {t('location.locations.downtown')}
                    </p>
                    <a
                      href="https://maps.google.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-bolivian-red font-medium hover:underline"
                    >
                      <MapPin className="w-4 h-4" />
                      {t('location.viewMap')}
                    </a>
                  </div>
                </div>
              </div>
              {/* Decorative map pattern */}
              <div className="absolute inset-0 opacity-20">
                <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                  <pattern
                    id="grid"
                    width="40"
                    height="40"
                    patternUnits="userSpaceOnUse"
                  >
                    <path
                      d="M 40 0 L 0 0 0 40"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="0.5"
                      className="text-gray-400"
                    />
                  </pattern>
                  <rect width="100%" height="100%" fill="url(#grid)" />
                </svg>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

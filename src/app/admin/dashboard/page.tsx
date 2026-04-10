'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Type,
  UtensilsCrossed,
  Image,
  Calendar,
  Link as LinkIcon,
  ArrowUpRight,
  Phone,
} from 'lucide-react';
import { adminEyebrow, adminPageDesc, adminPageTitle, adminShell } from '@/lib/adminStyles';

const sections = [
  {
    title: 'Text Content',
    description: 'Hero, about, and headline copy',
    icon: Type,
    href: '/admin/content',
    accent: 'from-terracotta to-bolivian-red',
    iconBg: 'bg-terracotta/15 text-terracotta',
  },
  {
    title: 'Menu Items',
    description: 'Dishes, prices, and photos',
    icon: UtensilsCrossed,
    href: '/admin/menu',
    accent: 'from-bolivian-red to-red-800',
    iconBg: 'bg-bolivian-red/15 text-bolivian-red',
  },
  {
    title: 'Gallery',
    description: 'Food truck & event photos',
    icon: Image,
    href: '/admin/gallery',
    accent: 'from-deep-purple to-mountain-green',
    iconBg: 'bg-deep-purple/15 text-deep-purple',
  },
  {
    title: 'Schedule',
    description: 'Weekly locations & hours',
    icon: Calendar,
    href: '/admin/schedule',
    accent: 'from-mountain-green to-emerald-800',
    iconBg: 'bg-mountain-green/15 text-mountain-green',
  },
  {
    title: 'Social Links',
    description: 'Instagram, Facebook, and more',
    icon: LinkIcon,
    href: '/admin/social',
    accent: 'from-bolivian-yellow to-sun-orange',
    iconBg: 'bg-bolivian-yellow/25 text-earth-brown',
  },
  {
    title: 'Contact',
    description: 'Footer address, phone, and email',
    icon: Phone,
    href: '/admin/contact',
    accent: 'from-terracotta to-earth-brown',
    iconBg: 'bg-terracotta/20 text-terracotta',
  },
];

const statMeta = [
  { key: 'menuItems' as const, label: 'Menu items' },
  { key: 'galleryImages' as const, label: 'Gallery' },
  { key: 'socialLinks' as const, label: 'Social links' },
  { key: 'scheduleDays' as const, label: 'Schedule rows' },
];

const statAccents = [
  'from-bolivian-red to-terracotta',
  'from-deep-purple to-bolivian-red',
  'from-mountain-green to-bolivian-red',
  'from-bolivian-yellow to-terracotta',
];

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    menuItems: 0,
    galleryImages: 0,
    socialLinks: 0,
    scheduleDays: 0,
  });

  useEffect(() => {
    fetch('/api/content')
      .then((res) => res.json())
      .then((data) => {
        setStats({
          menuItems: data.menu?.length || 0,
          galleryImages: data.gallery?.length || 0,
          socialLinks: data.social?.length || 0,
          scheduleDays: data.schedule?.length || 0,
        });
      })
      .catch(console.error);
  }, []);

  return (
    <div className={adminShell}>
      <header>
        <p className={adminEyebrow}>Overview</p>
        <h1 className={adminPageTitle}>Dashboard</h1>
        <p className={adminPageDesc}>Manage what visitors see on your food truck site.</p>
      </header>

      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        {statMeta.map((s, i) => (
          <motion.div
            key={s.key}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="relative overflow-hidden rounded-2xl border border-earth-brown/10 bg-white p-5 shadow-sm ring-1 ring-black/[0.03] sm:p-6"
          >
            <div
              className={`absolute left-0 right-0 top-0 h-1 bg-gradient-to-r ${statAccents[i]}`}
              aria-hidden
            />
            <p className="text-3xl font-bold tabular-nums text-charcoal sm:text-4xl">
              {stats[s.key]}
            </p>
            <p className="mt-1 text-xs font-medium uppercase tracking-wide text-earth-brown sm:text-sm">
              {s.label}
            </p>
          </motion.div>
        ))}
      </div>

      <section>
        <h2 className="mb-4 text-lg font-semibold text-charcoal">Quick actions</h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {sections.map((section, index) => {
            const Icon = section.icon;
            return (
              <motion.a
                key={section.href}
                href={section.href}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.08 + index * 0.04 }}
                className="group relative overflow-hidden rounded-2xl border border-earth-brown/10 bg-white p-6 shadow-sm ring-1 ring-black/[0.03] transition hover:-translate-y-0.5 hover:border-bolivian-red/25 hover:shadow-lg hover:shadow-bolivian-red/10"
              >
                <div
                  className={`pointer-events-none absolute -right-8 -top-8 h-28 w-28 rounded-full bg-gradient-to-br opacity-[0.12] ${section.accent}`}
                  aria-hidden
                />
                <div className="relative flex items-start justify-between gap-4">
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-xl ${section.iconBg}`}
                  >
                    <Icon className="h-6 w-6" aria-hidden />
                  </div>
                  <span className="rounded-full border border-charcoal/10 bg-off-white/80 p-2 text-charcoal/40 transition group-hover:border-bolivian-red/20 group-hover:text-bolivian-red">
                    <ArrowUpRight className="h-4 w-4" aria-hidden />
                  </span>
                </div>
                <h3 className="relative mt-5 font-semibold text-charcoal">{section.title}</h3>
                <p className="relative mt-1 text-sm text-earth-brown">{section.description}</p>
              </motion.a>
            );
          })}
        </div>
      </section>
    </div>
  );
}

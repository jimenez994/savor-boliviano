'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Save, Clock, MapPin, CalendarDays } from 'lucide-react';
import {
  adminCard,
  adminInputSm,
  adminLoadingBox,
  adminPageDesc,
  adminPageTitle,
  adminPrimaryBtn,
  adminShell,
  adminSpinner,
  adminSuccessBtn,
} from '@/lib/adminStyles';

interface ScheduleItem {
  id?: number;
  day: string;
  location: string;
  hours: string;
}

export default function AdminSchedulePage() {
  const [schedule, setSchedule] = useState<ScheduleItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [saveError, setSaveError] = useState('');

  useEffect(() => {
    fetch('/api/schedule')
      .then((res) => res.json())
      .then((data) => {
        setSchedule(data);
        setLoading(false);
      })
      .catch(console.error);
  }, []);

  const handleChange = (index: number, field: keyof ScheduleItem, value: string) => {
    setSchedule((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [field]: value } : item))
    );
    setSaved(false);
    setSaveError('');
  };

  const handleSave = async () => {
    setSaving(true);
    setSaveError('');
    try {
      const res = await fetch('/api/schedule', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          schedule: schedule.map((item, index) => ({
            ...item,
            display_order: index,
          })),
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setSaveError(typeof data.error === 'string' ? data.error : 'Save failed');
        return;
      }
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (error) {
      console.error('Save failed:', error);
      setSaveError('Save failed');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className={adminShell}>
        <div className={adminLoadingBox}>
          <div className={adminSpinner} />
          <p className="mt-4 text-sm font-medium text-earth-brown">Loading schedule…</p>
        </div>
      </div>
    );
  }

  return (
    <div className={adminShell}>
      <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-earth-brown/15 bg-white px-3 py-1 text-xs font-semibold text-earth-brown shadow-sm">
            <CalendarDays className="h-3.5 w-3.5 text-bolivian-red" aria-hidden />
            Locations
          </div>
          <h1 className={adminPageTitle}>Weekly schedule</h1>
          <p className={adminPageDesc}>
            One week (Monday–Sunday): set location and hours for each day. The live site highlights
            today&apos;s row automatically.
          </p>
        </div>
        <div className="flex flex-col items-end gap-2">
          {saveError ? (
            <p className="max-w-md text-right text-sm font-medium text-red-600" role="alert">
              {saveError}
            </p>
          ) : null}
          <motion.button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className={saved ? adminSuccessBtn : adminPrimaryBtn}
            whileTap={{ scale: 0.98 }}
          >
            <Save className="h-5 w-5 shrink-0" aria-hidden />
            {saving ? 'Saving…' : saved ? 'Saved' : 'Save changes'}
          </motion.button>
        </div>
      </div>

      <div className={`${adminCard} overflow-hidden`}>
        <div className="border-b border-earth-brown/10 bg-gradient-to-r from-bolivian-red/90 to-terracotta/90 px-6 py-4">
          <h2 className="flex items-center gap-2 text-sm font-semibold text-white">
            <Clock className="h-4 w-4 opacity-90" aria-hidden />
            One week at a glance
          </h2>
          <p className="mt-0.5 text-xs text-white/80">
            Seven rows — Mon through Sun. Day names should match the site language (English or
            Spanish) for the &quot;Today&quot; highlight.
          </p>
        </div>
        <div className="divide-y divide-earth-brown/10">
          {schedule.map((item, index) => (
            <motion.div
              key={item.id || index}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.04 }}
              className="p-4 transition-colors hover:bg-off-white/50 sm:p-6"
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
                <div className="sm:w-36 sm:shrink-0">
                  <span className="text-sm font-bold text-charcoal">{item.day}</span>
                </div>
                <div className="grid flex-1 gap-4 sm:grid-cols-[1fr_auto]">
                  <div>
                    <div className="mb-1.5 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-earth-brown">
                      <MapPin className="h-3.5 w-3.5 text-bolivian-red" aria-hidden />
                      Location
                    </div>
                    <input
                      type="text"
                      value={item.location}
                      onChange={(e) => handleChange(index, 'location', e.target.value)}
                      className={adminInputSm}
                    />
                  </div>
                  <div className="sm:w-52">
                    <div className="mb-1.5 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-earth-brown">
                      <Clock className="h-3.5 w-3.5 text-terracotta" aria-hidden />
                      Hours
                    </div>
                    <input
                      type="text"
                      value={item.hours}
                      onChange={(e) => handleChange(index, 'hours', e.target.value)}
                      placeholder="e.g. 11:00 AM – 3:00 PM"
                      className={adminInputSm}
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

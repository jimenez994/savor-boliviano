'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Save, Type } from 'lucide-react';
import {
  adminCard,
  adminCardPadding,
  adminInput,
  adminLabel,
  adminLoadingBox,
  adminPageDesc,
  adminPageTitle,
  adminPrimaryBtn,
  adminShell,
  adminSpinner,
  adminSuccessBtn,
} from '@/lib/adminStyles';

const contentFields = [
  { key: 'hero_tagline', label: 'Hero Tagline', type: 'text' as const },
  { key: 'hero_description', label: 'Hero Description', type: 'textarea' as const },
  { key: 'about_title', label: 'About Title', type: 'text' as const },
  { key: 'about_subtitle', label: 'About Subtitle', type: 'text' as const },
];

export default function AdminContentPage() {
  const [content, setContent] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch('/api/content')
      .then((res) => res.json())
      .then((data) => {
        setContent(data.content || {});
        setLoading(false);
      })
      .catch(console.error);
  }, []);

  const handleChange = (key: string, value: string) => {
    setContent((prev) => ({ ...prev, [key]: value }));
    setSaved(false);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await Promise.all(
        contentFields.map((field) =>
          fetch('/api/content', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ key: field.key, value: content[field.key] || '' }),
          })
        )
      );
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (error) {
      console.error('Save failed:', error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className={adminShell}>
        <div className={adminLoadingBox}>
          <div className={adminSpinner} />
          <p className="mt-4 text-sm font-medium text-earth-brown">Loading copy…</p>
        </div>
      </div>
    );
  }

  return (
    <div className={adminShell}>
      <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-earth-brown/15 bg-white px-3 py-1 text-xs font-semibold text-earth-brown shadow-sm">
            <Type className="h-3.5 w-3.5 text-bolivian-red" aria-hidden />
            Public text
          </div>
          <h1 className={adminPageTitle}>Text content</h1>
          <p className={adminPageDesc}>Hero and about sections shown on the homepage.</p>
        </div>
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

      <div className={`${adminCard} ${adminCardPadding} space-y-8`}>
        {contentFields.map((field) => (
          <div key={field.key}>
            <label className={adminLabel} htmlFor={field.key}>
              {field.label}
            </label>
            {field.type === 'textarea' ? (
              <textarea
                id={field.key}
                value={content[field.key] || ''}
                onChange={(e) => handleChange(field.key, e.target.value)}
                rows={4}
                className={`${adminInput} resize-none`}
              />
            ) : (
              <input
                id={field.key}
                type="text"
                value={content[field.key] || ''}
                onChange={(e) => handleChange(field.key, e.target.value)}
                className={adminInput}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

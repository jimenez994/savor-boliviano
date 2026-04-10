'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Save, Phone } from 'lucide-react';
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

const contactFields = [
  { key: 'footer_address', label: 'Address', type: 'textarea' as const, hint: 'Shown next to the map pin in the footer.' },
  { key: 'footer_phone', label: 'Phone', type: 'text' as const, hint: 'Include country code if needed.' },
  { key: 'footer_email', label: 'Email', type: 'email' as const, hint: 'Public contact email.' },
];

export default function AdminContactPage() {
  const [content, setContent] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [saveError, setSaveError] = useState('');

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
    setSaveError('');
  };

  const handleSave = async () => {
    setSaving(true);
    setSaveError('');
    try {
      const results = await Promise.all(
        contactFields.map((field) =>
          fetch('/api/content', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ key: field.key, value: content[field.key] || '' }),
          })
        )
      );
      const failed = results.find((r) => !r.ok);
      if (failed) {
        const data = await failed.json().catch(() => ({}));
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
          <p className="mt-4 text-sm font-medium text-earth-brown">Loading contact…</p>
        </div>
      </div>
    );
  }

  return (
    <div className={adminShell}>
      <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-earth-brown/15 bg-white px-3 py-1 text-xs font-semibold text-earth-brown shadow-sm">
            <Phone className="h-3.5 w-3.5 text-bolivian-red" aria-hidden />
            Footer
          </div>
          <h1 className={adminPageTitle}>Contact</h1>
          <p className={adminPageDesc}>
            Address, phone, and email in the site footer. Leave a field empty to use the default
            translation for that language.
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

      <div className={`${adminCard} ${adminCardPadding} space-y-8`}>
        {contactFields.map((field) => (
          <div key={field.key}>
            <label className={adminLabel} htmlFor={field.key}>
              {field.label}
            </label>
            {field.type === 'textarea' ? (
              <textarea
                id={field.key}
                value={content[field.key] || ''}
                onChange={(e) => handleChange(field.key, e.target.value)}
                rows={3}
                className={`${adminInput} resize-none`}
              />
            ) : (
              <input
                id={field.key}
                type={field.type}
                value={content[field.key] || ''}
                onChange={(e) => handleChange(field.key, e.target.value)}
                className={adminInput}
              />
            )}
            <p className="mt-1.5 text-xs text-earth-brown">{field.hint}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

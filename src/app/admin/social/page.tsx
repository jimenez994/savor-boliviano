'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Save, Link2, Trash2 } from 'lucide-react';
import {
  adminCard,
  adminCardPadding,
  adminInput,
  adminInputSm,
  adminLoadingBox,
  adminPageDesc,
  adminPageTitle,
  adminPrimaryBtn,
  adminShell,
  adminSpinner,
  adminSuccessBtn,
} from '@/lib/adminStyles';

interface SocialLink {
  id?: number;
  platform: string;
  url: string;
}

export default function AdminSocialPage() {
  const [links, setLinks] = useState<SocialLink[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [newPlatform, setNewPlatform] = useState('');
  const [newUrl, setNewUrl] = useState('');

  useEffect(() => {
    fetch('/api/social')
      .then((res) => res.json())
      .then((data) => {
        setLinks(data);
        setLoading(false);
      })
      .catch(console.error);
  }, []);

  const handleChange = (index: number, field: keyof SocialLink, value: string) => {
    setLinks((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [field]: value } : item))
    );
    setSaved(false);
    setSaveError('');
  };

  const handleAdd = () => {
    if (!newPlatform || !newUrl) return;
    const key = newPlatform.trim().toLowerCase();
    if (links.some((l) => l.platform.trim().toLowerCase() === key)) {
      setSaveError('That platform is already in the list.');
      return;
    }
    setSaveError('');
    setLinks([...links, { platform: newPlatform.trim(), url: newUrl.trim() }]);
    setNewPlatform('');
    setNewUrl('');
    setSaved(false);
  };

  const handleDelete = (index: number) => {
    setLinks(links.filter((_, i) => i !== index));
    setSaved(false);
    setSaveError('');
  };

  const handleSave = async () => {
    setSaving(true);
    setSaveError('');
    try {
      const res = await fetch('/api/social', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          links: links.map((link, index) => ({
            ...link,
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
          <p className="mt-4 text-sm font-medium text-earth-brown">Loading links…</p>
        </div>
      </div>
    );
  }

  return (
    <div className={adminShell}>
      <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-earth-brown/15 bg-white px-3 py-1 text-xs font-semibold text-earth-brown shadow-sm">
            <Link2 className="h-3.5 w-3.5 text-bolivian-red" aria-hidden />
            Footer &amp; social
          </div>
          <h1 className={adminPageTitle}>Social links</h1>
          <p className={adminPageDesc}>
            One entry per platform (e.g. one Instagram). Duplicates are removed automatically on the
            server.
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
        <div className="divide-y divide-earth-brown/10">
          {links.map((link, index) => (
            <motion.div
              key={link.id || index}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.04 }}
              className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:gap-4 sm:p-5"
            >
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-bolivian-yellow/20 text-earth-brown">
                <Link2 className="h-5 w-5" aria-hidden />
              </div>
              <div className="flex min-w-0 flex-1 flex-col gap-3 sm:flex-row sm:gap-4">
                <input
                  type="text"
                  value={link.platform}
                  onChange={(e) => handleChange(index, 'platform', e.target.value)}
                  className={`${adminInputSm} sm:w-40 sm:shrink-0`}
                  placeholder="Platform"
                />
                <input
                  type="url"
                  value={link.url}
                  onChange={(e) => handleChange(index, 'url', e.target.value)}
                  className={`${adminInputSm} min-w-0 flex-1`}
                  placeholder="https://…"
                />
              </div>
              <button
                type="button"
                onClick={() => handleDelete(index)}
                className="flex shrink-0 items-center justify-center gap-2 self-start rounded-xl border border-red-200 bg-red-50/90 px-3 py-2.5 text-sm font-medium text-red-700 transition hover:bg-red-100 sm:self-center"
              >
                <Trash2 className="h-4 w-4" aria-hidden />
                <span className="sm:sr-only">Remove</span>
              </button>
            </motion.div>
          ))}
        </div>
      </div>

      <div className={`${adminCard} ${adminCardPadding}`}>
        <h2 className="mb-4 text-base font-semibold text-charcoal">Add a link</h2>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
          <div className="flex-1 sm:max-w-[12rem]">
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-earth-brown">
              Platform
            </label>
            <input
              type="text"
              value={newPlatform}
              onChange={(e) => setNewPlatform(e.target.value)}
              placeholder="TikTok, YouTube…"
              className={adminInput}
            />
          </div>
          <div className="min-w-0 flex-[2]">
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-earth-brown">
              URL
            </label>
            <input
              type="url"
              value={newUrl}
              onChange={(e) => setNewUrl(e.target.value)}
              placeholder="https://…"
              className={adminInput}
            />
          </div>
          <button
            type="button"
            onClick={handleAdd}
            disabled={!newPlatform || !newUrl}
            className={`${adminPrimaryBtn} w-full shrink-0 sm:w-auto`}
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
}

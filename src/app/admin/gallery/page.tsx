'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Trash2, Upload, ImageIcon, Link2 } from 'lucide-react';
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
} from '@/lib/adminStyles';

interface GalleryImage {
  id?: number;
  image_url: string;
  alt: string;
}

export default function AdminGalleryPage() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [altText, setAltText] = useState('');
  const [galleryUrl, setGalleryUrl] = useState('');
  const [urlError, setUrlError] = useState('');
  const [addingUrl, setAddingUrl] = useState(false);

  useEffect(() => {
    loadImages();
  }, []);

  const loadImages = () => {
    fetch('/api/gallery')
      .then((res) => res.json())
      .then((data) => {
        setImages(data);
        setLoading(false);
      })
      .catch(console.error);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (res.ok) {
        await fetch('/api/gallery', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ image_url: data.url, alt: altText }),
        });
        setAltText('');
        loadImages();
      }
    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      setUploading(false);
    }
  };

  const handleAddFromUrl = async () => {
    const raw = galleryUrl.trim();
    setUrlError('');
    if (!raw) {
      setUrlError('Enter an image URL.');
      return;
    }
    if (!/^https?:\/\//i.test(raw)) {
      setUrlError('URL must start with http:// or https://');
      return;
    }
    setAddingUrl(true);
    try {
      const res = await fetch('/api/gallery', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image_url: raw, alt: altText }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setUrlError(typeof data.error === 'string' ? data.error : 'Could not add image');
        return;
      }
      setGalleryUrl('');
      setAltText('');
      loadImages();
    } catch {
      setUrlError('Request failed');
    } finally {
      setAddingUrl(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Remove this image from the gallery?')) return;
    await fetch(`/api/gallery?id=${id}`, { method: 'DELETE' });
    loadImages();
  };

  if (loading) {
    return (
      <div className={adminShell}>
        <div className={adminLoadingBox}>
          <div className={adminSpinner} />
          <p className="mt-4 text-sm font-medium text-earth-brown">Loading gallery…</p>
        </div>
      </div>
    );
  }

  return (
    <div className={adminShell}>
      <div>
        <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-earth-brown/15 bg-white px-3 py-1 text-xs font-semibold text-earth-brown shadow-sm">
          <ImageIcon className="h-3.5 w-3.5 text-bolivian-red" aria-hidden />
          Media
        </div>
        <h1 className={adminPageTitle}>Gallery</h1>
        <p className={adminPageDesc}>
          Upload files (Cloudinary when configured) or paste a direct <strong>https</strong> image URL.
          Optional alt text applies to both.
        </p>
      </div>

      <div className={`${adminCard} ${adminCardPadding}`}>
        <h2 className="mb-4 text-base font-semibold text-charcoal">Upload a file</h2>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
          <label className="flex min-h-[9rem] flex-1 cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-earth-brown/25 bg-off-white/40 px-4 py-8 transition hover:border-bolivian-red/50 hover:bg-off-white/80">
            <Upload className="mb-2 h-9 w-9 text-earth-brown/50" aria-hidden />
            <span className="text-center text-sm font-medium text-charcoal">
              {uploading ? 'Uploading…' : 'Drop or click to choose'}
            </span>
            <span className="mt-1 text-center text-xs text-earth-brown">JPG, PNG, WebP</span>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
              disabled={uploading}
            />
          </label>
          <div className="w-full sm:w-64">
            <label className={adminLabel} htmlFor="gallery-alt">
              Description (optional)
            </label>
            <input
              id="gallery-alt"
              type="text"
              value={altText}
              onChange={(e) => setAltText(e.target.value)}
              placeholder="Short caption"
              className={adminInput}
            />
          </div>
        </div>
      </div>

      <div className={`${adminCard} ${adminCardPadding}`}>
        <h2 className="mb-1 flex items-center gap-2 text-base font-semibold text-charcoal">
          <Link2 className="h-4 w-4 text-bolivian-red" aria-hidden />
          Or use an image URL
        </h2>
        <p className="mb-4 text-sm text-earth-brown">
          Paste a direct link to a .jpg, .png, .webp, or other image hosted online (
          <code className="rounded bg-off-white px-1 text-xs">http://</code> or{' '}
          <code className="rounded bg-off-white px-1 text-xs">https://</code>).
        </p>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
          <div className="min-w-0 flex-1">
            <label className={adminLabel} htmlFor="gallery-image-url">
              Image URL
            </label>
            <input
              id="gallery-image-url"
              type="url"
              value={galleryUrl}
              onChange={(e) => {
                setGalleryUrl(e.target.value);
                setUrlError('');
              }}
              placeholder="https://images.example.com/photo.jpg"
              className={adminInput}
              autoComplete="off"
            />
          </div>
          <button
            type="button"
            onClick={handleAddFromUrl}
            disabled={addingUrl || !galleryUrl.trim()}
            className={`${adminPrimaryBtn} w-full shrink-0 sm:w-auto`}
          >
            {addingUrl ? 'Adding…' : 'Add from URL'}
          </button>
        </div>
        {urlError ? (
          <p className="mt-2 text-sm font-medium text-red-600" role="alert">
            {urlError}
          </p>
        ) : null}
      </div>

      <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
        {images.map((image) => (
          <motion.div
            key={image.id}
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`${adminCard} group relative overflow-hidden`}
          >
            <div
              className="aspect-square bg-cover bg-center"
              style={{ backgroundImage: `url('${image.image_url}')` }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-charcoal/80 via-charcoal/20 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
            <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity group-hover:opacity-100">
              <button
                type="button"
                onClick={() => handleDelete(image.id!)}
                className="flex h-12 w-12 items-center justify-center rounded-full bg-red-600 text-white shadow-lg transition hover:bg-red-700"
                aria-label="Delete image"
              >
                <Trash2 className="h-5 w-5" />
              </button>
            </div>
            {image.alt ? (
              <div className="pointer-events-none absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/85 to-transparent p-3 pt-8">
                <p className="truncate text-xs text-white/95">{image.alt}</p>
              </div>
            ) : null}
          </motion.div>
        ))}
      </div>

      {images.length === 0 ? (
        <div
          className={`${adminCard} flex flex-col items-center justify-center py-16 text-center ${adminCardPadding}`}
        >
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-bolivian-red/10">
            <Upload className="h-8 w-8 text-bolivian-red/70" aria-hidden />
          </div>
          <p className="max-w-sm text-sm font-medium text-charcoal">No photos yet</p>
          <p className="mt-1 max-w-sm text-sm text-earth-brown">
            Upload a file or add an image URL above. Photos appear on the public site automatically.
          </p>
        </div>
      ) : null}
    </div>
  );
}

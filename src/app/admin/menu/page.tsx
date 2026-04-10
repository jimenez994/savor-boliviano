'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit, Trash2, X, Upload, UtensilsCrossed, Link2 } from 'lucide-react';
import {
  adminCard,
  adminInput,
  adminLabel,
  adminLoadingBox,
  adminModalOverlay,
  adminModalPanel,
  adminPageDesc,
  adminPageTitle,
  adminPrimaryBtn,
  adminSecondaryBtn,
  adminShell,
  adminSpinner,
} from '@/lib/adminStyles';

interface MenuItem {
  id?: number;
  name: string;
  description: string;
  price: string;
  image_url: string;
  category: 'mains' | 'snacks' | 'sides';
}

export default function AdminMenuPage() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [formData, setFormData] = useState<MenuItem>({
    name: '',
    description: '',
    price: '',
    image_url: '',
    category: 'mains',
  });
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    loadMenuItems();
  }, []);

  const loadMenuItems = () => {
    fetch('/api/menu')
      .then((res) => res.json())
      .then((data) => {
        setMenuItems(data);
        setLoading(false);
      })
      .catch(console.error);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const fd = new FormData();
    fd.append('file', file);

    try {
      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: fd,
      });
      const data = await res.json();
      if (res.ok) {
        setFormData((prev) => ({ ...prev, image_url: data.url }));
      }
    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const method = editingItem ? 'PUT' : 'POST';
    const body = editingItem
      ? JSON.stringify({ id: editingItem.id, ...formData })
      : JSON.stringify(formData);

    await fetch('/api/menu', {
      method,
      headers: { 'Content-Type': 'application/json' },
      body,
    });

    setShowForm(false);
    setEditingItem(null);
    setFormData({ name: '', description: '', price: '', image_url: '', category: 'mains' });
    loadMenuItems();
  };

  const handleEdit = (item: MenuItem) => {
    setEditingItem(item);
    setFormData(item);
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this menu item?')) return;
    await fetch(`/api/menu?id=${id}`, { method: 'DELETE' });
    loadMenuItems();
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingItem(null);
    setFormData({ name: '', description: '', price: '', image_url: '', category: 'mains' });
  };

  if (loading) {
    return (
      <div className={adminShell}>
        <div className={adminLoadingBox}>
          <div className={adminSpinner} />
          <p className="mt-4 text-sm font-medium text-earth-brown">Loading menu…</p>
        </div>
      </div>
    );
  }

  return (
    <div className={adminShell}>
      <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-earth-brown/15 bg-white px-3 py-1 text-xs font-semibold text-earth-brown shadow-sm">
            <UtensilsCrossed className="h-3.5 w-3.5 text-bolivian-red" aria-hidden />
            Menu board
          </div>
          <h1 className={adminPageTitle}>Menu items</h1>
          <p className={adminPageDesc}>
            Each item needs an image: upload (Cloudinary when configured) or paste a direct image URL.
          </p>
        </div>
        <motion.button
          type="button"
          onClick={() => setShowForm(true)}
          className={adminPrimaryBtn}
          whileTap={{ scale: 0.98 }}
        >
          <Plus className="h-5 w-5 shrink-0" aria-hidden />
          Add item
        </motion.button>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {menuItems.map((item) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className={`${adminCard} overflow-hidden transition hover:shadow-md`}
          >
            <div
              className="h-44 bg-cover bg-center"
              style={{ backgroundImage: `url('${item.image_url}')` }}
            />
            <div className="border-t border-earth-brown/10 p-5">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <h3 className="truncate font-semibold text-charcoal">{item.name}</h3>
                  <p className="mt-1 text-sm font-bold text-bolivian-red">{item.price}</p>
                </div>
                <span className="shrink-0 rounded-full bg-bolivian-red/10 px-2.5 py-0.5 text-xs font-semibold capitalize text-bolivian-red">
                  {item.category}
                </span>
              </div>
              <p className="mt-2 line-clamp-2 text-sm text-earth-brown">{item.description}</p>
              <div className="mt-4 flex gap-2">
                <button
                  type="button"
                  onClick={() => handleEdit(item)}
                  className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-sky-200 bg-sky-50/90 py-2.5 text-sm font-medium text-sky-800 transition hover:bg-sky-100"
                >
                  <Edit className="h-4 w-4" aria-hidden />
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(item.id!)}
                  className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-red-200 bg-red-50/90 py-2.5 text-sm font-medium text-red-700 transition hover:bg-red-100"
                >
                  <Trash2 className="h-4 w-4" aria-hidden />
                  Delete
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {menuItems.length === 0 ? (
        <div className={`${adminCard} flex flex-col items-center justify-center px-6 py-16 text-center`}>
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-terracotta/15">
            <UtensilsCrossed className="h-8 w-8 text-terracotta" aria-hidden />
          </div>
          <p className="text-sm font-semibold text-charcoal">Your menu is empty</p>
          <p className="mt-1 max-w-md text-sm text-earth-brown">
            Add dishes with photos so the homepage menu section can show them.
          </p>
          <button type="button" onClick={() => setShowForm(true)} className={`${adminPrimaryBtn} mt-6`}>
            <Plus className="h-5 w-5" aria-hidden />
            First item
          </button>
        </div>
      ) : null}

      <AnimatePresence>
        {showForm ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={adminModalOverlay}
            onClick={closeForm}
          >
            <motion.div
              initial={{ scale: 0.96, y: 16 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.96, y: 16 }}
              transition={{ type: 'spring', damping: 26, stiffness: 320 }}
              className={adminModalPanel}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-start justify-between gap-4 border-b border-earth-brown/10 bg-off-white/50 px-6 py-5">
                <div>
                  <h2 className="text-lg font-bold text-charcoal">
                    {editingItem ? 'Edit item' : 'New menu item'}
                  </h2>
                  <p className="mt-0.5 text-xs text-earth-brown">Required fields marked by validation.</p>
                </div>
                <button
                  type="button"
                  onClick={closeForm}
                  className="rounded-xl p-2 text-earth-brown transition hover:bg-white hover:text-charcoal"
                  aria-label="Close"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4 p-6">
                <div>
                  <label className={adminLabel} htmlFor="menu-name">
                    Name
                  </label>
                  <input
                    id="menu-name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className={adminInput}
                  />
                </div>

                <div>
                  <label className={adminLabel} htmlFor="menu-desc">
                    Description
                  </label>
                  <textarea
                    id="menu-desc"
                    required
                    rows={3}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className={`${adminInput} resize-none`}
                  />
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className={adminLabel} htmlFor="menu-price">
                      Price
                    </label>
                    <input
                      id="menu-price"
                      type="text"
                      required
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      placeholder="$10"
                      className={adminInput}
                    />
                  </div>
                  <div>
                    <label className={adminLabel} htmlFor="menu-cat">
                      Category
                    </label>
                    <select
                      id="menu-cat"
                      value={formData.category}
                      onChange={(e) =>
                        setFormData({ ...formData, category: e.target.value as MenuItem['category'] })
                      }
                      className={adminInput}
                    >
                      <option value="mains">Main dishes</option>
                      <option value="snacks">Snacks</option>
                      <option value="sides">Sides</option>
                    </select>
                  </div>
                </div>

                <div>
                  <span className={adminLabel}>Image</span>
                  <div className="mb-3 flex items-start gap-2 rounded-xl border border-earth-brown/15 bg-off-white/40 px-3 py-2">
                    <Link2 className="mt-2 h-4 w-4 shrink-0 text-bolivian-red" aria-hidden />
                    <div className="min-w-0 flex-1">
                      <label className="mb-1 block text-xs font-medium text-earth-brown" htmlFor="menu-image-url">
                        Image URL (optional if you upload)
                      </label>
                      <input
                        id="menu-image-url"
                        type="url"
                        value={formData.image_url}
                        onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                        placeholder="https://…"
                        className={`${adminInput} border-0 bg-transparent px-0 py-1 shadow-none focus:ring-0`}
                      />
                    </div>
                  </div>
                  {formData.image_url ? (
                    <div className="relative overflow-hidden rounded-xl border border-earth-brown/15">
                      <img
                        src={formData.image_url}
                        alt=""
                        className="h-36 w-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, image_url: '' })}
                        className="absolute right-2 top-2 rounded-full bg-charcoal/85 p-1.5 text-white transition hover:bg-charcoal"
                        aria-label="Remove image"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ) : (
                    <label className="flex min-h-[8rem] cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-earth-brown/25 bg-off-white/50 px-4 py-6 transition hover:border-bolivian-red/40">
                      <Upload className="mb-2 h-8 w-8 text-earth-brown/45" aria-hidden />
                      <span className="text-sm font-medium text-charcoal">
                        {uploading ? 'Uploading…' : 'Upload image'}
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                        disabled={uploading}
                      />
                    </label>
                  )}
                </div>

                <div className="flex flex-col-reverse gap-3 border-t border-earth-brown/10 pt-5 sm:flex-row sm:justify-end">
                  <button type="button" onClick={closeForm} className={`${adminSecondaryBtn} w-full sm:w-auto`}>
                    Cancel
                  </button>
                  <button type="submit" className={`${adminPrimaryBtn} w-full sm:w-auto`}>
                    {editingItem ? 'Save changes' : 'Add item'}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

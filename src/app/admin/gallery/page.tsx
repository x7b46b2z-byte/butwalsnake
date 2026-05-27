'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, Plus, Loader2, X, Image as ImageIcon } from 'lucide-react';

interface GalleryItem {
  id: string;
  imageUrl: string;
  caption: string;
  category: string;
  location: string;
  createdAt: string;
}

const CATEGORIES = ['RESCUE', 'RELEASE', 'AWARENESS', 'SCHOOL'];

export default function AdminGalleryPage() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [adding, setAdding] = useState(false);
  const [addError, setAddError] = useState('');

  const [form, setForm] = useState({ imageUrl: '', caption: '', category: 'RESCUE', location: '' });

  const fetchGallery = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/gallery');
      const data = await res.json();
      if (data.success) setItems(data.data);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchGallery(); }, [fetchGallery]);

  const handleAdd = async () => {
    setAddError('');
    if (!form.imageUrl || !form.caption) { setAddError('Image URL and Caption are required.'); return; }
    setAdding(true);
    try {
      const res = await fetch('/api/gallery', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.success) {
        setForm({ imageUrl: '', caption: '', category: 'RESCUE', location: '' });
        setShowAdd(false);
        fetchGallery();
      } else setAddError(data.error || res.statusText || 'Failed to add image.');
    } finally { setAdding(false); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this image?')) return;
    try {
      await fetch(`/api/gallery/${id}`, { method: 'DELETE' });
      fetchGallery();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-white">Gallery Management</h1>
          <p className="text-gray-400 text-sm mt-1">{items.length} images uploaded</p>
        </div>
        <button onClick={() => setShowAdd(true)} className="flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-black font-bold px-4 py-2.5 rounded-xl text-sm transition-colors">
          <Plus className="w-4 h-4" /> Add Image
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-emerald-400" /></div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          <AnimatePresence>
            {items.map((item, i) => (
              <motion.div key={item.id} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.05 }} className="glass-card rounded-2xl overflow-hidden border border-white/10 group relative">
                <div className="h-48 bg-cover bg-center" style={{ backgroundImage: `url(${item.imageUrl})` }}>
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button onClick={() => handleDelete(item.id)} className="bg-red-500 hover:bg-red-600 text-white p-3 rounded-full shadow-lg transform hover:scale-110 transition-all"><Trash2 className="w-5 h-5" /></button>
                  </div>
                </div>
                <div className="p-4">
                  <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-1 rounded-md mb-2 inline-block">{item.category}</span>
                  <p className="text-white text-sm font-medium line-clamp-2">{item.caption}</p>
                  {item.location && <p className="text-gray-500 text-xs mt-1">📍 {item.location}</p>}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {items.length === 0 && !loading && (
        <div className="text-center py-20 glass-card rounded-3xl border border-white/10">
          <ImageIcon className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-white mb-2">No images yet</h3>
          <p className="text-gray-400">Upload your first rescue photo to the gallery.</p>
        </div>
      )}

      <AnimatePresence>
        {showAdd && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={e => e.target === e.currentTarget && setShowAdd(false)}>
            <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9 }} className="bg-[#0f1a1c] border border-white/10 rounded-3xl max-w-md w-full">
              <div className="flex items-center justify-between p-6 border-b border-white/5">
                <h3 className="text-white font-bold text-lg">Add to Gallery</h3>
                <button onClick={() => setShowAdd(false)} className="text-gray-500 hover:text-white"><X className="w-5 h-5" /></button>
              </div>
              <div className="p-6 space-y-4">
                <div><label className="text-xs text-gray-500 mb-1.5 block font-medium">Image URL *</label><input value={form.imageUrl} onChange={e => setForm(p => ({ ...p, imageUrl: e.target.value }))} placeholder="https://..." className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-emerald-500" /></div>
                <div><label className="text-xs text-gray-500 mb-1.5 block font-medium">Caption *</label><input value={form.caption} onChange={e => setForm(p => ({ ...p, caption: e.target.value }))} placeholder="Rescuing a python..." className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-emerald-500" /></div>
                <div><label className="text-xs text-gray-500 mb-1.5 block font-medium">Category</label>
                  <select value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value }))} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-emerald-500 appearance-none">
                    {CATEGORIES.map(c => <option key={c} value={c} className="bg-[#0f1a1c]">{c}</option>)}
                  </select>
                </div>
                <div><label className="text-xs text-gray-500 mb-1.5 block font-medium">Location (Optional)</label><input value={form.location} onChange={e => setForm(p => ({ ...p, location: e.target.value }))} placeholder="Butwal, Ward 12" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-emerald-500" /></div>

                {addError && <p className="text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-2">{addError}</p>}
                
                {form.imageUrl && <div className="h-32 rounded-xl bg-cover bg-center border border-white/10" style={{ backgroundImage: `url(${form.imageUrl})` }} />}

                <button onClick={handleAdd} disabled={adding} className="w-full bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-black font-bold py-3.5 rounded-xl flex items-center justify-center gap-2">
                  {adding ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Upload Image'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

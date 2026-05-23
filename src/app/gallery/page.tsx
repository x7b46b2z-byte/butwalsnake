'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Image as ImageIcon, MapPin, Loader2 } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import FloatingWidgets from '@/components/FloatingWidgets';

interface GalleryItem {
  id: string;
  imageUrl: string;
  caption: string;
  category: string;
  location: string;
}

const CATEGORIES = ['ALL', 'RESCUE', 'RELEASE', 'AWARENESS', 'SCHOOL'];

export default function GalleryPage() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [filtered, setFiltered] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL');
  const [selectedImage, setSelectedImage] = useState<GalleryItem | null>(null);

  useEffect(() => {
    fetch('/api/gallery')
      .then(r => r.json())
      .then(data => {
        if (data.success) {
          setItems(data.data);
          setFiltered(data.data);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (filter === 'ALL') setFiltered(items);
    else setFiltered(items.filter(item => item.category === filter));
  }, [filter, items]);

  return (
    <div className="min-h-screen bg-[#0f1a1c]">
      <Navbar />
      <div className="py-20 px-4 text-center border-b border-white/5 bg-gradient-to-b from-emerald-900/15 to-transparent">
        <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
          <div className="inline-flex items-center gap-2 bg-emerald-500/20 border border-emerald-500/40 rounded-full px-4 py-1.5 mb-4">
            <ImageIcon className="w-4 h-4 text-emerald-400" />
            <span className="text-emerald-400 text-sm font-semibold">RESCUE DIARIES</span>
          </div>
          <h1 className="text-5xl font-bold text-white mb-4">Photo Gallery</h1>
          <p className="text-gray-400 max-w-xl mx-auto">Glimpses from our field operations, safe snake releases, and community awareness programs in Rupandehi.</p>
        </motion.div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {CATEGORIES.map(c => (
            <button
              key={c}
              onClick={() => setFilter(c)}
              className={`px-5 py-2.5 rounded-full text-sm font-semibold border transition-all ${
                filter === c
                  ? 'bg-emerald-500 border-emerald-500 text-black'
                  : 'bg-white/5 border-white/10 text-gray-400 hover:text-white'
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-emerald-400" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <ImageIcon className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <p className="text-xl font-semibold text-white/50">No images found in this category.</p>
          </div>
        ) : (
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
            <AnimatePresence>
              {filtered.map((item, i) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="break-inside-avoid relative group cursor-pointer"
                  onClick={() => setSelectedImage(item)}
                >
                  <img src={item.imageUrl} alt={item.caption} className="w-full rounded-2xl object-cover border border-white/10 group-hover:border-emerald-500/50 transition-colors" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl flex flex-col justify-end p-5">
                    <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/20 border border-emerald-500/30 px-2 py-1 rounded-md mb-2 w-max">{item.category}</span>
                    <p className="text-white font-medium text-sm line-clamp-2">{item.caption}</p>
                    {item.location && <p className="text-gray-400 text-xs mt-1 flex items-center gap-1"><MapPin className="w-3 h-3" />{item.location}</p>}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedImage(null)}
          >
            <div className="max-w-5xl w-full relative" onClick={e => e.stopPropagation()}>
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute -top-12 right-0 text-white hover:text-emerald-400 transition-colors"
              >
                Close ✕
              </button>
              <img
                src={selectedImage.imageUrl}
                alt={selectedImage.caption}
                className="w-full max-h-[80vh] object-contain rounded-xl shadow-2xl"
              />
              <div className="mt-4 text-center">
                <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-1 rounded-md mr-3">{selectedImage.category}</span>
                <span className="text-white text-lg">{selectedImage.caption}</span>
                {selectedImage.location && <span className="text-gray-400 text-sm ml-3">— 📍 {selectedImage.location}</span>}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
      <FloatingWidgets />
    </div>
  );
}

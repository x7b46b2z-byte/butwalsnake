'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, AlertTriangle, Shield, Zap, X } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import FloatingWidgets from '@/components/FloatingWidgets';

interface Species {
  id: string;
  name: string;
  scientificName: string;
  nepaliName: string;
  venomous: boolean;
  habitat: string;
  identificationGuide: string;
  behavior: string;
  safetyTips: string;
  emergencyAdvice: string;
  imageUrl: string;
}

export default function SnakesPage() {
  const [species, setSpecies] = useState<Species[]>([]);
  const [filtered, setFiltered] = useState<Species[]>([]);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'ALL' | 'VENOMOUS' | 'NON_VENOMOUS'>('ALL');
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Species | null>(null);

  useEffect(() => {
    fetch('/api/species').then(r => r.json()).then(data => {
      if (data.success) { setSpecies(data.data); setFiltered(data.data); }
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  useEffect(() => {
    let result = species;
    if (filter === 'VENOMOUS') result = result.filter(s => s.venomous);
    if (filter === 'NON_VENOMOUS') result = result.filter(s => !s.venomous);
    if (search) { const q = search.toLowerCase(); result = result.filter(s => s.name.toLowerCase().includes(q) || s.scientificName.toLowerCase().includes(q) || s.nepaliName.toLowerCase().includes(q)); }
    setFiltered(result);
  }, [search, filter, species]);

  return (
    <div className="min-h-screen bg-[#0f1a1c]">
      <Navbar />
      <div className="relative overflow-hidden py-20 px-4 text-center border-b border-white/5">
        <div className="absolute inset-0 bg-gradient-to-b from-emerald-900/20 to-transparent pointer-events-none" />
        <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
          <div className="inline-flex items-center gap-2 bg-emerald-500/20 border border-emerald-500/40 rounded-full px-4 py-1.5 mb-4">
            <Shield className="w-4 h-4 text-emerald-400" />
            <span className="text-emerald-400 text-sm font-semibold">SNAKE DIRECTORY</span>
          </div>
          <h1 className="text-5xl font-bold text-white mb-4">Know Your Snakes</h1>
          <p className="text-gray-400 max-w-xl mx-auto">Identify local species found in Rupandehi District. Knowledge saves lives.</p>
        </motion.div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-3.5 w-5 h-5 text-gray-500" />
            <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name, scientific or Nepali name..." className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500 transition-colors" />
          </div>
          <div className="flex gap-2">
            {(['ALL', 'VENOMOUS', 'NON_VENOMOUS'] as const).map(f => (
              <button key={f} onClick={() => setFilter(f)} className={`px-4 py-2 rounded-xl text-sm font-semibold border transition-all ${filter === f ? 'bg-emerald-500 border-emerald-500 text-black' : 'bg-white/5 border-white/10 text-gray-400 hover:text-white'}`}>
                {f === 'ALL' ? 'All' : f === 'VENOMOUS' ? '☠️ Venomous' : '✅ Safe'}
              </button>
            ))}
          </div>
        </div>

        {/* AI Banner */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card rounded-2xl p-5 border border-purple-500/30 mb-8 flex flex-col sm:flex-row items-center gap-4">
          <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center shrink-0"><Zap className="w-6 h-6 text-purple-400" /></div>
          <div className="flex-1 text-center sm:text-left">
            <h3 className="text-white font-bold mb-1">🤖 AI Snake Identifier — Coming Soon</h3>
            <p className="text-gray-400 text-sm">Upload a photo and our AI will identify the species, danger level, and first aid steps.</p>
          </div>
          <div className="bg-purple-500/20 border border-purple-500/40 text-purple-400 text-xs font-semibold px-3 py-1.5 rounded-full whitespace-nowrap">In Development</div>
        </motion.div>

        <p className="text-gray-500 text-sm mb-6">{loading ? 'Loading...' : `${filtered.length} species found`}</p>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">{[...Array(6)].map((_, i) => (<div key={i} className="glass-card rounded-2xl p-6 animate-pulse border border-white/10"><div className="h-40 bg-white/10 rounded-xl mb-4" /><div className="h-5 bg-white/10 rounded mb-2 w-3/4" /><div className="h-4 bg-white/10 rounded w-1/2" /></div>))}</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {filtered.map((snake, i) => (
                <motion.div key={snake.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9 }} transition={{ delay: i * 0.05 }}
                  onClick={() => setSelected(snake)} className="glass-card rounded-2xl overflow-hidden border border-white/10 hover:border-emerald-500/40 cursor-pointer group transition-all hover:scale-[1.02]">
                  <div className="relative h-44 bg-gradient-to-br from-emerald-900/40 to-slate-900/40 overflow-hidden">
                    <div className="absolute inset-0 flex items-center justify-center text-7xl opacity-30 group-hover:opacity-50 transition-opacity select-none">🐍</div>
                    {snake.venomous && (
                      <div className="absolute top-3 right-3 bg-red-500/90 text-white text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1"><AlertTriangle className="w-3 h-3" /> VENOMOUS</div>
                    )}
                    {!snake.venomous && (
                      <div className="absolute top-3 left-3 bg-emerald-500/90 text-black text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1"><Shield className="w-3 h-3" /> NON-VENOMOUS</div>
                    )}
                  </div>
                  <div className="p-5">
                    <h3 className="text-white font-bold text-lg leading-tight group-hover:text-emerald-400 transition-colors">{snake.name}</h3>
                    <p className="text-gray-400 text-sm italic mb-1">{snake.scientificName}</p>
                    <p className="text-emerald-400/70 text-xs mb-3">🇳🇵 {snake.nepaliName}</p>
                    <p className="text-gray-400 text-sm line-clamp-2">{snake.behavior}</p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}

        {!loading && filtered.length === 0 && (
          <div className="text-center py-20 text-gray-500"><p className="text-5xl mb-4">🔍</p><p className="text-xl font-semibold text-white/50">No species found</p></div>
        )}
      </div>

      {/* Detail Modal */}
      <AnimatePresence>
        {selected && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={e => e.target === e.currentTarget && setSelected(null)}>
            <motion.div initial={{ scale: 0.9, y: 20, opacity: 0 }} animate={{ scale: 1, y: 0, opacity: 1 }} exit={{ scale: 0.9, y: 20, opacity: 0 }} className="bg-[#0f1a1c] border border-white/10 rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
              <div className="relative h-48 bg-gradient-to-br from-emerald-900/60 to-slate-900/60">
                <div className="absolute inset-0 flex items-center justify-center text-9xl opacity-30">🐍</div>
                <button onClick={() => setSelected(null)} className="absolute top-4 right-4 w-8 h-8 bg-black/40 rounded-full flex items-center justify-center text-white hover:bg-black/70 transition-colors"><X className="w-4 h-4" /></button>
                {selected.venomous ? (
                  <div className="absolute bottom-4 left-4 bg-red-500/90 text-white text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1"><AlertTriangle className="w-3 h-3" /> VENOMOUS</div>
                ) : (
                  <div className="absolute bottom-4 left-4 bg-emerald-500/90 text-black text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1"><Shield className="w-3 h-3" /> NON-VENOMOUS</div>
                )}
              </div>
              <div className="p-6">
                <h2 className="text-2xl font-bold text-white">{selected.name}</h2>
                <p className="text-gray-400 italic">{selected.scientificName}</p>
                <p className="text-emerald-400 text-sm mt-1">🇳🇵 {selected.nepaliName}</p>
                <div className="space-y-4 mt-5">
                  {[
                    { label: 'Habitat', value: selected.habitat },
                    { label: 'How to Identify', value: selected.identificationGuide },
                    { label: 'Behaviour', value: selected.behavior },
                    { label: 'Safety Tips', value: selected.safetyTips },
                  ].map(({ label, value }) => (
                    <div key={label}><h4 className="text-emerald-400 text-sm font-semibold mb-1 uppercase tracking-wide">{label}</h4><p className="text-gray-300 text-sm leading-relaxed">{value}</p></div>
                  ))}
                  {selected.venomous && (
                    <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4">
                      <h4 className="text-red-400 text-sm font-bold mb-2 flex items-center gap-2"><AlertTriangle className="w-4 h-4" /> If Bitten — Emergency Advice</h4>
                      <p className="text-red-300 text-sm leading-relaxed">{selected.emergencyAdvice}</p>
                    </div>
                  )}
                </div>
                <div className="mt-6 flex gap-3">
                  <a href="/emergency" className="flex-1 bg-red-500/20 border border-red-500/40 text-red-400 py-2.5 rounded-xl text-sm font-semibold text-center hover:bg-red-500/30 transition-colors">🚨 Emergency Rescue</a>
                  <a href="/firstaid" className="flex-1 bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 py-2.5 rounded-xl text-sm font-semibold text-center hover:bg-emerald-500/30 transition-colors">🏥 First Aid Guide</a>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <Footer />
      <FloatingWidgets />
    </div>
  );
}

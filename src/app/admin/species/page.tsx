'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bug, Search, RefreshCw, Loader2, AlertTriangle, Shield, X, ChevronRight } from 'lucide-react';

interface Species {
  id: string; name: string; scientificName: string; nepaliName: string;
  venomous: boolean; habitat: string; identificationGuide: string;
  behavior: string; safetyTips: string; emergencyAdvice: string;
}

export default function AdminSpeciesPage() {
  const [species, setSpecies] = useState<Species[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'ALL' | 'VENOMOUS' | 'NON_VENOMOUS'>('ALL');
  const [selected, setSelected] = useState<Species | null>(null);

  const fetchSpecies = useCallback(async () => { setLoading(true); try { const res = await fetch('/api/species'); const data = await res.json(); if (data.success) setSpecies(data.data); } finally { setLoading(false); } }, []);
  useEffect(() => { fetchSpecies(); }, [fetchSpecies]);

  const filtered = species.filter(s => {
    if (filter === 'VENOMOUS' && !s.venomous) return false;
    if (filter === 'NON_VENOMOUS' && s.venomous) return false;
    if (search) { const q = search.toLowerCase(); return s.name.toLowerCase().includes(q) || s.scientificName.toLowerCase().includes(q) || s.nepaliName.toLowerCase().includes(q); }
    return true;
  });

  return (
    <div className="space-y-6 max-w-7xl">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold text-white">Snake Species Database</h1><p className="text-gray-400 text-sm mt-1">{species.length} species · {species.filter(s => s.venomous).length} venomous</p></div>
        <button onClick={fetchSpecies} className="flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 px-4 py-2 rounded-xl text-sm transition-colors"><RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} /> Refresh</button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1"><Search className="absolute left-4 top-3.5 w-4 h-4 text-gray-500" /><input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search species..." className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-emerald-500 text-sm transition-colors" /></div>
        <div className="flex gap-2">{(['ALL', 'VENOMOUS', 'NON_VENOMOUS'] as const).map(f => <button key={f} onClick={() => setFilter(f)} className={`px-4 py-2.5 rounded-xl text-sm font-semibold border transition-all ${filter === f ? 'bg-emerald-500 border-emerald-500 text-black' : 'bg-white/5 border-white/10 text-gray-400 hover:text-white'}`}>{f === 'ALL' ? 'All' : f === 'VENOMOUS' ? '☠️ Venomous' : '✅ Safe'}</button>)}</div>
      </div>

      {loading ? <div className="flex items-center justify-center py-16"><Loader2 className="w-6 h-6 animate-spin text-emerald-400" /></div> : (
        <div className="glass-card rounded-2xl border border-white/10 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="border-b border-white/5">{['Name', 'Scientific Name', 'Nepali Name', 'Venomous', 'Action'].map(h => <th key={h} className="text-left text-gray-500 font-medium px-5 py-3 whitespace-nowrap">{h}</th>)}</tr></thead>
              <tbody>
                {filtered.map((s, i) => (
                  <motion.tr key={s.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }} className="border-b border-white/5 hover:bg-white/[0.03] transition-colors">
                    <td className="px-5 py-3 text-white font-medium whitespace-nowrap">{s.name}</td>
                    <td className="px-5 py-3 text-gray-400 italic text-xs whitespace-nowrap">{s.scientificName}</td>
                    <td className="px-5 py-3 text-emerald-400/70 text-xs">{s.nepaliName}</td>
                    <td className="px-5 py-3">{s.venomous ? <span className="flex items-center gap-1 text-red-400 text-xs font-semibold"><AlertTriangle className="w-3 h-3" />Yes</span> : <span className="flex items-center gap-1 text-emerald-400 text-xs font-semibold"><Shield className="w-3 h-3" />No</span>}</td>
                    <td className="px-5 py-3"><button onClick={() => setSelected(s)} className="text-emerald-400 hover:text-emerald-300 text-xs font-semibold transition-colors flex items-center gap-1">View <ChevronRight className="w-3 h-3" /></button></td>
                  </motion.tr>
                ))}
                {filtered.length === 0 && <tr><td colSpan={5} className="text-center text-gray-500 py-10">No species found</td></tr>}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <AnimatePresence>
        {selected && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={e => e.target === e.currentTarget && setSelected(null)}>
            <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }} className="bg-[#0f1a1c] border border-white/10 rounded-3xl max-w-md w-full max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between p-6 border-b border-white/5"><h3 className="text-white font-bold">Species Detail</h3><button onClick={() => setSelected(null)} className="text-gray-500 hover:text-white"><X className="w-5 h-5" /></button></div>
              <div className="p-6 space-y-4">
                <div className="h-32 bg-gradient-to-br from-emerald-900/40 to-slate-900/60 rounded-2xl flex items-center justify-center"><span className="text-8xl opacity-30">🐍</span></div>
                <div className="flex items-start gap-3">
                  <div className="flex-1"><h4 className="text-white font-bold text-xl">{selected.name}</h4><p className="text-gray-400 italic text-sm">{selected.scientificName}</p><p className="text-emerald-400 text-sm">🇳🇵 {selected.nepaliName}</p></div>
                  {selected.venomous && <span className="text-xs font-bold px-2.5 py-1 rounded-full border border-red-500/30 bg-red-500/20 text-red-400">VENOMOUS</span>}
                </div>
                {[['Habitat', selected.habitat], ['How to Identify', selected.identificationGuide], ['Behaviour', selected.behavior], ['Safety Tips', selected.safetyTips], ['Emergency Advice', selected.emergencyAdvice]].map(([l, v]) => (
                  <div key={l} className="bg-white/5 rounded-xl p-3"><p className="text-gray-500 text-xs mb-1">{l}</p><p className="text-white text-sm leading-relaxed">{v}</p></div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

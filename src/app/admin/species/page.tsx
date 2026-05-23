'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bug, Search, RefreshCw, Loader2, AlertTriangle, Shield, X, ChevronRight } from 'lucide-react';

interface Species {
  id: string; name: string; scientificName: string; nepaliName: string;
  venomous: boolean; habitat: string; identificationGuide: string;
  behavior: string; safetyTips: string; emergencyAdvice: string;
  imageUrl?: string | null;
}

export default function AdminSpeciesPage() {
  const [species, setSpecies] = useState<Species[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'ALL' | 'VENOMOUS' | 'NON_VENOMOUS'>('ALL');
  const [selected, setSelected] = useState<Species | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [adding, setAdding] = useState(false);
  const [addError, setAddError] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [editForm, setEditForm] = useState<Species | null>(null);

  const BLANK_SPECIES = { name: '', scientificName: '', nepaliName: '', venomous: false, habitat: '', identificationGuide: '', behavior: '', safetyTips: '', emergencyAdvice: '', imageUrl: '' };
  const [addForm, setAddForm] = useState(BLANK_SPECIES);

  const fetchSpecies = useCallback(async () => { setLoading(true); try { const res = await fetch('/api/species'); const data = await res.json(); if (data.success) setSpecies(data.data); } finally { setLoading(false); } }, []);
  useEffect(() => { fetchSpecies(); }, [fetchSpecies]);

  const filtered = species.filter(s => {
    if (filter === 'VENOMOUS' && !s.venomous) return false;
    if (filter === 'NON_VENOMOUS' && s.venomous) return false;
    if (search) { const q = search.toLowerCase(); return s.name.toLowerCase().includes(q) || s.scientificName.toLowerCase().includes(q) || s.nepaliName.toLowerCase().includes(q); }
    return true;
  });

  const handleAdd = async () => {
    setAddError('');
    if (!addForm.name || !addForm.scientificName || !addForm.nepaliName || !addForm.imageUrl) { setAddError('Name, Scientific Name, Nepali Name, and Image URL are required.'); return; }
    setAdding(true);
    try {
      const res = await fetch('/api/species', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(addForm),
      });
      const data = await res.json();
      if (data.success) { setAddForm(BLANK_SPECIES); setShowAdd(false); fetchSpecies(); }
      else setAddError(data.error || 'Failed to add species.');
    } finally { setAdding(false); }
  };

  const handleUpdate = async () => {
    if (!editForm) return;
    setAddError('');
    if (!editForm.name || !editForm.scientificName || !editForm.nepaliName) { setAddError('Name, Scientific Name, and Nepali Name are required.'); return; }
    setUpdating(true);
    try {
      const res = await fetch(`/api/species/${editForm.id}`, {
        method: 'PATCH', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editForm),
      });
      const data = await res.json();
      if (data.success) {
        setIsEditing(false);
        setSelected(data.data);
        setSpecies(prev => prev.map(s => s.id === data.data.id ? data.data : s));
      } else setAddError(data.error || 'Failed to update species.');
    } finally { setUpdating(false); }
  };

  return (
    <div className="space-y-6 max-w-7xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div><h1 className="text-2xl font-bold text-white">Snake Species Database</h1><p className="text-gray-400 text-sm mt-1">{species.length} species · {species.filter(s => s.venomous).length} venomous</p></div>
        <div className="flex gap-2">
          <button onClick={fetchSpecies} className="flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 px-4 py-2 rounded-xl text-sm transition-colors"><RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} /> Refresh</button>
          <button onClick={() => setShowAdd(true)} className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-black font-bold px-4 py-2 rounded-xl text-sm transition-colors">Add Species</button>
        </div>
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
                    <td className="px-5 py-3"><button onClick={() => { setSelected(s); setIsEditing(false); setEditForm(s); }} className="text-emerald-400 hover:text-emerald-300 text-xs font-semibold transition-colors flex items-center gap-1">View <ChevronRight className="w-3 h-3" /></button></td>
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
            <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }} className="bg-[#0f1a1c] border border-white/10 rounded-3xl max-w-xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between p-6 border-b border-white/5">
                <h3 className="text-white font-bold">{isEditing ? 'Edit Species' : 'Species Detail'}</h3>
                <div className="flex items-center gap-3">
                  {!isEditing && <button onClick={() => setIsEditing(true)} className="text-emerald-400 hover:text-emerald-300 text-sm font-semibold transition-colors">Edit</button>}
                  <button onClick={() => setSelected(null)} className="text-gray-500 hover:text-white"><X className="w-5 h-5" /></button>
                </div>
              </div>
              
              {isEditing && editForm ? (
                <div className="p-6 space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div><label className="text-xs text-gray-500 mb-1.5 block font-medium">Common Name *</label><input value={editForm.name} onChange={e => setEditForm(p => p ? ({ ...p, name: e.target.value }) : null)} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:border-emerald-500" /></div>
                    <div><label className="text-xs text-gray-500 mb-1.5 block font-medium">Scientific Name *</label><input value={editForm.scientificName} onChange={e => setEditForm(p => p ? ({ ...p, scientificName: e.target.value }) : null)} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:border-emerald-500" /></div>
                    <div><label className="text-xs text-gray-500 mb-1.5 block font-medium">Nepali Name *</label><input value={editForm.nepaliName} onChange={e => setEditForm(p => p ? ({ ...p, nepaliName: e.target.value }) : null)} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:border-emerald-500" /></div>
                    <div><label className="text-xs text-gray-500 mb-1.5 block font-medium">Is Venomous?</label>
                      <select value={editForm.venomous ? 'true' : 'false'} onChange={e => setEditForm(p => p ? ({ ...p, venomous: e.target.value === 'true' }) : null)} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:border-emerald-500 appearance-none">
                        <option value="false" className="bg-[#0f1a1c]">No - Safe</option>
                        <option value="true" className="bg-[#0f1a1c]">Yes - Venomous</option>
                      </select>
                    </div>
                  </div>
                  <div><label className="text-xs text-gray-500 mb-1.5 block font-medium">Image URL *</label><input value={editForm.imageUrl || ''} onChange={e => setEditForm(p => p ? ({ ...p, imageUrl: e.target.value }) : null)} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:border-emerald-500" /></div>
                  
                  <div className="grid grid-cols-1 gap-4">
                    <div><label className="text-xs text-gray-500 mb-1.5 block font-medium">Habitat</label><textarea value={editForm.habitat} onChange={e => setEditForm(p => p ? ({ ...p, habitat: e.target.value }) : null)} rows={2} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:border-emerald-500 resize-none" /></div>
                    <div><label className="text-xs text-gray-500 mb-1.5 block font-medium">Identification Guide</label><textarea value={editForm.identificationGuide} onChange={e => setEditForm(p => p ? ({ ...p, identificationGuide: e.target.value }) : null)} rows={2} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:border-emerald-500 resize-none" /></div>
                    <div><label className="text-xs text-gray-500 mb-1.5 block font-medium">Behavior</label><textarea value={editForm.behavior} onChange={e => setEditForm(p => p ? ({ ...p, behavior: e.target.value }) : null)} rows={2} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:border-emerald-500 resize-none" /></div>
                    <div><label className="text-xs text-gray-500 mb-1.5 block font-medium">Safety Tips</label><textarea value={editForm.safetyTips} onChange={e => setEditForm(p => p ? ({ ...p, safetyTips: e.target.value }) : null)} rows={2} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:border-emerald-500 resize-none" /></div>
                    <div><label className="text-xs text-gray-500 mb-1.5 block font-medium">Emergency Advice</label><textarea value={editForm.emergencyAdvice} onChange={e => setEditForm(p => p ? ({ ...p, emergencyAdvice: e.target.value }) : null)} rows={2} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:border-emerald-500 resize-none" /></div>
                  </div>

                  {addError && <p className="text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-2">{addError}</p>}
                  <div className="flex gap-3 pt-2">
                    <button onClick={() => setIsEditing(false)} disabled={updating} className="flex-1 py-3 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-xl transition-colors font-bold">Cancel</button>
                    <button onClick={handleUpdate} disabled={updating} className="flex-1 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-black font-bold py-3 rounded-xl flex items-center justify-center gap-2">
                      {updating ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Save Changes'}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="p-6 space-y-4">
                  {selected.imageUrl ? (
                    <div 
                      className="h-48 bg-cover bg-center rounded-2xl border border-white/10"
                      style={{ backgroundImage: `url(${selected.imageUrl})` }}
                    />
                  ) : (
                    <div className="h-32 bg-gradient-to-br from-emerald-900/40 to-slate-900/60 rounded-2xl flex items-center justify-center"><span className="text-8xl opacity-30">🐍</span></div>
                  )}
                  <div className="flex items-start gap-3">
                    <div className="flex-1"><h4 className="text-white font-bold text-xl">{selected.name}</h4><p className="text-gray-400 italic text-sm">{selected.scientificName}</p><p className="text-emerald-400 text-sm">🇳🇵 {selected.nepaliName}</p></div>
                    {selected.venomous && <span className="text-xs font-bold px-2.5 py-1 rounded-full border border-red-500/30 bg-red-500/20 text-red-400">VENOMOUS</span>}
                  </div>
                  {[['Habitat', selected.habitat], ['How to Identify', selected.identificationGuide], ['Behaviour', selected.behavior], ['Safety Tips', selected.safetyTips], ['Emergency Advice', selected.emergencyAdvice]].map(([l, v]) => (
                    <div key={l} className="bg-white/5 rounded-xl p-3"><p className="text-gray-500 text-xs mb-1">{l}</p><p className="text-white text-sm leading-relaxed">{v}</p></div>
                  ))}
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add Species Modal */}
      <AnimatePresence>
        {showAdd && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={e => e.target === e.currentTarget && setShowAdd(false)}>
            <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9 }} className="bg-[#0f1a1c] border border-white/10 rounded-3xl max-w-xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between p-6 border-b border-white/5">
                <h3 className="text-white font-bold text-lg">Add New Species</h3>
                <button onClick={() => setShowAdd(false)} className="text-gray-500 hover:text-white"><X className="w-5 h-5" /></button>
              </div>
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div><label className="text-xs text-gray-500 mb-1.5 block font-medium">Common Name *</label><input value={addForm.name} onChange={e => setAddForm(p => ({ ...p, name: e.target.value }))} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:border-emerald-500" /></div>
                  <div><label className="text-xs text-gray-500 mb-1.5 block font-medium">Scientific Name *</label><input value={addForm.scientificName} onChange={e => setAddForm(p => ({ ...p, scientificName: e.target.value }))} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:border-emerald-500" /></div>
                  <div><label className="text-xs text-gray-500 mb-1.5 block font-medium">Nepali Name *</label><input value={addForm.nepaliName} onChange={e => setAddForm(p => ({ ...p, nepaliName: e.target.value }))} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:border-emerald-500" /></div>
                  <div><label className="text-xs text-gray-500 mb-1.5 block font-medium">Is Venomous?</label>
                    <select value={addForm.venomous ? 'true' : 'false'} onChange={e => setAddForm(p => ({ ...p, venomous: e.target.value === 'true' }))} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:border-emerald-500 appearance-none">
                      <option value="false" className="bg-[#0f1a1c]">No - Safe</option>
                      <option value="true" className="bg-[#0f1a1c]">Yes - Venomous</option>
                    </select>
                  </div>
                </div>
                <div><label className="text-xs text-gray-500 mb-1.5 block font-medium">Image URL *</label><input value={addForm.imageUrl} onChange={e => setAddForm(p => ({ ...p, imageUrl: e.target.value }))} placeholder="https://..." className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:border-emerald-500" /></div>
                
                <div className="grid grid-cols-1 gap-4">
                  <div><label className="text-xs text-gray-500 mb-1.5 block font-medium">Habitat</label><textarea value={addForm.habitat} onChange={e => setAddForm(p => ({ ...p, habitat: e.target.value }))} rows={2} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:border-emerald-500 resize-none" /></div>
                  <div><label className="text-xs text-gray-500 mb-1.5 block font-medium">Identification Guide</label><textarea value={addForm.identificationGuide} onChange={e => setAddForm(p => ({ ...p, identificationGuide: e.target.value }))} rows={2} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:border-emerald-500 resize-none" /></div>
                  <div><label className="text-xs text-gray-500 mb-1.5 block font-medium">Behavior</label><textarea value={addForm.behavior} onChange={e => setAddForm(p => ({ ...p, behavior: e.target.value }))} rows={2} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:border-emerald-500 resize-none" /></div>
                  <div><label className="text-xs text-gray-500 mb-1.5 block font-medium">Safety Tips</label><textarea value={addForm.safetyTips} onChange={e => setAddForm(p => ({ ...p, safetyTips: e.target.value }))} rows={2} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:border-emerald-500 resize-none" /></div>
                  <div><label className="text-xs text-gray-500 mb-1.5 block font-medium">Emergency Advice</label><textarea value={addForm.emergencyAdvice} onChange={e => setAddForm(p => ({ ...p, emergencyAdvice: e.target.value }))} rows={2} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:border-emerald-500 resize-none" /></div>
                </div>

                {addError && <p className="text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-2">{addError}</p>}
                <button onClick={handleAdd} disabled={adding} className="w-full bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-black font-bold py-3 rounded-xl flex items-center justify-center gap-2">
                  {adding ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Add Species'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

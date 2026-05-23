'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Search, RefreshCw, Loader2, CheckCircle, X, Phone, MapPin } from 'lucide-react';

interface Volunteer {
  id: string; name: string; contact: string; address: string; municipality: string;
  experience: string; vehicle: string; availableTime: string; skills: string;
  emergencyAvailability: string; status: string; assignedZone: string | null; 
  imageUrl: string | null; isAvailableNow: boolean; createdAt: string;
}

const STATUS_OPTS = ['PENDING', 'APPROVED', 'REJECTED'];
const STATUS_COLORS: Record<string, string> = { PENDING: 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30', APPROVED: 'text-emerald-400 bg-emerald-500/20 border-emerald-500/30', REJECTED: 'text-red-400 bg-red-500/20 border-red-500/30' };

export default function AdminVolunteersPage() {
  const [volunteers, setVolunteers] = useState<Volunteer[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [selected, setSelected] = useState<Volunteer | null>(null);
  const [updating, setUpdating] = useState('');
  const [showAdd, setShowAdd] = useState(false);
  const [adding, setAdding] = useState(false);
  const [addError, setAddError] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<Volunteer | null>(null);
  const BLANK_VOLUNTEER = { name: '', contact: '', address: '', municipality: 'Butwal', experience: 'Beginner', vehicle: 'None', availableTime: '', skills: '', emergencyAvailability: 'Yes', status: 'APPROVED', assignedZone: '', imageUrl: '', isAvailableNow: true };
  const [addForm, setAddForm] = useState(BLANK_VOLUNTEER);

  const fetchVolunteers = useCallback(async () => { setLoading(true); try { const res = await fetch('/api/volunteer'); const data = await res.json(); if (data.success) setVolunteers(data.data); } finally { setLoading(false); } }, []);
  useEffect(() => { fetchVolunteers(); }, [fetchVolunteers]);

  const updateStatus = async (id: string, status: string) => {
    setUpdating(id);
    try { const res = await fetch(`/api/volunteer/${id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status }) }); const data = await res.json(); if (data.success) { setVolunteers(prev => prev.map(v => v.id === id ? { ...v, status } : v)); if (selected?.id === id) setSelected(prev => prev ? { ...prev, status } : null); } } finally { setUpdating(''); }
  };

  const handleAdd = async () => {
    setAddError('');
    if (!addForm.name || !addForm.contact || !addForm.address || !addForm.availableTime || !addForm.skills) { setAddError('Please fill out all required fields.'); return; }
    setAdding(true);
    try {
      const res = await fetch('/api/volunteer', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(addForm),
      });
      const data = await res.json();
      if (data.success) { setAddForm(BLANK_VOLUNTEER); setShowAdd(false); fetchVolunteers(); }
      else setAddError(data.error || 'Failed to add volunteer.');
    } finally { setAdding(false); }
  };

  const handleUpdate = async () => {
    if (!editForm) return;
    setAddError('');
    setUpdating('edit');
    try {
      const res = await fetch(`/api/volunteer/${editForm.id}`, {
        method: 'PATCH', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          imageUrl: editForm.imageUrl, 
          isAvailableNow: editForm.isAvailableNow,
          assignedZone: editForm.assignedZone
        }),
      });
      const data = await res.json();
      if (data.success) {
        setIsEditing(false);
        setSelected(data.data);
        setVolunteers(prev => prev.map(v => v.id === data.data.id ? data.data : v));
      } else setAddError(data.error || 'Failed to update volunteer.');
    } finally { setUpdating(''); }
  };

  const filtered = volunteers.filter(v => {
    if (statusFilter !== 'ALL' && v.status !== statusFilter) return false;
    if (search) { const q = search.toLowerCase(); return v.name.toLowerCase().includes(q) || v.contact.includes(q) || v.municipality.toLowerCase().includes(q); }
    return true;
  });

  const counts = { ALL: volunteers.length, PENDING: volunteers.filter(v => v.status === 'PENDING').length, APPROVED: volunteers.filter(v => v.status === 'APPROVED').length, REJECTED: volunteers.filter(v => v.status === 'REJECTED').length };

  return (
    <div className="space-y-6 max-w-7xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div><h1 className="text-2xl font-bold text-white">Volunteers</h1><p className="text-gray-400 text-sm mt-1">{counts.PENDING} pending applications need review</p></div>
        <div className="flex gap-2">
          <button onClick={fetchVolunteers} className="flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 px-4 py-2 rounded-xl text-sm transition-colors"><RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} /> Refresh</button>
          <button onClick={() => setShowAdd(true)} className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-black font-bold px-4 py-2 rounded-xl text-sm transition-colors">Add Volunteer</button>
        </div>
      </div>
      <div className="flex gap-2 flex-wrap">{(['ALL', ...STATUS_OPTS] as const).map(s => <button key={s} onClick={() => setStatusFilter(s)} className={`px-4 py-2 rounded-xl text-sm font-semibold border transition-all ${statusFilter === s ? 'bg-emerald-500 border-emerald-500 text-black' : 'bg-white/5 border-white/10 text-gray-400 hover:text-white'}`}>{s} ({counts[s as keyof typeof counts] ?? 0})</button>)}</div>
      <div className="relative max-w-sm"><Search className="absolute left-4 top-3.5 w-4 h-4 text-gray-500" /><input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search volunteers..." className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-emerald-500 text-sm transition-colors" /></div>

      {loading ? <div className="flex items-center justify-center py-16"><Loader2 className="w-6 h-6 animate-spin text-emerald-400" /></div> : filtered.length === 0 ? <div className="text-center py-16 text-gray-500">No volunteers found</div> : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((v, i) => (
            <motion.div key={v.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }} className="glass-card rounded-2xl p-5 border border-white/10 hover:border-white/20 transition-all">
              <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 bg-emerald-500/20 rounded-full flex items-center justify-center text-emerald-400 font-bold text-lg">{v.name.charAt(0).toUpperCase()}</div>
                <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${STATUS_COLORS[v.status]}`}>{v.status}</span>
              </div>
              <h3 className="text-white font-semibold text-base mb-1">{v.name}</h3>
              <p className="text-gray-500 text-xs mb-3">{v.municipality} · {v.experience} · {v.availableTime}</p>
              <div className="space-y-1.5 text-xs text-gray-400 mb-4">
                <p className="flex items-center gap-2"><Phone className="w-3 h-3 text-emerald-400" />{v.contact}</p>
                <p className="flex items-center gap-2"><MapPin className="w-3 h-3 text-yellow-400" />{v.address}</p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => { setSelected(v); setIsEditing(false); setEditForm(v); }} className="flex-1 py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 rounded-xl text-xs font-semibold transition-colors">View Details</button>
                {v.status === 'PENDING' && (<><button onClick={() => updateStatus(v.id, 'APPROVED')} disabled={updating === v.id} className="flex-1 py-2 bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/30 text-emerald-400 rounded-xl text-xs font-semibold transition-colors disabled:opacity-50">{updating === v.id ? '...' : '✓ Approve'}</button><button onClick={() => updateStatus(v.id, 'REJECTED')} disabled={updating === v.id} className="py-2 px-3 bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 text-red-400 rounded-xl text-xs font-semibold transition-colors disabled:opacity-50">✕</button></>)}
                {v.status === 'APPROVED' && <button onClick={() => updateStatus(v.id, 'REJECTED')} disabled={updating === v.id} className="flex-1 py-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 rounded-xl text-xs font-semibold transition-colors">Revoke</button>}
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <AnimatePresence>
        {selected && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={e => e.target === e.currentTarget && setSelected(null)}>
            <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }} className="bg-[#0f1a1c] border border-white/10 rounded-3xl max-w-md w-full max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between p-6 border-b border-white/5">
                <h3 className="text-white font-bold">{isEditing ? 'Edit Volunteer' : 'Volunteer Details'}</h3>
                <div className="flex items-center gap-3">
                  {!isEditing && <button onClick={() => setIsEditing(true)} className="text-emerald-400 hover:text-emerald-300 text-sm font-semibold transition-colors">Edit</button>}
                  <button onClick={() => setSelected(null)} className="text-gray-500 hover:text-white"><X className="w-5 h-5" /></button>
                </div>
              </div>
              
              {isEditing && editForm ? (
                <div className="p-6 space-y-4">
                  <div><label className="text-xs text-gray-500 mb-1.5 block font-medium">Profile Image URL</label><input value={editForm.imageUrl || ''} onChange={e => setEditForm(p => p ? ({ ...p, imageUrl: e.target.value }) : null)} placeholder="https://..." className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-emerald-500" /></div>
                  <div><label className="text-xs text-gray-500 mb-1.5 block font-medium">Assigned Zone</label><input value={editForm.assignedZone || ''} onChange={e => setEditForm(p => p ? ({ ...p, assignedZone: e.target.value }) : null)} placeholder="e.g. Butwal Ward 12" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-emerald-500" /></div>
                  <div><label className="flex items-center gap-2 text-white font-medium cursor-pointer"><input type="checkbox" checked={editForm.isAvailableNow} onChange={e => setEditForm(p => p ? ({ ...p, isAvailableNow: e.target.checked }) : null)} className="w-5 h-5 accent-emerald-500 rounded" /> Available for rescues right now</label></div>
                  
                  {addError && <p className="text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-2">{addError}</p>}
                  
                  <div className="flex gap-3 pt-4">
                    <button onClick={() => setIsEditing(false)} disabled={updating === 'edit'} className="flex-1 py-3 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-xl transition-colors font-bold">Cancel</button>
                    <button onClick={handleUpdate} disabled={updating === 'edit'} className="flex-1 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-black font-bold py-3 rounded-xl flex items-center justify-center gap-2">
                      {updating === 'edit' ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Save Changes'}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="p-6 space-y-4">
                  <div className="flex items-center gap-4">
                    {selected.imageUrl ? (
                      <div className="w-14 h-14 rounded-full bg-cover bg-center border border-emerald-500/40 relative" style={{ backgroundImage: `url(${selected.imageUrl})` }}>
                        {selected.isAvailableNow && <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-[#0f1a1c] rounded-full"></div>}
                      </div>
                    ) : (
                      <div className="w-14 h-14 bg-emerald-500/20 rounded-full flex items-center justify-center text-emerald-400 font-bold text-2xl relative">
                        {selected.name.charAt(0)}
                        {selected.isAvailableNow && <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-[#0f1a1c] rounded-full"></div>}
                      </div>
                    )}
                    <div>
                      <h4 className="text-white font-bold text-lg">{selected.name}</h4>
                      <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${STATUS_COLORS[selected.status]}`}>{selected.status}</span>
                    </div>
                  </div>
                  {[['Contact', selected.contact], ['Address', selected.address], ['Municipality', selected.municipality], ['Experience', selected.experience], ['Vehicle', selected.vehicle], ['Available Time', selected.availableTime], ['Emergency Available', selected.emergencyAvailability], ['Assigned Zone', selected.assignedZone || 'Not Assigned'], ['Skills', selected.skills], ['Applied On', new Date(selected.createdAt).toLocaleDateString()]].map(([l, v]) => (
                    <div key={l} className="bg-white/5 rounded-xl p-3"><p className="text-gray-500 text-xs mb-1">{l}</p><p className="text-white text-sm">{v}</p></div>
                  ))}
                  {selected.status === 'PENDING' && (
                    <div className="flex gap-3 pt-2">
                      <button onClick={() => { updateStatus(selected.id, 'APPROVED'); setSelected(null); }} className="flex-1 bg-emerald-500 hover:bg-emerald-400 text-black font-bold py-3 rounded-xl transition-colors flex items-center justify-center gap-2"><CheckCircle className="w-4 h-4" /> Approve</button>
                      <button onClick={() => { updateStatus(selected.id, 'REJECTED'); setSelected(null); }} className="flex-1 bg-red-500/20 hover:bg-red-500/30 border border-red-500/40 text-red-400 font-bold py-3 rounded-xl transition-colors">Reject</button>
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add Volunteer Modal */}
      <AnimatePresence>
        {showAdd && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={e => e.target === e.currentTarget && setShowAdd(false)}>
            <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9 }} className="bg-[#0f1a1c] border border-white/10 rounded-3xl max-w-xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between p-6 border-b border-white/5">
                <h3 className="text-white font-bold text-lg">Add New Volunteer</h3>
                <button onClick={() => setShowAdd(false)} className="text-gray-500 hover:text-white"><X className="w-5 h-5" /></button>
              </div>
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div><label className="text-xs text-gray-500 mb-1.5 block font-medium">Name *</label><input value={addForm.name} onChange={e => setAddForm(p => ({ ...p, name: e.target.value }))} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:border-emerald-500" /></div>
                  <div><label className="text-xs text-gray-500 mb-1.5 block font-medium">Contact *</label><input value={addForm.contact} onChange={e => setAddForm(p => ({ ...p, contact: e.target.value }))} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:border-emerald-500" /></div>
                  <div><label className="text-xs text-gray-500 mb-1.5 block font-medium">Municipality</label>
                    <select value={addForm.municipality} onChange={e => setAddForm(p => ({ ...p, municipality: e.target.value }))} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:border-emerald-500 appearance-none">
                      {['Butwal', 'Tilottama', 'Siddharthanagar', 'Devdaha', 'Other'].map(m => <option key={m} value={m} className="bg-[#0f1a1c]">{m}</option>)}
                    </select>
                  </div>
                  <div><label className="text-xs text-gray-500 mb-1.5 block font-medium">Experience</label>
                    <select value={addForm.experience} onChange={e => setAddForm(p => ({ ...p, experience: e.target.value }))} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:border-emerald-500 appearance-none">
                      {['Beginner', 'Intermediate', 'Advanced'].map(p => <option key={p} value={p} className="bg-[#0f1a1c]">{p}</option>)}
                    </select>
                  </div>
                  <div><label className="text-xs text-gray-500 mb-1.5 block font-medium">Assigned Zone</label><input value={addForm.assignedZone} onChange={e => setAddForm(p => ({ ...p, assignedZone: e.target.value }))} placeholder="e.g. Ward 12" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:border-emerald-500" /></div>
                  <div><label className="text-xs text-gray-500 mb-1.5 block font-medium">Profile Image URL</label><input value={addForm.imageUrl} onChange={e => setAddForm(p => ({ ...p, imageUrl: e.target.value }))} placeholder="https://..." className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:border-emerald-500" /></div>
                </div>
                <div><label className="text-xs text-gray-500 mb-1.5 block font-medium">Address *</label><input value={addForm.address} onChange={e => setAddForm(p => ({ ...p, address: e.target.value }))} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:border-emerald-500" /></div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div><label className="text-xs text-gray-500 mb-1.5 block font-medium">Available Time *</label><input value={addForm.availableTime} onChange={e => setAddForm(p => ({ ...p, availableTime: e.target.value }))} placeholder="e.g. Weekends, Evenings" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:border-emerald-500" /></div>
                  <div><label className="text-xs text-gray-500 mb-1.5 block font-medium">Skills *</label><input value={addForm.skills} onChange={e => setAddForm(p => ({ ...p, skills: e.target.value }))} placeholder="e.g. First aid, Snake handling" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:border-emerald-500" /></div>
                  <div><label className="text-xs text-gray-500 mb-1.5 block font-medium">Status</label>
                    <select value={addForm.status} onChange={e => setAddForm(p => ({ ...p, status: e.target.value }))} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:border-emerald-500 appearance-none">
                      {STATUS_OPTS.map(s => <option key={s} value={s} className="bg-[#0f1a1c]">{s}</option>)}
                    </select>
                  </div>
                  <div className="flex items-center mt-6">
                    <label className="flex items-center gap-2 text-white font-medium cursor-pointer text-sm">
                      <input type="checkbox" checked={addForm.isAvailableNow} onChange={e => setAddForm(p => ({ ...p, isAvailableNow: e.target.checked }))} className="w-5 h-5 accent-emerald-500 rounded" /> 
                      Available for rescues right now
                    </label>
                  </div>
                </div>
                
                {addError && <p className="text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-2">{addError}</p>}
                <button onClick={handleAdd} disabled={adding} className="w-full bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-black font-bold py-3 rounded-xl flex items-center justify-center gap-2">
                  {adding ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Add Volunteer'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

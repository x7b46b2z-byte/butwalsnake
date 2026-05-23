'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Phone, RefreshCw, CheckCircle, Loader2, X, Search, Plus } from 'lucide-react';

interface Rescue {
  id: string; name: string; phone: string; municipality: string; address: string;
  notes: string | null; status: string; priority: string; stillPresent: string;
  assignedToName: string | null; rescueNotes: string | null; createdAt: string;
  lat: number; lng: number;
}

const STATUS_OPTIONS = ['PENDING', 'ASSIGNED', 'IN_PROGRESS', 'RESCUED', 'CLOSED'];
const PRIORITY_OPTIONS = ['LOW', 'MEDIUM', 'HIGH', 'EMERGENCY'];
const MUNICIPALITIES = ['Butwal', 'Tilottama', 'Siddharthanagar', 'Devdaha', 'Other'];
const STATUS_COLORS: Record<string, string> = {
  PENDING: 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30',
  ASSIGNED: 'text-blue-400 bg-blue-500/20 border-blue-500/30',
  IN_PROGRESS: 'text-purple-400 bg-purple-500/20 border-purple-500/30',
  RESCUED: 'text-emerald-400 bg-emerald-500/20 border-emerald-500/30',
  CLOSED: 'text-gray-400 bg-gray-500/20 border-gray-500/30',
};
const PRIORITY_COLORS: Record<string, string> = {
  LOW: 'text-gray-400', MEDIUM: 'text-yellow-400', HIGH: 'text-orange-400', EMERGENCY: 'text-red-400',
};

const BLANK_ADD = { name: '', phone: '', municipality: 'Butwal', address: '', notes: '', status: 'PENDING', priority: 'HIGH', stillPresent: 'Yes', lat: '27.7082', lng: '83.4651' };

export default function AdminRescuesPage() {
  const [rescues, setRescues] = useState<Rescue[]>([]);
  const [filtered, setFiltered] = useState<Rescue[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [selected, setSelected] = useState<Rescue | null>(null);
  const [updating, setUpdating] = useState(false);
  const [editForm, setEditForm] = useState({ status: '', assignedToName: '', rescueNotes: '' });
  const [showAdd, setShowAdd] = useState(false);
  const [addForm, setAddForm] = useState({ ...BLANK_ADD });
  const [adding, setAdding] = useState(false);
  const [addError, setAddError] = useState('');

  const fetchRescues = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/rescue?limit=200');
      const data = await res.json();
      if (data.success) { setRescues(data.data); setFiltered(data.data); }
    } finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchRescues(); }, [fetchRescues]);

  useEffect(() => {
    let result = rescues;
    if (statusFilter !== 'ALL') result = result.filter(r => r.status === statusFilter);
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(r => r.name.toLowerCase().includes(q) || r.phone.includes(q) || r.address.toLowerCase().includes(q));
    }
    setFiltered(result);
  }, [rescues, statusFilter, search]);

  const openDetail = (r: Rescue) => {
    setSelected(r);
    setEditForm({ status: r.status, assignedToName: r.assignedToName || '', rescueNotes: r.rescueNotes || '' });
  };

  const handleUpdate = async () => {
    if (!selected) return;
    setUpdating(true);
    try {
      const res = await fetch(`/api/rescue/${selected.id}`, {
        method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(editForm),
      });
      const data = await res.json();
      if (data.success) { setRescues(prev => prev.map(r => r.id === selected.id ? { ...r, ...editForm } : r)); setSelected(null); }
    } finally { setUpdating(false); }
  };

  const handleAdd = async () => {
    setAddError('');
    if (!addForm.name || !addForm.phone || !addForm.address) { setAddError('Name, phone and address are required.'); return; }
    setAdding(true);
    try {
      const res = await fetch('/api/rescue', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...addForm, lat: parseFloat(addForm.lat) || 0, lng: parseFloat(addForm.lng) || 0 }),
      });
      const data = await res.json();
      if (data.success) { setAddForm({ ...BLANK_ADD }); setShowAdd(false); fetchRescues(); }
      else setAddError(data.error || 'Failed to add rescue.');
    } finally { setAdding(false); }
  };

  const counts: Record<string, number> = { ALL: rescues.length, ...Object.fromEntries(STATUS_OPTIONS.map(s => [s, rescues.filter(r => r.status === s).length])) };

  const inputCls = "w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder-gray-600 focus:outline-none focus:border-emerald-500 text-sm transition-colors";
  const labelCls = "text-xs text-gray-500 mb-1.5 block font-medium";

  return (
    <div className="space-y-6 max-w-7xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-white">Rescue Requests</h1>
          <p className="text-gray-400 text-sm mt-1">{rescues.length} total · {counts.PENDING || 0} pending</p>
        </div>
        <div className="flex gap-2">
          <button onClick={fetchRescues} className="flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 px-4 py-2 rounded-xl text-sm transition-colors">
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} /> Refresh
          </button>
          <button onClick={() => setShowAdd(true)} className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-black font-bold px-4 py-2 rounded-xl text-sm transition-colors">
            <Plus className="w-4 h-4" /> Add Rescue
          </button>
        </div>
      </div>

      {/* Status Filters */}
      <div className="flex gap-2 flex-wrap">
        {(['ALL', ...STATUS_OPTIONS] as const).map(s => (
          <button key={s} onClick={() => setStatusFilter(s)} className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${statusFilter === s ? 'bg-emerald-500 border-emerald-500 text-black' : 'bg-white/5 border-white/10 text-gray-400 hover:text-white'}`}>
            {s} ({counts[s] ?? 0})
          </button>
        ))}
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-4 top-3.5 w-4 h-4 text-gray-500" />
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search name, phone, address..." className={`${inputCls} pl-10`} />
      </div>

      <div className="glass-card rounded-2xl border border-white/10 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-16 text-gray-400"><Loader2 className="w-6 h-6 animate-spin text-emerald-400 mr-3" /> Loading...</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 text-gray-500">No rescue requests found</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="border-b border-white/5">{['Caller', 'Phone', 'Area', 'Address', 'Priority', 'Status', 'Action'].map(h => <th key={h} className="text-left text-gray-500 font-medium px-4 py-3 whitespace-nowrap text-xs">{h}</th>)}</tr></thead>
              <tbody>
                {filtered.map((r, i) => (
                  <motion.tr key={r.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.02 }} className="border-b border-white/5 hover:bg-white/[0.03] transition-colors">
                    <td className="px-4 py-3 text-white font-medium whitespace-nowrap">{r.name}</td>
                    <td className="px-4 py-3 text-gray-400 font-mono whitespace-nowrap"><a href={`tel:${r.phone}`} className="hover:text-emerald-400 transition-colors flex items-center gap-1"><Phone className="w-3 h-3" />{r.phone}</a></td>
                    <td className="px-4 py-3 text-gray-400 text-xs whitespace-nowrap">{r.municipality}</td>
                    <td className="px-4 py-3 text-gray-400 max-w-[140px] truncate text-xs" title={r.address}>{r.address}</td>
                    <td className="px-4 py-3 whitespace-nowrap"><span className={`text-xs font-bold ${PRIORITY_COLORS[r.priority] || 'text-gray-400'}`}>{r.priority}</span></td>
                    <td className="px-4 py-3 whitespace-nowrap"><span className={`text-xs font-bold px-2 py-1 rounded-full border ${STATUS_COLORS[r.status] || ''}`}>{r.status}</span></td>
                    <td className="px-4 py-3"><button onClick={() => openDetail(r)} className="text-emerald-400 hover:text-emerald-300 text-xs font-semibold transition-colors">Manage →</button></td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Edit Modal */}
      <AnimatePresence>
        {selected && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={e => e.target === e.currentTarget && setSelected(null)}>
            <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9 }} className="bg-[#0f1a1c] border border-white/10 rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between p-6 border-b border-white/5">
                <h3 className="text-white font-bold text-lg">Manage Rescue Request</h3>
                <button onClick={() => setSelected(null)} className="text-gray-500 hover:text-white"><X className="w-5 h-5" /></button>
              </div>
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  {[['Caller', selected.name], ['Phone', selected.phone], ['Municipality', selected.municipality], ['Submitted', new Date(selected.createdAt).toLocaleString()]].map(([l, v]) => (
                    <div key={l} className="bg-white/5 rounded-xl p-3"><p className="text-gray-500 text-xs mb-1">{l}</p><p className="text-white text-sm font-medium">{v}</p></div>
                  ))}
                </div>
                {selected.notes && <div className="bg-white/5 rounded-xl p-3"><p className="text-gray-500 text-xs mb-1">Notes</p><p className="text-white text-sm">{selected.notes}</p></div>}
                <div className="border-t border-white/5 pt-4 space-y-3">
                  <div><label className={labelCls}>Status</label>
                    <select value={editForm.status} onChange={e => setEditForm(p => ({ ...p, status: e.target.value }))} className={inputCls}>
                      {STATUS_OPTIONS.map(s => <option key={s} value={s} className="bg-[#0f1a1c]">{s}</option>)}
                    </select>
                  </div>
                  <div><label className={labelCls}>Assigned Rescuer</label><input value={editForm.assignedToName} onChange={e => setEditForm(p => ({ ...p, assignedToName: e.target.value }))} placeholder="Rescuer name..." className={inputCls} /></div>
                  <div><label className={labelCls}>Rescue Notes</label><textarea value={editForm.rescueNotes} onChange={e => setEditForm(p => ({ ...p, rescueNotes: e.target.value }))} placeholder="Notes from operation..." rows={3} className={`${inputCls} resize-none`} /></div>
                  <button onClick={handleUpdate} disabled={updating} className="w-full bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-black font-bold py-3 rounded-xl flex items-center justify-center gap-2">
                    {updating ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />} {updating ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Add Rescue Modal */}
        {showAdd && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={e => e.target === e.currentTarget && setShowAdd(false)}>
            <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9 }} className="bg-[#0f1a1c] border border-white/10 rounded-3xl max-w-xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between p-6 border-b border-white/5">
                <h3 className="text-white font-bold text-lg">Add New Rescue Record</h3>
                <button onClick={() => setShowAdd(false)} className="text-gray-500 hover:text-white"><X className="w-5 h-5" /></button>
              </div>
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div><label className={labelCls}>Caller Name *</label><input value={addForm.name} onChange={e => setAddForm(p => ({ ...p, name: e.target.value }))} placeholder="Full name" className={inputCls} /></div>
                  <div><label className={labelCls}>Phone *</label><input value={addForm.phone} onChange={e => setAddForm(p => ({ ...p, phone: e.target.value }))} placeholder="98XXXXXXXX" className={inputCls} /></div>
                  <div><label className={labelCls}>Municipality</label>
                    <select value={addForm.municipality} onChange={e => setAddForm(p => ({ ...p, municipality: e.target.value }))} className={inputCls}>
                      {MUNICIPALITIES.map(m => <option key={m} value={m} className="bg-[#0f1a1c]">{m}</option>)}
                    </select>
                  </div>
                  <div><label className={labelCls}>Priority</label>
                    <select value={addForm.priority} onChange={e => setAddForm(p => ({ ...p, priority: e.target.value }))} className={inputCls}>
                      {PRIORITY_OPTIONS.map(p => <option key={p} value={p} className="bg-[#0f1a1c]">{p}</option>)}
                    </select>
                  </div>
                  <div><label className={labelCls}>Status</label>
                    <select value={addForm.status} onChange={e => setAddForm(p => ({ ...p, status: e.target.value }))} className={inputCls}>
                      {STATUS_OPTIONS.map(s => <option key={s} value={s} className="bg-[#0f1a1c]">{s}</option>)}
                    </select>
                  </div>
                  <div><label className={labelCls}>Snake Still Present?</label>
                    <select value={addForm.stillPresent} onChange={e => setAddForm(p => ({ ...p, stillPresent: e.target.value }))} className={inputCls}>
                      <option value="Yes" className="bg-[#0f1a1c]">Yes</option>
                      <option value="No" className="bg-[#0f1a1c]">No</option>
                    </select>
                  </div>
                </div>
                <div><label className={labelCls}>Address *</label><input value={addForm.address} onChange={e => setAddForm(p => ({ ...p, address: e.target.value }))} placeholder="Street address or landmark" className={inputCls} /></div>
                <div><label className={labelCls}>Notes / Description</label><textarea value={addForm.notes} onChange={e => setAddForm(p => ({ ...p, notes: e.target.value }))} placeholder="Details about the snake or situation..." rows={3} className={`${inputCls} resize-none`} /></div>
                {addError && <p className="text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-2">{addError}</p>}
                <button onClick={handleAdd} disabled={adding} className="w-full bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-black font-bold py-3 rounded-xl flex items-center justify-center gap-2">
                  {adding ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />} {adding ? 'Adding...' : 'Add Rescue Record'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

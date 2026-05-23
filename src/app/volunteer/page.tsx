'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, Users, CheckCircle, Loader2, Shield, Star, Zap } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import FloatingWidgets from '@/components/FloatingWidgets';

const MUNICIPALITIES = ['Butwal', 'Tilottama', 'Siddharthanagar', 'Devdaha', 'Other'];
const EXPERIENCE_LEVELS = ['Beginner', 'Intermediate', 'Advanced'];
const VEHICLES = ['None', 'Bicycle', 'Motorcycle', 'Car', 'Other'];
const AVAILABLE_TIMES = ['Weekday Daytime', 'Weekday Evening', 'Weekends', 'Anytime', 'On-call only'];

const BENEFITS = [
  { icon: Shield, title: 'Professional Training', desc: 'Free snake handling & rescue training from experts', color: 'emerald' },
  { icon: Star, title: 'Wildlife Certificate', desc: 'Official certificate from Butwal Snake Rescuers', color: 'yellow' },
  { icon: Zap, title: 'Emergency Skills', desc: 'Learn life-saving first aid and crisis response', color: 'blue' },
  { icon: Heart, title: 'Community Impact', desc: 'Make a real difference in Rupandehi communities', color: 'red' },
];

export default function VolunteerPage() {
  const [form, setForm] = useState({ name: '', contact: '', address: '', municipality: 'Butwal', experience: 'Beginner', vehicle: 'None', availableTime: 'Anytime', skills: '', emergencyAvailability: 'Yes' });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const update = (k: string, v: string) => { setForm(p => ({ ...p, [k]: v })); setError(''); };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.contact) { setError('Please fill in Name and Contact number.'); return; }
    setLoading(true);
    try {
      const res = await fetch('/api/volunteer', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
      const data = await res.json();
      if (data.success) setSubmitted(true);
      else setError(data.error || 'Submission failed. Please try again.');
    } catch { setError('Network error. Please try again.'); }
    finally { setLoading(false); }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-[#0f1a1c]">
        <Navbar />
        <div className="flex items-center justify-center min-h-[80vh] px-4">
          <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring', bounce: 0.4 }} className="glass-card p-10 rounded-3xl max-w-md w-full text-center border border-emerald-500/30">
            <motion.div animate={{ scale: [1, 1.15, 1] }} transition={{ repeat: Infinity, duration: 2 }} className="w-24 h-24 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6 border-2 border-emerald-400"><CheckCircle className="w-12 h-12 text-emerald-400" /></motion.div>
            <h2 className="text-3xl font-bold text-white mb-2">Application Received!</h2>
            <p className="text-emerald-400 font-semibold mb-4">Welcome to the Butwal Snake Rescuers family 🐍</p>
            <p className="text-gray-400 text-sm mb-8">Our team will review your application and contact you at <span className="text-white font-medium">{form.contact}</span> within 3–5 business days.</p>
            <a href="/" className="block w-full bg-emerald-500 hover:bg-emerald-400 text-black font-bold py-3 rounded-xl transition-colors">Back to Home</a>
          </motion.div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f1a1c]">
      <Navbar />
      <div className="py-20 px-4 text-center border-b border-white/5 bg-gradient-to-b from-emerald-900/15 to-transparent">
        <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
          <div className="inline-flex items-center gap-2 bg-emerald-500/20 border border-emerald-500/40 rounded-full px-4 py-1.5 mb-4"><Users className="w-4 h-4 text-emerald-400" /><span className="text-emerald-400 text-sm font-semibold">JOIN OUR TEAM</span></div>
          <h1 className="text-5xl font-bold text-white mb-4">Become a Volunteer</h1>
          <p className="text-gray-400 max-w-xl mx-auto">Help protect wildlife and save lives in Rupandehi. No prior experience required — we provide full training.</p>
        </motion.div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-12">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-12">
          {[{ value: '25+', label: 'Active Volunteers' }, { value: '500+', label: 'Rescues Completed' }, { value: '5', label: 'Coverage Zones' }, { value: '24/7', label: 'Emergency Response' }].map(({ value, label }) => (
            <div key={label} className="glass-card rounded-2xl p-5 text-center border border-white/10"><p className="text-3xl font-bold text-emerald-400 mb-1">{value}</p><p className="text-gray-400 text-xs">{label}</p></div>
          ))}
        </div>

        <h2 className="text-2xl font-bold text-white mb-6">Why Volunteer With Us?</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-12">
          {BENEFITS.map(({ icon: Icon, title, desc, color }, i) => (
            <motion.div key={title} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }} className="glass-card rounded-xl p-5 border border-white/10 flex items-start gap-4">
              <div className={`w-10 h-10 bg-${color}-500/20 rounded-xl flex items-center justify-center shrink-0`}><Icon className={`w-5 h-5 text-${color}-400`} /></div>
              <div><h3 className="text-white font-semibold mb-1">{title}</h3><p className="text-gray-400 text-sm">{desc}</p></div>
            </motion.div>
          ))}
        </div>

        <div className="glass-card rounded-3xl p-8 border border-white/10">
          <h2 className="text-2xl font-bold text-white mb-2">Volunteer Application</h2>
          <p className="text-gray-400 text-sm mb-8">Fill in your details — we'll contact you within 3–5 days.</p>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div><label className="text-sm text-gray-400 font-medium mb-2 block">Full Name *</label><input value={form.name} onChange={e => update('name', e.target.value)} placeholder="Your full name" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500 transition-colors" /></div>
              <div><label className="text-sm text-gray-400 font-medium mb-2 block">Phone / Contact *</label><input value={form.contact} onChange={e => update('contact', e.target.value)} placeholder="98XXXXXXXX" type="tel" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500 transition-colors" /></div>
              <div><label className="text-sm text-gray-400 font-medium mb-2 block">Address</label><input value={form.address} onChange={e => update('address', e.target.value)} placeholder="Your home address" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500 transition-colors" /></div>
              <div><label className="text-sm text-gray-400 font-medium mb-2 block">Municipality</label><select value={form.municipality} onChange={e => update('municipality', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500 transition-colors appearance-none">{MUNICIPALITIES.map(m => <option key={m} value={m} className="bg-[#1a2b2f]">{m}</option>)}</select></div>
              <div><label className="text-sm text-gray-400 font-medium mb-2 block">Experience Level</label><select value={form.experience} onChange={e => update('experience', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500 transition-colors appearance-none">{EXPERIENCE_LEVELS.map(l => <option key={l} value={l} className="bg-[#1a2b2f]">{l}</option>)}</select></div>
              <div><label className="text-sm text-gray-400 font-medium mb-2 block">Vehicle</label><select value={form.vehicle} onChange={e => update('vehicle', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500 transition-colors appearance-none">{VEHICLES.map(v => <option key={v} value={v} className="bg-[#1a2b2f]">{v}</option>)}</select></div>
              <div><label className="text-sm text-gray-400 font-medium mb-2 block">Available Time</label><select value={form.availableTime} onChange={e => update('availableTime', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500 transition-colors appearance-none">{AVAILABLE_TIMES.map(t => <option key={t} value={t} className="bg-[#1a2b2f]">{t}</option>)}</select></div>
              <div><label className="text-sm text-gray-400 font-medium mb-2 block">Emergency Availability</label><select value={form.emergencyAvailability} onChange={e => update('emergencyAvailability', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500 transition-colors appearance-none"><option value="Yes" className="bg-[#1a2b2f]">Yes — I'm available for emergencies</option><option value="No" className="bg-[#1a2b2f]">No — Scheduled shifts only</option></select></div>
            </div>
            <div><label className="text-sm text-gray-400 font-medium mb-2 block">Skills / Background (Optional)</label><textarea value={form.skills} onChange={e => update('skills', e.target.value)} placeholder="e.g. First aid certified, wildlife photography, veterinary student..." rows={3} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500 transition-colors resize-none" /></div>

            {error && <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="bg-red-500/20 border border-red-500/40 rounded-xl p-3 text-red-400 text-sm">{error}</motion.div>}

            <button type="submit" disabled={loading} className="w-full bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-black font-bold py-4 rounded-xl transition-colors flex items-center justify-center gap-2 text-lg">
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Heart className="w-5 h-5" />}
              {loading ? 'Submitting...' : 'Submit Application'}
            </button>
          </form>
        </div>
      </div>
      <Footer />
      <FloatingWidgets />
    </div>
  );
}

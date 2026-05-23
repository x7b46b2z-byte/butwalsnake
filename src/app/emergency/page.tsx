'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Phone, MapPin, AlertTriangle, CheckCircle, Loader2, Navigation, User, FileText, Eye, Send, MessageSquare } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import FloatingWidgets from '@/components/FloatingWidgets';

const STEPS = ['Contact Info', 'Location', 'Details', 'Submit'];
const MUNICIPALITIES = ['Butwal', 'Tilottama', 'Siddharthanagar', 'Devdaha', 'Other'];

interface FormData {
  name: string;
  phone: string;
  municipality: string;
  address: string;
  notes: string;
  lat: number | null;
  lng: number | null;
}

export default function EmergencyPage() {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<FormData>({ name: '', phone: '', municipality: 'Butwal', address: '', notes: '', lat: null, lng: null });
  const [submitted, setSubmitted] = useState(false);
  const [ticketId, setTicketId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [locating, setLocating] = useState(false);
  const [pulse, setPulse] = useState(false);

  useEffect(() => { const t = setInterval(() => setPulse(p => !p), 1200); return () => clearInterval(t); }, []);

  const update = (field: keyof FormData, value: string | number | null) => { setForm(p => ({ ...p, [field]: value })); setError(''); };

  const getLocation = () => {
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      pos => { update('lat', pos.coords.latitude); update('lng', pos.coords.longitude); setLocating(false); },
      () => { setLocating(false); setError('Could not get GPS. Enter address manually.'); },
      { timeout: 10000 }
    );
  };

  const validateStep = () => {
    if (step === 0 && (!form.name.trim() || !form.phone.trim())) { setError('Please enter your name and phone number.'); return false; }
    if (step === 1 && !form.address.trim()) { setError('Please provide your address or use GPS.'); return false; }
    return true;
  };

  const nextStep = () => { if (!validateStep()) return; setStep(s => Math.min(s + 1, STEPS.length - 1)); };
  const prevStep = () => setStep(s => Math.max(s - 1, 0));

  const handleSubmit = async () => {
    setLoading(true); setError('');
    try {
      const res = await fetch('/api/rescue', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
      const data = await res.json();
      if (data.success) { setTicketId(data.data.id.slice(0, 8).toUpperCase()); setSubmitted(true); }
      else setError(data.error || 'Submission failed. Please call us directly.');
    } catch { setError('Network error. Please call 9816482570 directly.'); }
    finally { setLoading(false); }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-[#0f1a1c]">
        <Navbar />
        <div className="flex flex-col items-center justify-center min-h-[80vh] px-4">
          <motion.div initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring', bounce: 0.4 }} className="glass-card p-10 rounded-3xl max-w-lg w-full text-center border border-emerald-500/30">
            <motion.div animate={{ scale: [1, 1.15, 1] }} transition={{ repeat: Infinity, duration: 1.8 }} className="w-24 h-24 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6 border-2 border-emerald-400">
              <CheckCircle className="w-12 h-12 text-emerald-400" />
            </motion.div>
            <h1 className="text-3xl font-bold text-white mb-2">Help Is Coming!</h1>
            <p className="text-emerald-400 text-lg font-semibold mb-6">Rescue team has been alerted</p>
            <div className="bg-black/30 rounded-2xl p-4 mb-6 border border-emerald-500/20">
              <p className="text-gray-400 text-sm mb-1">Your Ticket ID</p>
              <p className="text-3xl font-mono font-bold text-emerald-400">BSR-{ticketId}</p>
            </div>
            <div className="space-y-3 text-sm text-gray-400 mb-8">
              <div className="flex items-center gap-3 bg-white/5 rounded-xl p-3"><Phone className="w-4 h-4 text-emerald-400 shrink-0" /><span>Our team will call <span className="text-white font-medium">{form.phone}</span> within 5–10 minutes</span></div>
              <div className="flex items-center gap-3 bg-white/5 rounded-xl p-3"><MapPin className="w-4 h-4 text-emerald-400 shrink-0" /><span>Location: <span className="text-white font-medium">{form.address}, {form.municipality}</span></span></div>
            </div>
            <div className="border-t border-white/10 pt-6 space-y-2">
              <p className="text-gray-400 text-sm font-medium mb-2">While you wait — STAY SAFE:</p>
              {['🚷 Keep distance from the snake (≥ 3 meters)', '📸 Photo from safe distance — DO NOT touch', '🚪 Close doors/windows if indoors', '🏥 If bitten, go to Lumbini Provincial Hospital immediately'].map(tip => (
                <div key={tip} className="text-gray-300 bg-white/5 rounded-lg p-2 text-sm">{tip}</div>
              ))}
            </div>
            <div className="mt-6 flex gap-3">
              <a href="tel:9816482570" className="flex-1 flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-black font-bold py-3 rounded-xl transition-colors"><Phone className="w-4 h-4" /> Call Now</a>
              <a href="/" className="flex-1 flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white font-semibold py-3 rounded-xl transition-colors">Back Home</a>
            </div>
          </motion.div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f1a1c]">
      <Navbar />
      <div className="bg-red-600/90 backdrop-blur-sm sticky top-[72px] z-40 py-2 px-4 text-center border-b border-red-500">
        <p className="text-white font-semibold text-sm flex items-center justify-center gap-2">
          <motion.span animate={{ opacity: pulse ? 1 : 0.3 }} className="w-2 h-2 bg-white rounded-full inline-block" />
          Life-threatening? Call directly: <a href="tel:9816482570" className="font-bold underline mx-1">9816482570</a>
        </p>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-12">
        <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-red-500/20 border border-red-500/40 rounded-full px-4 py-1.5 mb-4">
            <motion.div animate={{ scale: pulse ? 1.3 : 1 }} className="w-2 h-2 bg-red-400 rounded-full" />
            <span className="text-red-300 text-sm font-semibold">EMERGENCY REQUEST</span>
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">Request Snake Rescue</h1>
          <p className="text-gray-400">Our team responds within 30 minutes across Rupandehi District.</p>
        </motion.div>

        {/* Step Indicators */}
        <div className="flex items-center justify-between mb-8 relative">
          <div className="absolute top-4 left-0 right-0 h-0.5 bg-white/10 z-0" />
          <div className="absolute top-4 left-0 h-0.5 bg-emerald-500 z-0 transition-all duration-500" style={{ width: `${(step / (STEPS.length - 1)) * 100}%` }} />
          {STEPS.map((s, i) => (
            <div key={s} className="flex flex-col items-center z-10 relative">
              <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-xs font-bold transition-all duration-300 ${i < step ? 'bg-emerald-500 border-emerald-500 text-black' : i === step ? 'bg-emerald-500/20 border-emerald-400 text-emerald-400' : 'bg-[#0f1a1c] border-white/20 text-white/40'}`}>
                {i < step ? '✓' : i + 1}
              </div>
              <span className={`text-xs mt-1 font-medium ${i === step ? 'text-emerald-400' : 'text-gray-500'}`}>{s}</span>
            </div>
          ))}
        </div>

        <div className="glass-card rounded-3xl p-8 border border-white/10">
          <AnimatePresence mode="wait">
            {step === 0 && (
              <motion.div key="s0" initial={{ x: 30, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -30, opacity: 0 }} className="space-y-5">
                <div className="flex items-center gap-3 mb-6"><div className="w-10 h-10 bg-emerald-500/20 rounded-xl flex items-center justify-center"><User className="w-5 h-5 text-emerald-400" /></div><div><h2 className="text-white font-bold text-xl">Your Contact Details</h2><p className="text-gray-400 text-sm">So our team can reach you</p></div></div>
                <div><label className="text-sm text-gray-400 font-medium mb-2 block">Full Name *</label><input value={form.name} onChange={e => update('name', e.target.value)} placeholder="Your full name" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500 transition-colors" /></div>
                <div><label className="text-sm text-gray-400 font-medium mb-2 block">Phone Number *</label><div className="relative"><Phone className="absolute left-4 top-3.5 w-4 h-4 text-gray-500" /><input type="tel" value={form.phone} onChange={e => update('phone', e.target.value)} placeholder="98XXXXXXXX" className="w-full bg-white/5 border border-white/10 rounded-xl pl-11 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500 transition-colors" /></div></div>
              </motion.div>
            )}
            {step === 1 && (
              <motion.div key="s1" initial={{ x: 30, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -30, opacity: 0 }} className="space-y-5">
                <div className="flex items-center gap-3 mb-6"><div className="w-10 h-10 bg-emerald-500/20 rounded-xl flex items-center justify-center"><MapPin className="w-5 h-5 text-emerald-400" /></div><div><h2 className="text-white font-bold text-xl">Your Location</h2><p className="text-gray-400 text-sm">Where is the snake sighting?</p></div></div>
                <div><label className="text-sm text-gray-400 font-medium mb-2 block">Municipality</label>
                  <div className="grid grid-cols-3 gap-2">{MUNICIPALITIES.map(m => (<button key={m} type="button" onClick={() => update('municipality', m)} className={`py-2 px-3 rounded-xl border text-sm font-medium transition-all ${form.municipality === m ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-400' : 'bg-white/5 border-white/10 text-gray-400 hover:text-white'}`}>{m}</button>))}</div>
                </div>
                <button onClick={getLocation} disabled={locating} className="w-full flex items-center justify-center gap-3 bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-emerald-400 font-semibold py-3.5 rounded-xl transition-all disabled:opacity-50">
                  {locating ? <Loader2 className="w-5 h-5 animate-spin" /> : <Navigation className="w-5 h-5" />}
                  {locating ? 'Getting GPS location…' : 'Use My Current GPS Location'}
                </button>
                {form.lat && <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-3 text-sm text-emerald-400 text-center">✓ GPS: {form.lat.toFixed(5)}, {form.lng?.toFixed(5)}</div>}
                <div><label className="text-sm text-gray-400 font-medium mb-2 block">Address / Landmark *</label><textarea value={form.address} onChange={e => update('address', e.target.value)} placeholder="e.g. Near Buddha Chowk, opposite petrol pump, house no. 45..." rows={3} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500 transition-colors resize-none" /></div>
              </motion.div>
            )}
            {step === 2 && (
              <motion.div key="s2" initial={{ x: 30, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -30, opacity: 0 }} className="space-y-5">
                <div className="flex items-center gap-3 mb-6"><div className="w-10 h-10 bg-emerald-500/20 rounded-xl flex items-center justify-center"><Eye className="w-5 h-5 text-emerald-400" /></div><div><h2 className="text-white font-bold text-xl">Additional Details</h2><p className="text-gray-400 text-sm">Optional but helpful for our team</p></div></div>
                <div><label className="text-sm text-gray-400 font-medium mb-2 block">Any notes (snake description, is anyone bitten, etc.)</label><textarea value={form.notes} onChange={e => update('notes', e.target.value)} placeholder="e.g. Black snake about 1 meter, coiled near drain. No one bitten." rows={4} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500 transition-colors resize-none" /></div>
                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4"><div className="flex items-start gap-3"><AlertTriangle className="w-5 h-5 text-yellow-400 shrink-0 mt-0.5" /><div className="text-sm text-yellow-300"><p className="font-semibold mb-1">If someone is bitten:</p><p className="text-yellow-300/80">Go to Lumbini Provincial Hospital immediately. Do NOT suck the venom or apply tourniquet.</p></div></div></div>
              </motion.div>
            )}
            {step === 3 && (
              <motion.div key="s3" initial={{ x: 30, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -30, opacity: 0 }} className="space-y-5">
                <div className="flex items-center gap-3 mb-6"><div className="w-10 h-10 bg-emerald-500/20 rounded-xl flex items-center justify-center"><FileText className="w-5 h-5 text-emerald-400" /></div><div><h2 className="text-white font-bold text-xl">Review & Submit</h2><p className="text-gray-400 text-sm">Confirm details before submitting</p></div></div>
                <div className="space-y-3">
                  {[{ label: 'Name', value: form.name }, { label: 'Phone', value: form.phone }, { label: 'Municipality', value: form.municipality }, { label: 'Address', value: form.address }, { label: 'Notes', value: form.notes || '(Not provided)' }].map(({ label, value }) => (
                    <div key={label} className="bg-white/5 rounded-xl p-3"><p className="text-gray-400 text-xs">{label}</p><p className="text-white text-sm font-medium">{value}</p></div>
                  ))}
                </div>
                {form.lat && <div className="flex items-center gap-2 text-sm text-emerald-400 bg-emerald-500/10 rounded-xl p-3 border border-emerald-500/20"><Navigation className="w-4 h-4" /> GPS: {form.lat.toFixed(5)}, {form.lng?.toFixed(5)}</div>}
              </motion.div>
            )}
          </AnimatePresence>

          {error && <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mt-4 flex items-center gap-2 bg-red-500/20 border border-red-500/40 rounded-xl p-3 text-red-400 text-sm"><AlertTriangle className="w-4 h-4 shrink-0" />{error}</motion.div>}

          <div className="flex gap-3 mt-8">
            {step > 0 && <button onClick={prevStep} className="flex-1 py-3 rounded-xl border border-white/20 text-white/70 hover:text-white hover:border-white/40 transition-colors font-semibold">Back</button>}
            {step < STEPS.length - 1
              ? <button onClick={nextStep} className="flex-1 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold transition-colors">Continue →</button>
              : <button onClick={handleSubmit} disabled={loading} className="flex-1 py-3 rounded-xl bg-red-500 hover:bg-red-400 disabled:opacity-50 text-white font-bold transition-colors flex items-center justify-center gap-2">{loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}{loading ? 'Submitting…' : 'Submit Emergency Request'}</button>}
          </div>
        </div>

        <div className="mt-6 text-center">
          <p className="text-gray-500 text-sm mb-3">Having trouble? Call us directly:</p>
          <div className="flex gap-3 justify-center">
            <a href="tel:9816482570" className="flex items-center gap-2 bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 px-5 py-2.5 rounded-xl font-semibold text-sm hover:bg-emerald-500/30 transition-colors"><Phone className="w-4 h-4" /> 9816482570</a>
            <a href="https://wa.me/9779816482570" className="flex items-center gap-2 bg-green-500/20 border border-green-500/30 text-green-400 px-5 py-2.5 rounded-xl font-semibold text-sm hover:bg-green-500/30 transition-colors"><MessageSquare className="w-4 h-4" /> WhatsApp</a>
          </div>
        </div>
      </div>
      <Footer />
      <FloatingWidgets />
    </div>
  );
}

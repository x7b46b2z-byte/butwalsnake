'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Phone, Mail, MapPin, MessageSquare, Send, Loader2, CheckCircle, Clock } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const CONTACT_METHODS = [
  { icon: Phone, label: 'Emergency Hotline', value: '9856034050', sub: 'Available 24/7', href: 'tel:9856034050', color: 'red' },
  { icon: MessageSquare, label: 'WhatsApp', value: '9856034050', sub: 'Quick response via chat', href: 'https://wa.me/9779856034050', color: 'green' },
  { icon: Mail, label: 'Email', value: 'info@butwalsnakerescue.org', sub: 'Non-urgent queries', href: 'mailto:info@butwalsnakerescue.org', color: 'blue' },
  { icon: MapPin, label: 'Location', value: 'Butwal-11, Rupandehi', sub: 'Lumbini Province, Nepal', href: 'https://maps.google.com/?q=Butwal,Nepal', color: 'emerald' },
];

import { useApp } from '@/context/AppContext';

export default function ContactPage() {
  const { t } = useApp();
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const update = (k: string, v: string) => { setForm(p => ({ ...p, [k]: v })); setError(''); };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.message) { setError('Please enter your name and message.'); return; }
    setLoading(true);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.success) {
        setSubmitted(true);
      } else {
        setError(data.error || 'Failed to send message.');
      }
    } catch (err) {
      setError('An error occurred. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f1a1c]">
      <Navbar />

      {/* Hero */}
      <div className="py-20 px-4 text-center border-b border-white/5 bg-gradient-to-b from-blue-900/10 to-transparent">
        <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
          <div className="inline-flex items-center gap-2 bg-blue-500/20 border border-blue-500/40 rounded-full px-4 py-1.5 mb-4">
            <MessageSquare className="w-4 h-4 text-blue-400" />
            <span className="text-blue-400 text-sm font-semibold">{t('getInTouch')}</span>
          </div>
          <h1 className="text-5xl font-bold text-white mb-4">{t('contactTitle')}</h1>
          <p className="text-gray-400 max-w-lg mx-auto">{t('contactSub')}</p>
        </motion.div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-12">
        {/* Contact Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          {CONTACT_METHODS.map(({ icon: Icon, label, value, sub, href, color }, i) => (
            <motion.a key={label} href={href} target={href.startsWith('http') ? '_blank' : undefined} rel="noreferrer"
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
              className={`glass-card rounded-2xl p-5 border border-white/10 hover:border-${color}-500/40 transition-all group text-left`}>
              <div className={`w-10 h-10 bg-${color}-500/20 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                <Icon className={`w-5 h-5 text-${color}-400`} />
              </div>
              <p className="text-gray-400 text-xs font-medium mb-1">{label}</p>
              <p className="text-white font-semibold text-sm break-all">{value}</p>
              <p className="text-gray-500 text-xs mt-1">{sub}</p>
            </motion.a>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Form */}
          <div className="lg:col-span-3">
            <h2 className="text-2xl font-bold text-white mb-6">{t('sendMessage')}</h2>

            {submitted ? (
              <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="glass-card rounded-2xl p-10 border border-emerald-500/30 text-center">
                <CheckCircle className="w-16 h-16 text-emerald-400 mx-auto mb-4" />
                <h3 className="text-white font-bold text-xl mb-2">{t('messageSent')}</h3>
                <p className="text-gray-400 text-sm">We'll get back to you within 24 hours. For urgent matters, please call us directly.</p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="glass-card rounded-2xl p-7 border border-white/10 space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="text-sm text-gray-400 font-medium mb-2 block">{t('yourName')}</label>
                    <input value={form.name} onChange={e => update('name', e.target.value)} placeholder="Full name" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500 transition-colors" />
                  </div>
                  <div>
                    <label className="text-sm text-gray-400 font-medium mb-2 block">{t('phone')}</label>
                    <input value={form.phone} onChange={e => update('phone', e.target.value)} placeholder="98XXXXXXXX" type="tel" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500 transition-colors" />
                  </div>
                </div>
                <div>
                  <label className="text-sm text-gray-400 font-medium mb-2 block">{t('email')}</label>
                  <input value={form.email} onChange={e => update('email', e.target.value)} placeholder="you@example.com" type="email" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500 transition-colors" />
                </div>
                <div>
                  <label className="text-sm text-gray-400 font-medium mb-2 block">{t('subject')}</label>
                  <input value={form.subject} onChange={e => update('subject', e.target.value)} placeholder="What's this about?" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500 transition-colors" />
                </div>
                <div>
                  <label className="text-sm text-gray-400 font-medium mb-2 block">{t('message')}</label>
                  <textarea value={form.message} onChange={e => update('message', e.target.value)} placeholder="How can we help you?" rows={4} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500 transition-colors resize-none" />
                </div>
                {error && <div className="bg-red-500/20 border border-red-500/40 rounded-xl p-3 text-red-400 text-sm">{error}</div>}
                <button type="submit" disabled={loading} className="w-full bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-black font-bold py-3.5 rounded-xl transition-colors flex items-center justify-center gap-2">
                  {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                  {loading ? t('sending') : t('sendBtn')}
                </button>
              </form>
            )}
          </div>

          {/* Side info */}
          <div className="lg:col-span-2 space-y-6">
            <h2 className="text-2xl font-bold text-white">Response Times</h2>
            <div className="space-y-4">
              {[
                { type: 'Emergency Rescue Call', time: 'Immediate', color: 'red', note: 'Active rescuers dispatched within 30 minutes' },
                { type: 'WhatsApp Message', time: '< 1 hour', color: 'green', note: 'During active hours (6 AM – 10 PM)' },
                { type: 'Email / Contact Form', time: '24–48 hours', color: 'blue', note: 'For non-urgent queries and partnerships' },
                { type: 'Volunteer Applications', time: '3–5 days', color: 'yellow', note: 'After reviewing your application' },
              ].map(({ type, time, color, note }) => (
                <div key={type} className={`glass-card rounded-xl p-4 border border-${color}-500/20`}>
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-white font-medium text-sm">{type}</p>
                    <span className={`text-xs font-bold text-${color}-400 bg-${color}-500/20 px-2.5 py-1 rounded-full border border-${color}-500/30`}>{time}</span>
                  </div>
                  <p className="text-gray-500 text-xs">{note}</p>
                </div>
              ))}
            </div>

            <div className="glass-card rounded-xl p-5 border border-white/10">
              <div className="flex items-center gap-2 mb-3">
                <Clock className="w-4 h-4 text-emerald-400" />
                <p className="text-white font-semibold text-sm">Office Hours</p>
              </div>
              <p className="text-gray-400 text-sm">Emergency rescue: <span className="text-white font-semibold">24/7 always on</span></p>
              <p className="text-gray-400 text-sm mt-1">Admin office: <span className="text-white font-semibold">Sun–Fri, 9AM–5PM</span></p>
              <p className="text-gray-400 text-sm mt-1">Location: <span className="text-white font-semibold">Butwal-11, Rupandehi</span></p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, Phone, MapPin, Clock, ChevronDown, Shield, Activity, X } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import FloatingWidgets from '@/components/FloatingWidgets';

const HOSPITALS = [
  { name: 'Lumbini Provincial Hospital', area: 'Butwal', phone: '071-540000', distance: '2.5 km', emergency: true },
  { name: 'Universal College of Medical Sciences', area: 'Bhairahawa', phone: '071-526416', distance: '14 km', emergency: true },
  { name: 'Butwal Referral Hospital', area: 'Butwal', phone: '071-540500', distance: '3 km', emergency: true },
  { name: 'Siddhartha Hospital', area: 'Siddharthanagar', phone: '071-520200', distance: '13 km', emergency: false },
  { name: 'Devdaha Medical College', area: 'Devdaha', phone: '071-570100', distance: '16 km', emergency: false },
];

const FIRST_AID_STEPS = [
  {
    id: 'immediate',
    emoji: '1️⃣',
    title: 'Immediate Actions',
    color: 'red',
    steps: [
      'Move the person away from the snake — minimum 3 meters',
      'Keep the victim CALM and STILL — movement spreads venom faster',
      'Immobilize the bitten limb at or below heart level',
      'Remove tight clothing, jewellery near the bite site',
      'Note the time of bite and call for help immediately',
    ],
  },
  {
    id: 'dos',
    emoji: '✅',
    title: 'DO These Things',
    color: 'emerald',
    steps: [
      'Call emergency: 9856034050 or 102',
      'Go to nearest hospital with anti-venom (list below)',
      'Keep victim lying down, still and warm',
      'If possible, photograph the snake from safe distance',
      'Mark the bite site with pen & note swelling spread time',
      'Reassure victim — anxiety worsens venom absorption',
    ],
  },
  {
    id: 'donts',
    emoji: '🚫',
    title: "DO NOT Do These",
    color: 'orange',
    steps: [
      'DO NOT cut and suck the wound — it does NOT work and causes infection',
      'DO NOT apply tourniquet or restrict blood flow',
      'DO NOT apply ice or cold water to the bite',
      'DO NOT give aspirin, ibuprofen, or alcohol',
      'DO NOT try to catch or kill the snake',
      'DO NOT use electric shock treatment',
      'DO NOT apply herbs, mud, or traditional remedies',
    ],
  },
  {
    id: 'symptoms',
    emoji: '⚠️',
    title: 'Danger Symptoms to Watch',
    color: 'yellow',
    steps: [
      'Difficulty breathing or swallowing',
      'Drooping eyelids, blurred vision',
      'Rapid swelling beyond the bite area',
      'Severe pain, blistering, or tissue turning dark',
      'Dizziness, fainting, or loss of consciousness',
      'Abnormal bleeding from wounds or gums',
    ],
  },
];

const COLOR_MAP: Record<string, { border: string; bg: string; text: string; badge: string }> = {
  red: { border: 'border-red-500/40', bg: 'bg-red-500/10', text: 'text-red-300', badge: 'bg-red-500/20 text-red-400 border-red-500/40' },
  emerald: { border: 'border-emerald-500/40', bg: 'bg-emerald-500/10', text: 'text-emerald-300', badge: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40' },
  orange: { border: 'border-orange-500/40', bg: 'bg-orange-500/10', text: 'text-orange-300', badge: 'bg-orange-500/20 text-orange-400 border-orange-500/40' },
  yellow: { border: 'border-yellow-500/40', bg: 'bg-yellow-500/10', text: 'text-yellow-300', badge: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/40' },
};

export default function FirstAidPage() {
  const [open, setOpen] = useState<string>('immediate');
  const [emergency, setEmergency] = useState(false);

  return (
    <div className={`min-h-screen transition-colors duration-300 ${emergency ? 'bg-red-950' : 'bg-[#0f1a1c]'}`}>
      <Navbar />

      {/* Emergency Mode Banner */}
      <AnimatePresence>
        {emergency && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="sticky top-[72px] z-50 bg-red-600 py-3 px-4 flex items-center justify-between border-b-2 border-red-400"
          >
            <div className="flex items-center gap-3">
              <motion.div animate={{ scale: [1, 1.3, 1] }} transition={{ repeat: Infinity, duration: 0.8 }}>
                <AlertTriangle className="w-6 h-6 text-white" />
              </motion.div>
              <span className="text-white font-bold text-lg">🚨 EMERGENCY MODE — Call 9856034050 NOW</span>
            </div>
            <button onClick={() => setEmergency(false)} className="text-white/70 hover:text-white">
              <X className="w-5 h-5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero */}
      <div className={`py-16 px-4 text-center border-b border-white/5 relative overflow-hidden ${emergency ? 'bg-red-900/40' : 'bg-gradient-to-b from-red-900/20 to-transparent'}`}>
        <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
          <div className="inline-flex items-center gap-2 bg-red-500/20 border border-red-500/40 rounded-full px-4 py-1.5 mb-4">
            <Activity className="w-4 h-4 text-red-400" />
            <span className="text-red-400 text-sm font-semibold">FIRST AID GUIDE</span>
          </div>
          <h1 className="text-5xl font-bold text-white mb-4">Snake Bite First Aid</h1>
          <p className="text-gray-400 max-w-xl mx-auto mb-8">
            Every second counts. Know what to do — and what NOT to do — when someone is bitten.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => setEmergency(true)}
              className="flex items-center justify-center gap-2 bg-red-500 hover:bg-red-400 text-white font-bold px-8 py-4 rounded-xl transition-all text-lg shadow-lg shadow-red-500/30"
            >
              <AlertTriangle className="w-5 h-5" /> ACTIVATE EMERGENCY MODE
            </button>
            <a
              href="tel:9856034050"
              className="flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white font-bold px-8 py-4 rounded-xl transition-all text-lg border border-white/20"
            >
              <Phone className="w-5 h-5" /> Call Rescue Team
            </a>
          </div>
        </motion.div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Quick Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-12">
          {[
            { label: 'Response Time', value: '< 30 min', icon: Clock, color: 'emerald' },
            { label: 'Emergency Line', value: '9856034050', icon: Phone, color: 'red' },
            { label: 'Hospitals Nearby', value: '5+', icon: MapPin, color: 'blue' },
            { label: 'Anti-venom Available', value: 'Yes', icon: Shield, color: 'yellow' },
          ].map(({ label, value, icon: Icon, color }) => (
            <div key={label} className="glass-card rounded-2xl p-4 text-center border border-white/10">
              <Icon className={`w-6 h-6 text-${color}-400 mx-auto mb-2`} />
              <p className="text-white font-bold text-lg">{value}</p>
              <p className="text-gray-500 text-xs">{label}</p>
            </div>
          ))}
        </div>

        {/* First Aid Steps Accordion */}
        <h2 className="text-2xl font-bold text-white mb-6">Step-by-Step Guide</h2>
        <div className="space-y-4 mb-12">
          {FIRST_AID_STEPS.map((section) => {
            const colors = COLOR_MAP[section.color];
            const isOpen = open === section.id;
            return (
              <motion.div
                key={section.id}
                layout
                className={`glass-card rounded-2xl border overflow-hidden transition-colors ${isOpen ? colors.border : 'border-white/10'}`}
              >
                <button
                  className="w-full flex items-center gap-4 p-5 text-left"
                  onClick={() => setOpen(isOpen ? '' : section.id)}
                >
                  <span className="text-2xl">{section.emoji}</span>
                  <div className="flex-1">
                    <h3 className="text-white font-bold text-lg">{section.title}</h3>
                    <p className="text-gray-500 text-sm">{section.steps.length} important points</p>
                  </div>
                  <motion.div animate={{ rotate: isOpen ? 180 : 0 }} className="text-gray-400">
                    <ChevronDown className="w-5 h-5" />
                  </motion.div>
                </button>

                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className={`px-5 pb-5 ${colors.bg} rounded-b-2xl`}>
                        <div className="space-y-3 pt-2">
                          {section.steps.map((step, i) => (
                            <motion.div
                              key={i}
                              initial={{ x: -20, opacity: 0 }}
                              animate={{ x: 0, opacity: 1 }}
                              transition={{ delay: i * 0.05 }}
                              className={`flex items-start gap-3 p-3 rounded-xl bg-black/20 border ${colors.border}`}
                            >
                              <span className={`w-5 h-5 rounded-full border ${colors.badge} flex items-center justify-center text-xs font-bold shrink-0`}>
                                {i + 1}
                              </span>
                              <p className={`text-sm ${colors.text} leading-relaxed`}>{step}</p>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>

        {/* Hospitals */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
            <MapPin className="w-6 h-6 text-emerald-400" /> Nearby Hospitals with Anti-venom
          </h2>
          <div className="space-y-3">
            {HOSPITALS.map((h, i) => (
              <motion.div
                key={h.name}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.08 }}
                className={`glass-card rounded-xl p-4 border flex items-center gap-4 ${h.emergency ? 'border-red-500/30' : 'border-white/10'}`}
              >
                <div className="w-10 h-10 bg-red-500/20 rounded-xl flex items-center justify-center shrink-0">
                  <Activity className="w-5 h-5 text-red-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-white font-semibold text-sm">{h.name}</h3>
                    {h.emergency && (
                      <span className="text-xs bg-red-500/20 border border-red-500/40 text-red-400 px-2 py-0.5 rounded-full">24/7 Emergency</span>
                    )}
                  </div>
                  <p className="text-gray-500 text-xs">{h.area} · {h.distance}</p>
                </div>
                <a href={`tel:${h.phone}`} className="text-emerald-400 font-semibold text-sm flex items-center gap-1 shrink-0 hover:text-emerald-300 transition-colors">
                  <Phone className="w-4 h-4" />
                  <span className="hidden sm:block">{h.phone}</span>
                </a>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Snake Identification CTA */}
        <div className="glass-card rounded-2xl p-6 border border-emerald-500/30 text-center">
          <p className="text-3xl mb-3">🐍</p>
          <h3 className="text-white font-bold text-xl mb-2">Not Sure What Snake It Was?</h3>
          <p className="text-gray-400 text-sm mb-4">Browse our local snake directory to help identify the species.</p>
          <a
            href="/snakes"
            className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-black font-bold px-6 py-3 rounded-xl transition-colors"
          >
            View Snake Directory
          </a>
        </div>
      </div>

      <Footer />
      <FloatingWidgets />
    </div>
  );
}

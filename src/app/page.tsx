'use client';

import React from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { useApp } from '@/context/AppContext';
import { Phone, ShieldCheck, HeartHandshake, Eye, BookOpen, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { FloatingWidgets } from '@/components/FloatingWidgets';

const CoverageMap = dynamic(() => import('@/components/CoverageMap'), {
  ssr: false,
  loading: () => (
    <div className="h-[400px] lg:h-[500px] w-full bg-slate-dark/50 border border-white/5 rounded-2xl flex flex-col items-center justify-center gap-3 text-gray-400 font-manrope">
      <div className="animate-spin w-8 h-8 rounded-full border-2 border-primary border-t-transparent"></div>
      <p className="text-sm">Loading Interactive Rupandehi Map...</p>
    </div>
  ),
});

export default function Home() {
  const { t } = useApp();

  const [activeRescuers, setActiveRescuers] = React.useState<any[]>([]);

  React.useEffect(() => {
    fetch('/api/volunteer?status=APPROVED')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          // Map to match the existing UI or just use the data
          const mapped = data.data.slice(0, 3).map((v: any) => ({
            name: v.name,
            status: v.isAvailableNow ? 'available' : 'busy',
            zone: v.assignedZone || v.municipality,
            experience: v.experience,
            imageUrl: v.imageUrl,
          }));
          setActiveRescuers(mapped);
        }
      })
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="flex flex-col w-full bg-background overflow-x-hidden font-manrope">
      <Navbar />

      {/* 1. HERO SECTION */}
      <section className="relative min-h-[90vh] flex items-center justify-center py-20 px-4 border-b border-white/5 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-slate-dark to-slate-dark overflow-hidden">
        {/* Background Image Overlay */}
        <div 
          className="absolute inset-0 z-0 opacity-[0.07] bg-cover bg-center bg-no-repeat mix-blend-luminosity"
          style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1534067783941-51c9c23ecefd?q=80&w=2000")' }}
        />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] z-0"></div>

        <div className="relative max-w-5xl mx-auto text-center z-10 space-y-8 px-2">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center space-x-2 bg-primary/10 border border-primary/20 px-4 py-1.5 rounded-full"
          >
            <span className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse"></span>
            <span className="text-xs text-primary font-bold uppercase tracking-wider font-manrope">
              {t('avail24h')}
            </span>
          </motion.div>

          <div className="space-y-4">
            <motion.h1
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="text-4xl sm:text-6xl font-extrabold font-poppins text-white leading-tight tracking-tight max-w-4xl mx-auto"
            >
              {t('heroTitle')}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-lg sm:text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed"
            >
              {t('heroSub')}
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
          >
            <Link href="/emergency" className="w-full sm:w-auto flex items-center justify-center space-x-2 px-8 py-4 bg-red-600 hover:bg-red-700 text-white rounded-2xl text-base font-bold shadow-2xl transition-all border border-red-500 glow-red">
              <AlertCircle className="h-5 w-5 animate-pulse" />
              <span>{t('ctaEmergency')}</span>
            </Link>
            <a href={`tel:${t('tel1')}`} className="w-full sm:w-auto flex items-center justify-center space-x-2 px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl text-base font-bold text-white transition-all cursor-pointer">
              <Phone className="h-5 w-5 text-primary" />
              <span>{t('ctaCall')}: {t('tel1')}</span>
            </a>
            <Link href="/volunteer" className="w-full sm:w-auto flex items-center justify-center space-x-2 px-6 py-4 bg-primary/10 hover:bg-primary/20 border border-primary/20 text-primary rounded-2xl text-base font-bold transition-all">
              <HeartHandshake className="h-5 w-5" />
              <span>{t('ctaVolunteer')}</span>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* 2. STATS SECTION */}
      <section className="py-12 bg-slate-dark/30 border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 text-center">
            {[
              { value: '1,240+', label: 'Snakes Rescued' },
              { value: '100%', label: 'Safe Release Rate' },
              { value: '50+', label: 'Community Seminars' },
              { value: '18 Mins', label: 'Avg Response Time' },
            ].map(({ value, label }) => (
              <div key={label} className="p-6 rounded-2xl bg-white/2 border border-white/5">
                <span className="text-3xl sm:text-4xl font-extrabold text-primary font-mono block">{value}</span>
                <span className="text-xs sm:text-sm text-gray-400 font-semibold uppercase tracking-wider block mt-1">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. LIVE RESCUER STATUS */}
      <section className="py-20 px-4 max-w-7xl mx-auto w-full border-b border-white/5">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <h2 className="text-3xl font-bold font-poppins text-white">{t('rescuerTitle')}</h2>
            <p className="text-sm text-gray-400 mt-2">Active, certified volunteers ready to respond inside Rupandehi District.</p>
          </div>
          <div className="text-gray-300 bg-white/5 border border-white/10 px-4 py-2 rounded-xl text-sm font-semibold">
            {t('responseTime')}
          </div>
        </div>
        <div className="flex overflow-x-auto gap-6 pb-6 snap-x snap-mandatory hide-scrollbar">
          {activeRescuers.map((rescuer) => (
            <div key={rescuer.name} className="min-w-[320px] md:w-1/3 shrink-0 snap-center p-6 rounded-2xl glass-card relative overflow-hidden border border-white/5 hover:border-white/10 transition-all">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center border border-white/10 overflow-hidden shrink-0 text-emerald-400 font-bold text-xl">
                    {rescuer.imageUrl ? (
                      <img src={rescuer.imageUrl} alt={rescuer.name} className="w-full h-full object-cover" />
                    ) : (
                      rescuer.name.charAt(0).toUpperCase()
                    )}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white font-poppins">{rescuer.name}</h3>
                    <span className="text-xs text-primary font-semibold uppercase tracking-wider mt-0.5 block">{rescuer.experience} Handler</span>
                  </div>
                </div>
                <div className="flex items-center space-x-1.5 shrink-0">
                  <span className={`w-2.5 h-2.5 rounded-full animate-pulse ${rescuer.status === 'available' ? 'bg-emerald-500' : 'bg-yellow-500'}`}></span>
                  <span className="text-xs font-bold text-gray-300 uppercase tracking-wide whitespace-nowrap">
                    {rescuer.status === 'available' ? t('available') : t('busy')}
                  </span>
                </div>
              </div>
              <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between text-sm text-gray-400">
                <span>Assigned Sector:</span>
                <span className="font-bold text-white">{rescuer.zone}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. COVERAGE MAP */}
      <section className="py-20 px-4 max-w-7xl mx-auto w-full border-b border-white/5">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <h2 className="text-3xl sm:text-4xl font-bold font-poppins text-white">Our Operational Coverage Area</h2>
          <p className="text-sm sm:text-base text-gray-400 leading-relaxed">
            We provide swift, professional wildlife rescue across four major municipalities in Rupandehi District.
          </p>
        </div>
        <CoverageMap />
      </section>

      {/* 5. AWARENESS SECTION */}
      <section className="py-24 px-4 bg-slate-dark/20">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h2 className="text-3xl sm:text-4xl font-bold font-poppins text-white leading-tight">
              Snake Conservation and Safety Awareness
            </h2>
            <p className="text-sm sm:text-base text-gray-300 leading-relaxed">
              Snakes play an essential role in keeping crop pests and agricultural rodent populations controlled in Rupandehi. Learn to identify local venomous species and read snakebite first aid guides.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <Link href="/snakes" className="flex items-center justify-center space-x-2 px-6 py-4 bg-primary hover:bg-primary-hover text-slate-dark rounded-xl text-sm font-bold shadow-lg transition-all">
                <BookOpen className="h-4 w-4" />
                <span>Snake Identification Directory</span>
              </Link>
              <Link href="/firstaid" className="flex items-center justify-center space-x-2 px-6 py-4 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-xl text-sm font-bold transition-all">
                <ShieldCheck className="h-4 w-4 text-primary" />
                <span>First Aid & Hospital List</span>
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {[
              { name: 'Indian Cobra', desc: 'Highly venomous. Recognized by spectacled hood marking. Sleep under bed net.' },
              { name: 'Common Krait', desc: 'Deadly venomous. Active strictly at night. Bite is often painless initially.' },
              { name: 'Oriental Rat Snake', desc: 'Non-venomous. Extremely fast-moving. Highly useful rodent predator.' },
              { name: 'Checkered Keelback', desc: 'Non-venomous. Very common in fish fields and rivers. Striking posture.' },
            ].map(({ name, desc }) => (
              <div key={name} className="p-6 rounded-2xl glass-card space-y-3">
                <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                  <ShieldCheck className="h-6 w-6 text-primary" />
                </div>
                <h4 className="font-bold text-white text-base font-poppins">{name}</h4>
                <p className="text-xs text-gray-400">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
      <FloatingWidgets />
    </div>
  );
}

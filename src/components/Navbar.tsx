'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import { Menu, X, Phone } from 'lucide-react';

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const { lang, toggleLang } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const navLinks = [
    { href: '/', label: lang === 'en' ? 'Home' : 'गृह' },
    { href: '/emergency', label: lang === 'en' ? 'Emergency' : 'आपत' },
    { href: '/snakes', label: lang === 'en' ? 'Snakes' : 'सर्प' },
    { href: '/ai-identifier', label: lang === 'en' ? '🤖 AI ID' : 'AI पहिचान' },
    { href: '/firstaid', label: lang === 'en' ? 'First Aid' : 'प्राथमिक' },
    { href: '/gallery', label: lang === 'en' ? 'Gallery' : 'तस्बिर' },
    { href: '/blog', label: lang === 'en' ? 'Stories' : 'समाचार' },
    { href: '/volunteer', label: lang === 'en' ? 'Volunteer' : 'स्वयं' },
    { href: '/donate', label: lang === 'en' ? 'Donate' : 'सहयोग' },
    { href: '/contact', label: lang === 'en' ? 'Contact' : 'सम्पर्क' },
  ];

  const isActive = (path: string) => {
    if (path === '/' && pathname !== '/') return false;
    return pathname.startsWith(path);
  };

  return (
    <nav className={`sticky top-0 z-50 w-full transition-all duration-300 border-b ${scrolled ? 'bg-[#0a1215]/95 backdrop-blur-xl border-white/10 shadow-xl' : 'bg-[#0a1215]/80 backdrop-blur-md border-white/5'}`}>
      <div className="max-w-7xl mx-auto px-3 sm:px-6">
        <div className="flex items-center justify-between h-16">

          {/* Brand */}
          <Link href="/" className="flex items-center gap-2.5 group flex-shrink-0">
            <img 
              src="/logo.png" 
              alt="Butwal Snake Rescuers Logo" 
              className="w-10 h-10 object-contain rounded-xl shadow-lg border border-emerald-500/20 group-hover:border-emerald-500/50 transition-all" 
            />
            <div className="hidden sm:block">
              <span className="text-base font-bold text-white tracking-tight block leading-tight">Butwal Snake Rescuers</span>
              <span className="text-[10px] text-emerald-400 font-semibold uppercase tracking-widest block">24/7 Wildlife Rescue</span>
            </div>
            <div className="sm:hidden">
              <span className="text-sm font-bold text-white">BSR</span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden xl:flex items-center gap-0.5">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                  isActive(link.href)
                    ? 'text-emerald-400 bg-emerald-500/10 border border-emerald-500/20'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right side actions */}
          <div className="hidden xl:flex items-center gap-2">
            {/* Language toggle - short & clean */}
            <button
              onClick={toggleLang}
              className="px-3 py-1.5 rounded-lg text-sm font-bold border border-white/10 text-gray-300 hover:text-white hover:bg-white/5 transition-all min-w-[36px] text-center"
            >
              {lang === 'en' ? 'ने' : 'EN'}
            </button>

            {/* Emergency CTA */}
            <Link
              href="/emergency"
              className="flex items-center gap-1.5 px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-xl text-sm font-bold tracking-wide transition-all border border-red-500 shadow-lg shadow-red-500/20"
            >
              <Phone className="h-3.5 w-3.5" />
              <span>Emergency</span>
            </Link>
          </div>

          {/* Mobile controls */}
          <div className="xl:hidden flex items-center gap-2">
            <button
              onClick={toggleLang}
              className="px-2.5 py-1.5 rounded-lg text-xs font-bold border border-white/10 text-gray-300 hover:text-white bg-white/5"
            >
              {lang === 'en' ? 'ने' : 'EN'}
            </button>
            <Link href="/emergency" className="flex items-center gap-1 px-3 py-1.5 bg-red-600 text-white rounded-lg text-xs font-bold border border-red-500">
              <Phone className="h-3 w-3" />
              SOS
            </Link>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg text-gray-300 hover:text-white bg-white/5 border border-white/10"
            >
              {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="xl:hidden fixed top-16 left-0 w-full h-[calc(100vh-4rem)] overflow-y-auto bg-[#080f11]/98 backdrop-blur-2xl border-t border-white/5 z-40">
          <div className="px-4 py-6 space-y-1 pb-24">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className={`flex items-center justify-between px-4 py-3.5 rounded-xl text-base font-semibold transition-all ${
                  isActive(link.href)
                    ? 'text-emerald-400 bg-emerald-500/10 border border-emerald-500/20'
                    : 'text-gray-300 hover:text-white hover:bg-white/5 border border-transparent'
                }`}
              >
                <span>{link.label}</span>
                {isActive(link.href) && <span className="w-2 h-2 rounded-full bg-emerald-400" />}
              </Link>
            ))}

            <div className="pt-4 px-1 space-y-3 border-t border-white/5 mt-4">
              <Link
                href="/emergency"
                onClick={() => setIsOpen(false)}
                className="flex items-center justify-center gap-2 w-full py-4 bg-red-600 hover:bg-red-500 text-white rounded-2xl text-base font-bold border border-red-500 shadow-lg shadow-red-500/20 active:scale-95 transition-all"
              >
                <Phone className="h-5 w-5" />
                Emergency Rescue — Call Now
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;

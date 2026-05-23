'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import { Menu, X, ShieldAlert, Phone, Globe } from 'lucide-react';

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const { lang, toggleLang, t } = useApp();
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { href: '/', labelKey: 'home' },
    { href: '/emergency', labelKey: 'emergency' },
    { href: '/snakes', labelKey: 'snakes' },
    { href: '/firstaid', labelKey: 'firstAid' },
    { href: '/blog', labelKey: 'blogs' },
    { href: '/volunteer', labelKey: 'volunteer' },
    { href: '/donate', labelKey: 'donate' },
    { href: '/contact', labelKey: 'contact' },
  ];

  const isActive = (path: string) => {
    if (path === '/' && pathname !== '/') return false;
    return pathname.startsWith(path);
  };

  return (
    <nav className="sticky top-0 z-50 w-full glass border-b border-white/5 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Brand Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="flex items-center space-x-3 group">
              <div className="p-2 bg-primary/10 rounded-xl border border-primary/20 group-hover:bg-primary/20 transition-all duration-300">
                <ShieldAlert className="h-7 w-7 text-primary group-hover:scale-105 transition-transform" />
              </div>
              <div>
                <span className="text-lg sm:text-xl font-bold font-poppins tracking-tight block text-white group-hover:text-primary transition-colors">
                  Butwal Snake Rescuers
                </span>
                <span className="text-xs text-primary font-manrope font-semibold uppercase tracking-wider block -mt-1">
                  {t('avail24h')}
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Nav Links */}
          <div className="hidden xl:flex items-center space-x-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3 py-2 rounded-xl text-sm font-medium font-manrope transition-all duration-200 ${
                  isActive(link.href)
                    ? 'text-primary bg-primary/5 border border-primary/10'
                    : 'text-gray-300 hover:text-white hover:bg-white/5 border border-transparent'
                }`}
              >
                {t(link.labelKey)}
              </Link>
            ))}
          </div>

          {/* Action Buttons: Language Toggle & Emergency CTA */}
          <div className="hidden xl:flex items-center space-x-4">
            {/* Language Selection */}
            <button
              onClick={toggleLang}
              className="flex items-center space-x-2 px-3 py-2 rounded-xl text-sm font-medium text-gray-300 hover:text-white hover:bg-white/5 border border-white/10 cursor-pointer transition-all"
            >
              <Globe className="h-4 w-4 text-primary" />
              <span>{lang === 'en' ? 'नेपाली' : 'English'}</span>
            </button>

            {/* Quick Emergency Button */}
            <Link
              href="/emergency"
              className="flex items-center space-x-2 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-sm font-bold tracking-wide transition-all border border-red-500 shadow-lg glow-red pulse-border"
            >
              <Phone className="h-4 w-4 animate-bounce" />
              <span className="uppercase font-manrope">{t('emergencyCall')}</span>
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="xl:hidden flex items-center space-x-2">
            <button
              onClick={toggleLang}
              className="p-2.5 rounded-xl text-gray-300 hover:text-white bg-white/5 border border-white/10"
              title="Toggle Language"
            >
              <Globe className="h-5 w-5 text-primary" />
            </button>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2.5 rounded-xl text-gray-300 hover:text-white bg-white/5 border border-white/10 focus:outline-none"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Panel */}
      {isOpen && (
        <div className="xl:hidden fixed top-20 left-0 w-full h-[calc(100vh-5rem)] overflow-y-auto bg-[#0a1215]/98 backdrop-blur-2xl border-t border-white/5 animate-fade-in z-40">
          <div className="px-4 py-6 space-y-2 pb-24">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className={`flex items-center px-4 py-3 rounded-xl text-base font-medium font-manrope transition-all ${
                  isActive(link.href)
                    ? 'text-primary bg-primary/5 border border-primary/10'
                    : 'text-gray-300 hover:text-white hover:bg-white/5'
                }`}
              >
                {t(link.labelKey)}
              </Link>
            ))}

            <div className="pt-4 px-4 flex flex-col space-y-3">
              {/* Mobile Emergency Button */}
              <Link
                href="/emergency"
                onClick={() => setIsOpen(false)}
                className="flex items-center justify-center space-x-2 w-full py-3.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-base font-bold shadow-lg text-center border border-red-500 shadow-red-500/10 active:scale-98 transition-transform"
              >
                <Phone className="h-5 w-5 animate-pulse" />
                <span>{t('emergencyCall')} ({t('tel1')})</span>
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;

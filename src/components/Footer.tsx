'use client';

import React from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import { ShieldAlert, Phone, Mail, MapPin, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  const { t } = useApp();

  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-dark border-t border-white/5 font-manrope">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Col 1: Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <ShieldAlert className="h-6 w-6 text-primary" />
              <span className="text-lg font-bold font-poppins text-white tracking-tight">
                Butwal Snake Rescuers
              </span>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed font-manrope">
              Protecting human lives and conserving Rupandehi biodiversity through safe, 24/7 emergency snake rescue, local community education, and snakebite first aid awareness.
            </p>
            <div className="flex space-x-4 pt-2">
              <a
                href="https://facebook.com/butwalsnakerescuers"
                target="_blank"
                rel="noreferrer"
                className="p-2 bg-white/5 hover:bg-primary/10 border border-white/10 hover:border-primary/20 rounded-lg text-gray-400 hover:text-primary transition-all duration-300 flex items-center justify-center"
                aria-label="Facebook"
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.413c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z"/>
                </svg>
              </a>
              <a
                href="https://instagram.com/butwalsnakerescuers"
                target="_blank"
                rel="noreferrer"
                className="p-2 bg-white/5 hover:bg-primary/10 border border-white/10 hover:border-primary/20 rounded-lg text-gray-400 hover:text-primary transition-all duration-300 flex items-center justify-center"
                aria-label="Instagram"
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
                </svg>
              </a>
              <a
                href="https://tiktok.com/@butwalsnakerescuers"
                target="_blank"
                rel="noreferrer"
                className="p-2 bg-white/5 hover:bg-primary/10 border border-white/10 hover:border-primary/20 rounded-lg text-gray-400 hover:text-primary transition-all duration-300 flex items-center justify-center"
                aria-label="TikTok"
              >
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.01.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.24-2.61.94-5.22 3.01-6.73 1.63-1.19 3.73-1.57 5.68-1.07v4.11c-1.12-.27-2.31-.18-3.3.38-.85.48-1.48 1.34-1.61 2.33-.14 1.05.29 2.14 1.05 2.87.77.72 1.88 1.01 2.91.81 1.25-.24 2.21-1.29 2.38-2.56.12-.9.08-1.82.08-2.73 0-6.49-.03-12.98.02-19.47Z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Col 2: Coverage Areas */}
          <div>
            <h3 className="text-white text-sm font-bold uppercase tracking-wider mb-4 border-l-2 border-primary pl-2">
              {t('coverageAreas')}
            </h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li className="flex items-center space-x-2">
                <MapPin className="h-4 w-4 text-primary" />
                <span>Butwal Municipality</span>
              </li>
              <li className="flex items-center space-x-2">
                <MapPin className="h-4 w-4 text-primary" />
                <span>Tilottama Municipality</span>
              </li>
              <li className="flex items-center space-x-2">
                <MapPin className="h-4 w-4 text-primary" />
                <span>Siddharthanagar</span>
              </li>
              <li className="flex items-center space-x-2">
                <MapPin className="h-4 w-4 text-primary" />
                <span>Devdaha Municipality</span>
              </li>
              <li className="flex items-center space-x-2">
                <MapPin className="h-4 w-4 text-primary" />
                <span>Rupandehi Surrounding Zones</span>
              </li>
            </ul>
          </div>

          {/* Col 3: Direct Navigation */}
          <div>
            <h3 className="text-white font-bold text-lg mb-4">{t('usefulInfo')}</h3>
            <ul className="space-y-3">
              <li><Link href="/emergency" className="text-gray-400 hover:text-emerald-400 transition-colors flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> {t('emergency')}</Link></li>
              <li><Link href="/snakes" className="text-gray-400 hover:text-emerald-400 transition-colors flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> {t('snakes')}</Link></li>
              <li><Link href="/firstaid" className="text-gray-400 hover:text-emerald-400 transition-colors flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> {t('firstAid')}</Link></li>
              <li><Link href="/volunteer" className="text-gray-400 hover:text-emerald-400 transition-colors flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> {t('volunteer')}</Link></li>
              <li><Link href="/donate" className="text-gray-400 hover:text-emerald-400 transition-colors flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> {t('donate')}</Link></li>
              <li><Link href="/admin" className="text-gray-400 hover:text-emerald-400 transition-colors flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> {t('admin')}</Link></li>
            </ul>
          </div>

          {/* Col 4: Hotlines & Quick Contacts */}
          <div>
            <h3 className="text-white text-sm font-bold uppercase tracking-wider mb-4 border-l-2 border-primary pl-2">
              {t('hotlineContacts')}
            </h3>
            <div className="space-y-3">
              <a
                href={`tel:${t('tel1')}`}
                className="flex items-center space-x-3 p-3 bg-red-600/10 hover:bg-red-600/20 border border-red-500/20 hover:border-red-500/40 rounded-xl transition-all group cursor-pointer"
              >
                <Phone className="h-5 w-5 text-red-500 group-hover:scale-105 transition-transform" />
                <div>
                  <span className="text-xs text-red-500 uppercase tracking-widest font-bold block leading-none mb-1">Emergency 1</span>
                  <span className="text-white text-sm font-bold font-mono">{t('tel1')}</span>
                </div>
              </a>
              
              <a
                href={`tel:${t('tel2')}`}
                className="flex items-center space-x-3 p-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-all group cursor-pointer"
              >
                <Phone className="h-5 w-5 text-primary group-hover:scale-105 transition-transform" />
                <div>
                  <span className="text-xs text-gray-400 uppercase tracking-widest font-bold block leading-none mb-1">Emergency 2</span>
                  <span className="text-white text-sm font-bold font-mono">{t('tel2')}</span>
                </div>
              </a>

              <div className="flex items-center space-x-3 text-sm text-gray-400 pt-1">
                <Mail className="h-4 w-4 text-primary" />
                <span className="text-xs break-all">hotline@butwalsnakerescue.org</span>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Banner */}
        <div className="mt-12 pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-gray-500 font-manrope">
          <p>© {currentYear} Butwal Snake Rescuers. All Rights Reserved. Rupandehi, Nepal.</p>
          <p className="flex items-center gap-1.5">
            {t('designedBy')}
          </p>
        </div>

      </div>
    </footer>
  );
};

export default Footer;

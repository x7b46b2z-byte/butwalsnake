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
                className="p-2 bg-white/5 hover:bg-primary/10 border border-white/10 hover:border-primary/20 rounded-lg text-gray-400 hover:text-primary transition-all duration-300"
                aria-label="Facebook"
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.413c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Col 2: Coverage Areas */}
          <div>
            <h3 className="text-white text-sm font-bold uppercase tracking-wider mb-4 border-l-2 border-primary pl-2">
              Coverage Areas
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
            <h3 className="text-white text-sm font-bold uppercase tracking-wider mb-4 border-l-2 border-primary pl-2">
              Useful Information
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/emergency" className="text-gray-400 hover:text-white transition-colors">
                  Request Snake Rescue
                </Link>
              </li>
              <li>
                <Link href="/firstaid" className="text-gray-400 hover:text-white transition-colors">
                  Snakebite First Aid
                </Link>
              </li>
              <li>
                <Link href="/snakes" className="text-gray-400 hover:text-white transition-colors">
                  Rupandehi Species DB
                </Link>
              </li>
              <li>
                <Link href="/volunteer" className="text-gray-400 hover:text-white transition-colors">
                  Join as Volunteer
                </Link>
              </li>
              <li>
                <Link href="/donate" className="text-gray-400 hover:text-white transition-colors">
                  Donate to Conservation
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Hotlines & Quick Contacts */}
          <div>
            <h3 className="text-white text-sm font-bold uppercase tracking-wider mb-4 border-l-2 border-primary pl-2">
              24/7 Hotline Contacts
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
            Designed with <Heart className="h-3.5 w-3.5 text-primary fill-primary animate-pulse" /> for Nepal Wildlife Biodiversity.
          </p>
        </div>

      </div>
    </footer>
  );
};

export default Footer;

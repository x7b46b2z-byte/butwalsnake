'use client';

import React from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import { ShieldAlert, Phone, Mail, MapPin, Heart, Facebook, Instagram } from 'lucide-react';

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
              <a
                href="https://facebook.com/butwalsnakerescuers"
                target="_blank"
                rel="noreferrer"
                className="p-2 bg-white/5 hover:bg-primary/10 border border-white/10 hover:border-primary/20 rounded-lg text-gray-400 hover:text-primary transition-all duration-300"
                aria-label="Facebook"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href="https://instagram.com/butwalsnakerescuers"
                target="_blank"
                rel="noreferrer"
                className="p-2 bg-white/5 hover:bg-primary/10 border border-white/10 hover:border-primary/20 rounded-lg text-gray-400 hover:text-primary transition-all duration-300"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" />
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
            Designed by semicolon victims ;
          </p>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
